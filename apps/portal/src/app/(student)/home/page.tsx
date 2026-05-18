// apps/portal/src/app/(student)/home/page.tsx
// Server Component — no 'use client'

import { PaideonBadge } from "@/components/ui/PaideonBadge";

// ─── Sample data ──────────────────────────────────────────────────────────────
// For presentation: swap photoUrl for any portrait photo URL, or set to null
// for the initials fallback.

const SAMPLE_USER = {
  firstName: "Roshana",
  lastName: "Chamila",
  paideonId: "KCCM-STU-04198",
  currentGrade: 12 as const,
  admissionNumber: "04198",
  cardNumber: "KCCM-LIB-04198",
  role: "STUDENT" as const,
  photoUrl: "https://i.pravatar.cc/400?img=11",
  // ↑ Replace with a real photo URL, or set to null for the initials avatar
};

const STATS = [
  { value: "12", label: "Books Borrowed" },
  { value: "3", label: "Currently Reading" },
  { value: "14", label: "Day Streak" },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentHomePage() {
  return (
    <>
      {/*
        Inject a tiny style block for the hover states and responsive tweaks.
        Using a <style> tag inside a Server Component is valid in Next.js App Router.
      */}
      <style>{`
        .hero-vault-btn:hover  { background: #3A7065 !important; }
        .hero-loans-btn:hover  { border-color: rgba(255,255,255,0.25) !important; color: rgba(255,255,255,0.8) !important; }
        .hero-stat-num         { font-variant-numeric: tabular-nums; }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          background: "#0E1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 6vw",
          gap: 32,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ─── Background decoration ─── */}

        {/* Faint grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `
            linear-gradient(rgba(78,124,111,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78,124,111,0.04) 1px, transparent 1px)
          `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Sage glow behind badge */}
        <div
          style={{
            position: "absolute",
            right: "18%",
            top: "50%",
            transform: "translate(50%,-50%)",
            width: 640,
            height: 640,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(78,124,111,0.10) 0%, transparent 68%)",
            pointerEvents: "none",
          }}
        />

        {/* Gold warmth — upper right */}
        <div
          style={{
            position: "absolute",
            right: "22%",
            top: "15%",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ─── Left column ─── */}
        <div
          style={{ flex: 1, maxWidth: 500, position: "relative", zIndex: 1 }}
        >
          {/* Label */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 28,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#4E7C6F",
              }}
            />
            <span
              style={{
                color: "#4E7C6F",
                fontSize: 10,
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Student Portal
            </span>
          </div>

          {/* Greeting */}
          <h1
            style={{
              color: "rgba(250,248,244,0.55)",
              fontSize: "clamp(36px,4.5vw,56px)",
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.08,
              margin: "0 0 2px",
            }}
          >
            {greeting()},
          </h1>
          <h1
            style={{
              color: "#FAF8F4",
              fontSize: "clamp(36px,4.5vw,56px)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              lineHeight: 1.08,
              margin: "0 0 20px",
            }}
          >
            {SAMPLE_USER.firstName}.
          </h1>

          {/* Paideon ID — monospace, subtle */}
          <p
            style={{
              color: "rgba(255,255,255,0.18)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              margin: "0 0 28px",
            }}
          >
            {SAMPLE_USER.paideonId}
          </p>

          {/* Sage rule */}
          <div
            style={{
              width: 36,
              height: 1,
              background: "linear-gradient(90deg,#4E7C6F,transparent)",
              marginBottom: 36,
            }}
          />

          {/* Stats */}
          <div style={{ display: "flex", gap: 36, marginBottom: 44 }}>
            {STATS.map((s, i) => (
              <div key={i}>
                <div
                  className="hero-stat-num"
                  style={{
                    color: "#FAF8F4",
                    fontSize: "clamp(24px,3vw,34px)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 11,
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="/vault"
              className="hero-vault-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#4E7C6F",
                color: "#FAF8F4",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.03em",
                padding: "11px 22px",
                borderRadius: 8,
                textDecoration: "none",
                border: "1px solid transparent",
                transition: "background 0.2s",
              }}
            >
              Explore the Vault <span style={{ opacity: 0.7 }}>→</span>
            </a>
            <a
              href="/loans"
              className="hero-loans-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.03em",
                padding: "11px 22px",
                borderRadius: 8,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "border-color 0.2s, color 0.2s",
              }}
            >
              My Loans <span style={{ opacity: 0.6 }}>→</span>
            </a>
          </div>
        </div>

        {/* ─── Right column — badge ─── */}
        <div
          style={{
            width: "clamp(320px,38vw,460px)",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/*
            The Canvas uses gl.alpha=true so this background shows through.
            The card hangs from the top of the canvas and swings into view.
            Height must be tall enough for the rope + full card to be visible.
          */}
          <PaideonBadge user={SAMPLE_USER} height="680px" />
        </div>
      </main>
    </>
  );
}
