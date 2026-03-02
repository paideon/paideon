import React, { useRef, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  hx: number; hy: number; hz: number;
  x:  number; y:  number; z:  number;
  vx: number; vy: number; vz: number;
  px: number; py: number;
  size:         number;
  baseOpacity:  number;
  pulseOffset:  number;
  pulseSpeed:   number;
  displacement: number;
  isCerebellum: boolean;
}

export interface NeuralBrainProps {
  className?: string;
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────────────────────────────────────

const PARTICLE_COUNT     = 680;
const CEREBELLUM_COUNT   = 80;   // dedicated particles for the cerebellum
const FOV                = 860;
const CURSOR_RADIUS      = 130;
const SYNAPSE_THRESHOLD  = 82;
const PRECOMPUTE_DIST_3D = 110;
const ROT_SPEED          = (2 * Math.PI) / (28 * 60);

const RET_K = 60;  const RET_D = 14; const RET_MASS = 1.2;
const EXP_K = 15;  const EXP_D = 8;  const EXP_FORCE = 1900;
const DISP_SCALE = 72;

// ─────────────────────────────────────────────────────────────────────────────
//  Colour helper
// ─────────────────────────────────────────────────────────────────────────────

function col(t: number, a: number): string {
  const tc = Math.max(0, Math.min(1, t));
  const ac = Math.max(0, Math.min(1, a));
  const r  = Math.round(0x4a + (0x7d - 0x4a) * tc);
  const g  = Math.round(0x9e + (0xdf - 0x9e) * tc);
  return `rgba(${r},${g},255,${ac.toFixed(3)})`;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Brain surface radius
//
//  Real human brain proportions (approximate):
//    Width  (lateral X):        140 mm  ← WIDEST
//    Length (anterior-post Z):  167 mm  ← LONGEST
//    Height (vertical Y):        93 mm  ← SHORTEST
//
//  We scale these up to world units: X=260, Z=300, Y=185
//  This fixes the #1 problem — the old code had Y=255 making it too tall.
// ─────────────────────────────────────────────────────────────────────────────

function brainSurfaceRadius(
  ux: number, uy: number, uz: number,
  theta: number, phi: number,
  crustBias: number,
): number {
  // Corrected proportions: wider than tall, longer front-to-back
  const RX = 260, RY = 185, RZ = 300;

  let R = 1.0 / Math.sqrt((ux / RX) ** 2 + (uy / RY) ** 2 + (uz / RZ) ** 2);

  // ── Crown flattening — top of brain is slightly flattened, not fully domed
  if (uy > 0.70) {
    R *= 1 - (uy - 0.70) / 0.30 * 0.18;
  }

  // ── Temporal lobe — the "ears" that hang down on each side
  //    Key to making it look like a brain, not a ball.
  //    Strong lateral + inferior bulge, wraps around to front slightly
  const lateral  = Math.pow(Math.abs(ux), 0.9);       // how far to the side
  const inferior = Math.max(0, -uy * 1.2 - 0.05);     // how far down
  const temporal = lateral * inferior;
  R += temporal * 88;   // was 48 — much more pronounced now

  // ── Frontal lobe protrusion — anterior-superior region
  //    The forehead bulge: forward and slightly up
  const frontalBulge = Math.max(0, uz) * Math.max(0, uy * 0.5) * Math.max(0, 1 - Math.abs(ux) * 2.5);
  R += frontalBulge * 36;

  // ── Occipital lobe — posterior region is slightly more pointed
  if (uz < -0.35) {
    const occipital = Math.max(0, -uz - 0.35) * Math.max(0, 0.5 - Math.abs(ux));
    R += occipital * 28;
  }

  // ── Parietal narrowing on sides near top
  if (uy > 0.45 && Math.abs(ux) > 0.55) {
    const squeeze = (uy - 0.45) * (Math.abs(ux) - 0.55);
    R *= 1 - squeeze * 0.22;
  }

  // ── Cortex fold noise — gyri and sulci
  //    Applied more broadly now (crustBias > 0.78 instead of 0.86)
  //    This creates the wrinkled cortex texture that screams "brain"
  const foldAmp = Math.max(0, (crustBias - 0.78) / 0.22);
  const fold =
    Math.sin(5.5  * theta + 1.17) * Math.cos(3.8  * phi + 0.38) * 26 +
    Math.sin(9.5  * theta - 0.73) * Math.cos(7.2  * phi + 1.05) * 15 +
    Math.sin(14.0 * theta + 2.04) * Math.sin(12.0 * phi - 0.91) *  8 +
    Math.sin(19.0 * theta - 1.30) * Math.cos(17.0 * phi + 0.60) *  4 +
    Math.sin(24.0 * theta + 0.55) * Math.sin(21.0 * phi + 1.40) *  2;

  return R + fold * foldAmp;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Generate cerebellum particles
//  The cerebellum sits at the posterior-inferior region — it's the small
//  "second brain" bump at the back-bottom. Without it the silhouette reads
//  as a generic blob.
// ─────────────────────────────────────────────────────────────────────────────

function generateCerebellum(count: number): Particle[] {
  const particles: Particle[] = [];
  // Cerebellum center: posterior (uz ≈ -0.7), inferior (uy ≈ -0.65)
  const CX = 0, CY = -150, CZ = -195;
  const CR = 75; // radius

  while (particles.length < count) {
    // Uniform sphere surface sampling
    const theta = Math.acos(1 - 2 * Math.random());
    const phi   = Math.random() * Math.PI * 2;
    const sinT  = Math.sin(theta);

    // Squash to make it flatter (ellipsoid: wider than tall)
    const x = CR * 1.4 * sinT * Math.cos(phi) + CX;
    const y = CR * 0.7 * Math.cos(theta)       + CY;
    const z = CR * 1.1 * sinT * Math.sin(phi)  + CZ;

    // Only keep the top half of the sphere (visible from above)
    // and exclude any point that's too far from center
    const dist = Math.sqrt((x - CX) ** 2 + (y - CY) ** 2 + (z - CZ) ** 2);
    if (dist < CR * 0.5) continue; // surface only

    // Fine horizontal folds — cerebellum has very tight parallel folds
    // Model as small ridges along the X axis
    const crustBias = (dist - CR * 0.5) / (CR * 0.5);
    const foldNoise = Math.sin(y * 0.18 + 1.2) * 8 * crustBias;

    const fx = x + foldNoise * 0.3;
    const fy = y + foldNoise;
    const fz = z;

    particles.push({
      hx: fx, hy: fy, hz: fz,
      x: fx,  y: fy,  z: fz,
      vx: 0,  vy: 0,  vz: 0,
      px: 0,  py: 0,
      size:         0.7 + Math.random() * 1.1,
      baseOpacity:  0.35 + Math.random() * 0.45,
      pulseOffset:  Math.random() * Math.PI * 2,
      pulseSpeed:   0.2 + Math.random() * 0.6,
      displacement: 0,
      isCerebellum: true,
    });
  }
  return particles;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Generate cerebral cortex particles
// ─────────────────────────────────────────────────────────────────────────────

function generateCortex(count: number): Particle[] {
  const particles: Particle[] = [];
  let attempts = 0;

  while (particles.length < count && attempts < count * 40) {
    attempts++;

    const theta = Math.acos(1 - 2 * Math.random());
    const phi   = Math.random() * Math.PI * 2;
    const sinT  = Math.sin(theta);

    const ux = sinT * Math.cos(phi);
    const uy = Math.cos(theta);
    const uz = sinT * Math.sin(phi);

    // Pure surface sampling — crustBias is very high (0.93–1.0)
    // This was the key fix: old code used 0.86+ which put particles inside,
    // making it look like a solid ball instead of a surface shell
    const crustBias = 0.93 + 0.07 * Math.pow(Math.random(), 0.08);

    const R   = brainSurfaceRadius(ux, uy, uz, theta, phi, crustBias);
    const len = R * crustBias;

    let x = len * ux;
    let y = len * uy;
    let z = len * uz;

    // ── Longitudinal fissure — the deep V-groove between hemispheres
    //    Width: 20–55px depending on height (wider at crown, closes at base)
    //    This is the single most important feature for brain recognition.
    if (uy > -0.25) {
      const depth    = (uy + 0.25) / 1.25;
      const fissureW = 20 + 35 * Math.pow(depth, 1.0); // was 8+24 — much wider
      if (Math.abs(x) < fissureW) continue;
    }

    // Exclude the posterior-inferior region (where cerebellum will sit)
    const isCerebellumZone = uz < -0.55 && uy < -0.50;
    if (isCerebellumZone) continue;

    // Subtle hemisphere asymmetry
    if (x > 0) { y += 5; x *= 0.968; }
    else        { z *= 1.035; y -= 3; }

    particles.push({
      hx: x, hy: y, hz: z,
      x, y, z,
      vx: 0, vy: 0, vz: 0,
      px: 0, py: 0,
      size:         0.88 + Math.random() * 1.62,
      baseOpacity:  0.48 + Math.random() * 0.52,
      pulseOffset:  Math.random() * Math.PI * 2,
      pulseSpeed:   0.22 + Math.random() * 0.78,
      displacement: 0,
      isCerebellum: false,
    });
  }

  return particles;
}

function generateBrain(count: number): Particle[] {
  const cortex      = generateCortex(count - CEREBELLUM_COUNT);
  const cerebellum  = generateCerebellum(CEREBELLUM_COUNT);
  return [...cortex, ...cerebellum];
}

// ─────────────────────────────────────────────────────────────────────────────
//  Synapse precomputation
// ─────────────────────────────────────────────────────────────────────────────

function precomputePairs(particles: Particle[], dist3D: number): Uint16Array {
  const d2  = dist3D * dist3D;
  const tmp: number[] = [];
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].hx - particles[j].hx;
      const dy = particles[i].hy - particles[j].hy;
      const dz = particles[i].hz - particles[j].hz;
      if (dx * dx + dy * dy + dz * dz < d2) tmp.push(i, j);
    }
  }
  return new Uint16Array(tmp);
}

// ─────────────────────────────────────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────────────────────────────────────

export default function NeuralBrain({ className, style }: NeuralBrainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef      = useRef<HTMLCanvasElement>(null);
  const glowRef      = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container  = containerRef.current!;
    const mainCanvas = mainRef.current!;
    const glowCanvas = glowRef.current!;
    const mainCtx    = mainCanvas.getContext('2d')!;
    const glowCtx    = glowCanvas.getContext('2d')!;

    const particles = generateBrain(PARTICLE_COUNT);
    const pairs     = precomputePairs(particles, PRECOMPUTE_DIST_3D);

    let rotAngle = 0;
    let W = 0, H = 0;
    let cursorX = -99999, cursorY = -99999;
    let rafId   = 0;
    let lastT   = performance.now();

    function resize() {
      W = container.offsetWidth;
      H = container.offsetHeight;
      mainCanvas.width  = W;  mainCanvas.height  = H;
      glowCanvas.width  = W;  glowCanvas.height  = H;
    }
    resize();

    function project(x: number, y: number, z: number): [number, number, number] {
      const s = FOV / (FOV + z);
      // Shift brain up slightly so cerebellum isn't cut off at bottom
      return [x * s + W * 0.5, -y * s + H * 0.44, s];
    }

    for (const p of particles) {
      const [px, py] = project(p.x, p.y, p.z);
      p.px = px; p.py = py;
    }

    function frame(now: number) {
      rafId = requestAnimationFrame(frame);
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      rotAngle += ROT_SPEED;
      const cosR = Math.cos(rotAngle);
      const sinR = Math.sin(rotAngle);

      mainCtx.clearRect(0, 0, W, H);
      glowCtx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const rhx =  p.hx * cosR - p.hz * sinR;
        const rhz =  p.hx * sinR + p.hz * cosR;
        const rhy =  p.hy;

        const sdx = p.px - cursorX;
        const sdy = p.py - cursorY;
        const sd2 = sdx * sdx + sdy * sdy;
        const inRange = sd2 < CURSOR_RADIUS * CURSOR_RADIUS;

        if (inRange && sd2 > 0.5) {
          const sd        = Math.sqrt(sd2);
          const proximity = 1 - sd / CURSOR_RADIUS;
          const force     = proximity * EXP_FORCE * (1 - p.displacement * 0.45);
          p.vx +=  (sdx / sd) * force * dt;
          p.vy -= -(sdy / sd) * force * dt;
          p.vz += (Math.random() * 2 - 1) * force * 0.34 * dt;
        }

        const sk   = inRange ? EXP_K : RET_K;
        const damp = inRange ? EXP_D : RET_D;
        p.vx += ((rhx - p.x) * sk - p.vx * damp) / RET_MASS * dt;
        p.vy += ((rhy - p.y) * sk - p.vy * damp) / RET_MASS * dt;
        p.vz += ((rhz - p.z) * sk - p.vz * damp) / RET_MASS * dt;

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;

        const ddx = p.x - rhx, ddy = p.y - rhy, ddz = p.z - rhz;
        p.displacement = Math.min(1, Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz) / DISP_SCALE);

        const [px, py, ps] = project(p.x, p.y, p.z);
        p.px = px; p.py = py;

        const pulse  = 0.72 + 0.28 * Math.sin(now * 0.001 * p.pulseSpeed + p.pulseOffset);
        // Cerebellum is slightly dimmer / more cyan
        const alpha  = p.baseOpacity * pulse * (1 - p.displacement * 0.30) * (p.isCerebellum ? 0.75 : 1);
        const colorT = (p.y + 185) / 370;
        const radius = p.size * ps;

        glowCtx.beginPath();
        glowCtx.arc(px, py, radius * 5.5, 0, Math.PI * 2);
        glowCtx.fillStyle = col(colorT, alpha * 0.65);
        glowCtx.fill();

        mainCtx.beginPath();
        mainCtx.arc(px, py, radius, 0, Math.PI * 2);
        mainCtx.fillStyle = col(colorT, alpha);
        mainCtx.fill();
      }

      // Synapses
      const thr2 = SYNAPSE_THRESHOLD * SYNAPSE_THRESHOLD;
      mainCtx.beginPath();
      mainCtx.lineWidth = 0.5;
      for (let k = 0; k < pairs.length; k += 2) {
        const pa = particles[pairs[k]];
        const pb = particles[pairs[k + 1]];
        if (pa.displacement > 0.20 || pb.displacement > 0.20) continue;
        const dx = pa.px - pb.px, dy = pa.py - pb.py;
        if (dx * dx + dy * dy > thr2) continue;
        mainCtx.moveTo(pa.px, pa.py);
        mainCtx.lineTo(pb.px, pb.py);
      }
      mainCtx.strokeStyle = 'rgba(110,185,255,0.13)';
      mainCtx.stroke();
    }

    rafId = requestAnimationFrame(frame);

    function onMouseMove(e: MouseEvent) {
      const r = container.getBoundingClientRect();
      cursorX = e.clientX - r.left;
      cursorY = e.clientY - r.top;
    }
    function onMouseLeave() { cursorX = -99999; cursorY = -99999; }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <canvas
        ref={glowRef}
        style={{ position: 'absolute', inset: 0, filter: 'blur(16px)', opacity: 0.55, pointerEvents: 'none' }}
      />
      <canvas
        ref={mainRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
    </div>
  );
}