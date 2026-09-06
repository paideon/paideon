"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  RapierRigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import type { Role } from "@paideon/types";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: object;
    meshLineMaterial: {
      color?: string | number;
      lineWidth?: number;
      resolution?: [number, number];
      depthTest?: boolean;
      transparent?: boolean;
      opacity?: number;
    };
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BadgeUser {
  firstName: string;
  lastName: string;
  paideonId: string;
  currentGrade: number;
  admissionNumber: string;
  cardNumber: string;
  role: Role;
  initials?: string;
  /** Any image URL — renders as avatar photo. null = initials fallback. */
  photoUrl?: string | null;
}

export interface PaideonBadgeProps {
  user?: Partial<BadgeUser>;
  height?: string;
  className?: string;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  navy: "#001F3F",
  navyMid: "#002A56",
  navy700: "#003F7A",
  sage: "#4E7C6F",
  sage400: "#6A9E91",
  gold: "#C9A84C",
  goldLight: "#E4CC8A",
  cream: "#FAF8F4",
  ink: "#0E1117",
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(u: BadgeUser) {
  if (u.initials) return u.initials;
  return `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase();
}

function roleLabel(r: Role) {
  return (
    (
      {
        STUDENT: "Student",
        TEACHER: "Teacher",
        LIBRARIAN: "Librarian",
        ADMIN: "Admin",
        PARENT: "Parent",
        STAFF: "Staff",
      } as Record<Role, string>
    )[r] ?? r
  );
}

// ─── Badge canvas ─────────────────────────────────────────────────────────────
// Canvas is 768×960 — SAME 0.8 aspect ratio as the card geometry (1.6 × 2.0)
// This is the #1 fix — previous canvas was landscape which made it look broken

function drawBadge(
  ctx: CanvasRenderingContext2D,
  user: BadgeUser,
  photo: HTMLImageElement | null
) {
  const W = 768,
    H = 960;

  // ── Background ──
  ctx.fillStyle = T.navy;
  ctx.fillRect(0, 0, W, H);

  // ── Sage top stripe ──
  ctx.fillStyle = T.sage;
  ctx.fillRect(0, 0, W, 20);

  // ── Gold shimmer ──
  ctx.globalAlpha = 0.55;
  const gs = ctx.createLinearGradient(0, 0, W, 0);
  gs.addColorStop(0, "transparent");
  gs.addColorStop(0.2, T.gold);
  gs.addColorStop(0.5, T.goldLight);
  gs.addColorStop(0.8, T.gold);
  gs.addColorStop(1, "transparent");
  ctx.fillStyle = gs;
  ctx.fillRect(0, 20, W, 5);
  ctx.globalAlpha = 1;

  // ── School name ──
  ctx.textAlign = "center";
  ctx.fillStyle = T.gold;
  ctx.font = "700 22px system-ui, sans-serif";
  ctx.fillText("C.W.W. KANNANGARA CENTRAL COLLEGE", W / 2, 72);
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.font = "500 14px system-ui";
  ctx.fillText("P  A  I  D  E  O  N", W / 2, 96);

  // ── Lanyard hole ──
  const hx = W / 2,
    hy = 126,
    hr = 22;
  ctx.fillStyle = "rgba(0,0,0,0.9)";
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(hx, hy, hr, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // inner metal ring
  ctx.strokeStyle = "rgba(201,168,76,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(hx, hy, hr - 8, 0, Math.PI * 2);
  ctx.stroke();

  // ── Divider ──
  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(64, 164);
  ctx.lineTo(W - 64, 164);
  ctx.stroke();

  // ── Avatar ──
  const ax = W / 2,
    ay = 316,
    ar = 108;
  // glow
  ctx.strokeStyle = "rgba(201,168,76,0.13)";
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(ax, ay, ar + 16, 0, Math.PI * 2);
  ctx.stroke();
  // gold ring
  ctx.strokeStyle = T.gold;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(ax, ay, ar + 7, 0, Math.PI * 2);
  ctx.stroke();
  // clip + draw
  ctx.save();
  ctx.beginPath();
  ctx.arc(ax, ay, ar, 0, Math.PI * 2);
  ctx.clip();
  if (photo) {
    // Draw photo, cropped to square centered
    const minDim = Math.min(photo.naturalWidth, photo.naturalHeight);
    const sx = (photo.naturalWidth - minDim) / 2;
    const sy = (photo.naturalHeight - minDim) / 2;
    ctx.drawImage(
      photo,
      sx,
      sy,
      minDim,
      minDim,
      ax - ar,
      ay - ar,
      ar * 2,
      ar * 2
    );
    // Subtle overlay so school/Paideon branding reads on top of photo
    const ov = ctx.createLinearGradient(ax, ay - ar, ax, ay + ar);
    ov.addColorStop(0, "rgba(0,31,63,0.3)");
    ov.addColorStop(1, "rgba(0,31,63,0.1)");
    ctx.fillStyle = ov;
    ctx.fillRect(ax - ar, ay - ar, ar * 2, ar * 2);
  } else {
    const rg = ctx.createRadialGradient(ax, ay - 20, 0, ax, ay, ar);
    rg.addColorStop(0, T.navy700);
    rg.addColorStop(1, T.navyMid);
    ctx.fillStyle = rg;
    ctx.fillRect(ax - ar, ay - ar, ar * 2, ar * 2);
    ctx.fillStyle = T.gold;
    ctx.font = "600 90px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getInitials(user), ax, ay);
    ctx.textBaseline = "alphabetic";
  }
  ctx.restore();

  // ── Name ──
  ctx.fillStyle = T.cream;
  ctx.font = "600 42px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(`${user.firstName} ${user.lastName}`.trim(), W / 2, 480);

  // ── Role tag ──
  const rl = roleLabel(user.role).toUpperCase();
  const rw = 182,
    rh = 40,
    rx = (W - rw) / 2,
    ry = 494;
  ctx.fillStyle = "rgba(78,124,111,0.18)";
  ctx.strokeStyle = "rgba(78,124,111,0.55)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(rx, ry, rw, rh);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = T.sage400;
  ctx.font = "600 15px system-ui";
  ctx.fillText(rl, W / 2, ry + 26);

  // ── Divider ──
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(64, 558);
  ctx.lineTo(W - 64, 558);
  ctx.stroke();

  // ── Info ──
  const lbl = (t: string, x: number, y: number) => {
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.font = "500 12px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(t, x, y);
  };
  const val = (t: string, x: number, y: number, mono = false) => {
    ctx.fillStyle = T.cream;
    ctx.font = `500 20px ${mono ? '"Courier New",monospace' : "system-ui"}`;
    ctx.fillText(t, x, y);
  };
  lbl("GRADE", 72, 590);
  val(`Grade ${user.currentGrade}`, 72, 614);
  lbl("ADMISSION NO.", 380, 590);
  val(user.admissionNumber, 380, 614, true);

  // ── Paideon ID box ──
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.rect(60, 638, W - 120, 90);
  ctx.fill();
  ctx.stroke();
  lbl("PAIDEON ID", 84, 663);
  ctx.fillStyle = T.gold;
  ctx.font = '600 24px "Courier New", monospace';
  ctx.textAlign = "left";
  ctx.fillText(user.paideonId, 84, 700);

  // ── Barcode decoration ──
  let bx = 60;
  for (let i = 0; i < 90 && bx < W - 64; i++) {
    const bw = ([1, 1, 1, 2, 2, 3] as const)[i % 6] ?? 1;
    const bh = 12 + (i % 8) * 4.5;
    ctx.fillStyle = `rgba(255,255,255,${0.05 + (i % 6) * 0.03})`;
    ctx.fillRect(bx, 762 + (36 - bh), bw * 1.6, bh);
    bx += bw * 1.6 + (i % 5 === 0 ? 4 : 1.8);
  }

  // ── Footer ──
  ctx.fillStyle = "rgba(255,255,255,0.13)";
  ctx.font = "400 11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(
    "ISSUED BY KANNANGARA ICT SOCIETY  ·  NOT TRANSFERABLE",
    W / 2,
    830
  );

  // ── Gloss overlay (top-left sheen) ──
  const gl = ctx.createLinearGradient(0, 0, W * 0.7, H * 0.35);
  gl.addColorStop(0, "rgba(255,255,255,0.04)");
  gl.addColorStop(1, "transparent");
  ctx.fillStyle = gl;
  ctx.fillRect(0, 0, W, H);
}

// ─── Texture hook ─────────────────────────────────────────────────────────────

function useBadgeTexture(user: BadgeUser): THREE.CanvasTexture {
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!user.photoUrl) {
      setPhoto(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setPhoto(img);
    img.onerror = () => setPhoto(null);
    img.src = user.photoUrl;
  }, [user.photoUrl]);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d context");
    drawBadge(ctx, user, photo);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    // flipY=true (default) is correct for plane geometry
    return t;
  }, [user, photo]);

  useEffect(
    () => () => {
      texture.dispose();
    },
    [texture]
  );

  return texture;
}

// ─── Band (scene) ─────────────────────────────────────────────────────────────

const SEG = {
  type: "dynamic" as const,
  canSleep: true,
  colliders: false as const,
  angularDamping: 4,
  linearDamping: 4,
};

// Card world dimensions — MUST match canvas aspect (768/960 = 0.8)
const CW = 1.6; // card width  (world units)
const CH = 2.0; // card height (world units)  →  ratio = 0.8 ✓

function Band({
  user,
  maxSpeed = 50,
  minSpeed = 10,
}: {
  user: BadgeUser;
  maxSpeed?: number;
  minSpeed?: number;
}) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(
    null
  ) as React.RefObject<RapierRigidBody>;
  const j1 = useRef<RapierRigidBody>(null) as React.RefObject<RapierRigidBody>;
  const j2 = useRef<RapierRigidBody>(null) as React.RefObject<RapierRigidBody>;
  const j3 = useRef<RapierRigidBody>(null) as React.RefObject<RapierRigidBody>;
  const card = useRef<RapierRigidBody>(
    null
  ) as React.RefObject<RapierRigidBody>;

  const j1lerped = useRef<THREE.Vector3 | null>(null);
  const j2lerped = useRef<THREE.Vector3 | null>(null);

  // Scratch vectors — allocated once, never recreated
  const vec = useRef(new THREE.Vector3()).current;
  const dir = useRef(new THREE.Vector3()).current;

  const { width, height } = useThree((s) => s.size);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  const badgeTexture = useBadgeTexture(user);

  // Joints — exact Vercel article structure
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  // Attach rope to top of card (CH/2 - a small margin = 0.88)
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CH / 2 - 0.12, 0],
  ]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (
      !fixed.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !card.current ||
      !band.current
    )
      return;

    // Lerp j1+j2 for smooth rope (reduces snap when over-pulling)
    if (!j1lerped.current)
      j1lerped.current = new THREE.Vector3().copy(j1.current.translation());
    if (!j2lerped.current)
      j2lerped.current = new THREE.Vector3().copy(j2.current.translation());
    const d1 = Math.max(
      0.1,
      Math.min(1, j1lerped.current.distanceTo(j1.current.translation()))
    );
    const d2 = Math.max(
      0.1,
      Math.min(1, j2lerped.current.distanceTo(j2.current.translation()))
    );
    j1lerped.current.lerp(
      j1.current.translation(),
      delta * (minSpeed + d1 * (maxSpeed - minSpeed))
    );
    j2lerped.current.lerp(
      j2.current.translation(),
      delta * (minSpeed + d2 * (maxSpeed - minSpeed))
    );

    // Update CatmullRom curve
    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2lerped.current);
    curve.points[2].copy(j1lerped.current);
    curve.points[3].copy(fixed.current.translation());
    (band.current.geometry as MeshLineGeometry).setPoints(curve.getPoints(32));

    // NOTE: No setAngvel correction — that's what was causing the shaking.
    // High angularDamping (4) handles rotation naturally.
  });

  curve.curveType = "chordal";

  return (
    <>
      {/* All joints start horizontally — fall & swing into view naturally */}
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...SEG} type="fixed" />
        <RigidBody ref={j1} {...SEG} position={[0.5, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j2} {...SEG} position={[1.0, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j3} {...SEG} position={[1.5, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Card */}
        <RigidBody
          ref={card}
          {...SEG}
          position={[2, 0, 0]}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          {/* Collider half-extents */}
          <CuboidCollider args={[CW / 2, CH / 2, 0.01]} />

          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              if (!card.current) return;
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            {/* Front — badge texture via meshBasicMaterial (no lighting = always visible) */}
            <mesh>
              <planeGeometry args={[CW, CH]} />
              <meshBasicMaterial map={badgeTexture} side={THREE.FrontSide} />
            </mesh>

            {/* Back — navy */}
            <mesh rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CW, CH]} />
              <meshStandardMaterial color={T.navyMid} roughness={0.4} />
            </mesh>

            {/* Thin edge so card has physical depth */}
            <mesh>
              <boxGeometry args={[CW, CH, 0.016]} />
              <meshStandardMaterial color={T.navy} roughness={0.5} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      {/* Lanyard band — sage green, solid color, proper thickness */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color={T.sage}
          lineWidth={1}
          resolution={[width, height]}
          depthTest={false}
          transparent
          opacity={0.95}
        />
      </mesh>
    </>
  );
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_USER: BadgeUser = {
  firstName: "Student",
  lastName: "",
  paideonId: "KCCM-STU-00000",
  currentGrade: 12,
  admissionNumber: "00000",
  cardNumber: "KCCM-LIB-00000",
  role: "STUDENT",
};

// ─── Export ───────────────────────────────────────────────────────────────────

export function PaideonBadge({
  user,
  height = "680px",
  className = "",
}: PaideonBadgeProps) {
  const u: BadgeUser = { ...DEFAULT_USER, ...user };

  return (
    <div className={className} style={{ width: "100%", height }}>
      <Canvas
        gl={{ alpha: true, antialias: true }} // alpha=true → transparent bg, page shows through
        camera={{ position: [0, 0, 13], fov: 25 }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}
      >
        <ambientLight intensity={Math.PI} />
        {/* Light from front so the basic material card reads well */}
        <directionalLight position={[0, 0, 5]} intensity={1} />
        <Physics interpolate gravity={[0, -20, 0]} timeStep={1 / 60}>
          <Band user={u} />
        </Physics>
        <Environment>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

export default PaideonBadge;
