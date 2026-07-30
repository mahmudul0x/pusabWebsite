import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, Sparkles } from "lucide-react";
import logoPusab from "@/assets/logo-pusab.png";
import celebrateBanner from "@/assets/celebrate-modal.webp";
import { CanvasConfetti } from "./CanvasConfetti";

const CONFETTI_COLORS = [
  "var(--color-accent-1)",
  "var(--color-accent-2)",
  "var(--color-accent-3)",
  "#ffffff",
];

const EASE = [0.16, 1, 0.3, 1] as const;

function isAnniversary() {
  const d = new Date();
  return d.getMonth() === 6 && (d.getDate() === 30 || d.getDate() === 31); // July is month 6 (0-indexed)
}

type ConfettiShape = "bar" | "dot" | "ring";

function ConfettiField({ active }: { active: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 52 }, (_, i) => {
        const shapes: ConfettiShape[] = ["bar", "dot", "ring"];
        return {
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 1.4,
          duration: 3.2 + Math.random() * 2.4,
          size: 5 + Math.random() * 9,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          spin: (Math.random() - 0.5) * 720,
          drift: (Math.random() - 0.5) * 160,
          shape: shapes[i % shapes.length],
        };
      }),
    [],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "-12%", x: 0, opacity: 0, rotate: 0 }}
          animate={{ y: "120%", x: p.drift, opacity: [0, 1, 1, 0], rotate: p.spin }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: 0,
            width: p.shape === "ring" ? p.size : p.size,
            height: p.shape === "bar" ? p.size * 0.35 : p.size,
            background: p.shape === "ring" ? "transparent" : p.color,
            border: p.shape === "ring" ? `2px solid ${p.color}` : undefined,
            borderRadius: p.shape === "bar" ? 2 : "50%",
          }}
        />
      ))}
    </div>
  );
}

const BALLOON_COLORS = [
  "var(--color-accent-1)",
  "var(--color-accent-2)",
  "var(--color-accent-3)",
  "#F59E0B",
  "#EC4899",
];

/**
 * Celebration pieces raining down over the whole screen — streamers, stars and
 * discs — so the modal is framed from above as well as below.
 */
function FallingCelebration({ active }: { active: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        duration: 4 + Math.random() * 3.5,
        size: 8 + Math.random() * 14,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        drift: (Math.random() - 0.5) * 220,
        spin: (Math.random() - 0.5) * 900,
        kind: (["streamer", "star", "disc"] as const)[i % 3],
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[10001] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "-15vh", x: 0, opacity: 0, rotate: 0 }}
          animate={{ y: "115vh", x: p.drift, opacity: [0, 1, 1, 0], rotate: p.spin }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
          style={{ position: "absolute", left: `${p.left}%`, top: 0 }}
        >
          {p.kind === "star" ? (
            <svg width={p.size * 1.4} height={p.size * 1.4} viewBox="0 0 24 24" fill={p.color}>
              <path d="M12 1.8l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8-6.1-3.4-6.1 3.4 1.4-6.8L2.2 8.9l6.9-.8z" />
            </svg>
          ) : p.kind === "disc" ? (
            <div
              style={{
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: p.color,
                opacity: 0.9,
              }}
            />
          ) : (
            <div
              style={{
                width: p.size * 0.42,
                height: p.size * 1.9,
                borderRadius: 3,
                background: p.color,
                opacity: 0.9,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function BalloonField({ active }: { active: boolean }) {
  const balloons = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: 1 + Math.random() * 97,
        delay: Math.random() * 2.8,
        duration: 6 + Math.random() * 4,
        size: 38 + Math.random() * 46,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        sway: 16 + Math.random() * 32,
        swayPeriod: 2.4 + Math.random() * 2,
        tilt: (Math.random() - 0.5) * 16,
      })),
    [],
  );

  // A few sparkles drifting up alongside the balloons for extra depth.
  const sparkles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 4 + Math.random() * 3,
        size: 3 + Math.random() * 5,
        color: BALLOON_COLORS[(i + 2) % BALLOON_COLORS.length],
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[10001] overflow-hidden">
      {sparkles.map((s) => (
        <motion.span
          key={`s${s.id}`}
          initial={{ y: "104vh", opacity: 0, scale: 0.6 }}
          animate={{ y: "-10vh", opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.7] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            bottom: 0,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: s.color,
            boxShadow: `0 0 ${s.size * 2.5}px ${s.color}`,
          }}
        />
      ))}

      {balloons.map((b) => (
        <motion.div
          key={b.id}
          initial={{ y: "112vh", opacity: 0 }}
          animate={{ y: "-28vh", opacity: [0, 1, 1, 1, 0] }}
          transition={{
            y: { duration: b.duration, delay: b.delay, ease: "linear", repeat: Infinity },
            opacity: {
              duration: b.duration,
              delay: b.delay,
              times: [0, 0.06, 0.5, 0.88, 1],
              repeat: Infinity,
            },
          }}
          style={{ position: "absolute", left: `${b.left}%`, bottom: 0, width: b.size }}
        >
          {/* Horizontal sway is its own layer so it can loop independently of the rise. */}
          <motion.div
            animate={{
              x: [-b.sway / 2, b.sway / 2, -b.sway / 2],
              rotate: [-b.tilt, b.tilt, -b.tilt],
            }}
            transition={{ duration: b.swayPeriod, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 138" width={b.size} height={b.size * 1.38} fill="none">
              <defs>
                <radialGradient id={`bg${b.id}`} cx="34%" cy="28%" r="72%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                  <stop offset="45%" stopColor={b.color} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={b.color} stopOpacity="1" />
                </radialGradient>
              </defs>
              <ellipse cx="50" cy="50" rx="42" ry="50" fill={`url(#bg${b.id})`} />
              <ellipse cx="34" cy="30" rx="9" ry="14" fill="#ffffff" opacity={0.5} />
              <path d="M50 100 L43 111 L57 111 Z" fill={b.color} />
              <path
                d="M50 111 C 58 118, 42 124, 50 136"
                stroke={b.color}
                strokeWidth={1.6}
                strokeLinecap="round"
                opacity={0.55}
                fill="none"
              />
            </svg>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-[var(--color-accent-1)] opacity-40 blur-[80px]"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[var(--color-accent-2)] opacity-30 blur-[90px]"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent-3)] opacity-20 blur-[100px]"
      />
    </div>
  );
}

/** Brief cinematic intro: rings pulse out from the logo before the card reveals. */
function IntroBurst({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 1400);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <motion.div
      key="intro"
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="fixed inset-0 z-[10002] flex items-center justify-center bg-slate-950"
    >
      {/* Soft brand wash behind the mark. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute h-[46vh] w-[46vh] rounded-full bg-[radial-gradient(circle,var(--color-accent-1),transparent_65%)] blur-[70px]"
      />

      <div className="relative flex flex-col items-center justify-center">
        <div className="relative flex h-32 w-32 items-center justify-center">
          {/* Expanding echo rings. */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.45, opacity: 0.65 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 1.8, delay: i * 0.3, ease: "easeOut", repeat: Infinity }}
              className="absolute h-24 w-24 rounded-full border border-[var(--color-accent-1)]"
            />
          ))}

          {/* Sweeping conic arc — the "spotlight" that reveals the mark. */}
          <motion.span
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            transition={{
              rotate: { duration: 2.4, repeat: Infinity, ease: "linear" },
              opacity: { duration: 0.5 },
            }}
            className="absolute h-28 w-28 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, transparent 250deg, var(--color-accent-1) 340deg, transparent 360deg)",
              maskImage: "radial-gradient(circle, transparent 60%, #000 62%, #000 100%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 60%, #000 62%, #000 100%)",
            }}
          />

          <motion.img
            src={logoPusab}
            alt="PUSAB"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative h-20 w-20 object-contain drop-shadow-[0_0_34px_rgba(3,169,236,0.55)]"
          />
        </div>

        {/* Wordmark wipes in beneath the logo. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
          className="mt-6 overflow-hidden"
        >
          <p className="font-display text-xs font-semibold uppercase tracking-[0.42em] text-white/70">
            Est. 2014
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function LaunchCelebrationModal() {
  const [phase, setPhase] = useState<"idle" | "intro" | "card">("idle");

  useEffect(() => {
    if (!isAnniversary()) return;
    const id = setTimeout(() => setPhase("intro"), 500);
    return () => clearTimeout(id);
  }, []);

  // Dismiss on its own once the celebration has played, so visitors reach the
  // site without having to close it.
  useEffect(() => {
    if (phase !== "card") return;
    const id = setTimeout(() => setPhase("idle"), 10000);
    return () => clearTimeout(id);
  }, [phase]);

  const close = () => setPhase("idle");

  return (
    <>
      {/* Sits above the page but below the modal overlay, so the burst covers the
          whole screen while framing the card. Tied to the card phase — closing
          the modal unmounts it, which cancels the rAF loop and its listeners. */}
      <CanvasConfetti active={phase === "card"} zIndex={9998} />

      <AnimatePresence mode="wait">
        {phase === "intro" && <IntroBurst key="intro" onDone={() => setPhase("card")} />}

        {phase === "card" && (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="12th anniversary announcement"
          >
            <BalloonField active={phase === "card"} />
            <FallingCelebration active={phase === "card"} />

            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.9, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 16, scale: 0.94 }}
              transition={{ duration: 0.65, ease: EASE }}
              style={{ perspective: 1200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-[10002] flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[30px] bg-[var(--color-surface)] text-center shadow-[0_60px_150px_-30px_rgba(2,6,23,0.9),0_0_0_1px_rgba(255,255,255,0.08)]"
            >
              {/* Gradient halo hugging the card edge. */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="pointer-events-none absolute inset-0 rounded-[30px] p-[1.5px]"
                style={{
                  background:
                    "linear-gradient(140deg, var(--color-accent-1), transparent 35%, transparent 65%, var(--color-accent-3))",
                  maskImage: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskImage:
                    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  maskComposite: "exclude",
                  WebkitMaskComposite: "xor",
                }}
              />

              <AmbientGlow />
              <ConfettiField active={phase === "card"} />

              {/* Top ribbon accent */}
              <div className="sticky top-0 z-10 h-[3px] shrink-0 bg-[linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2),var(--color-accent-3))]" />

              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-3 top-4 z-20 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <X size={15} />
              </button>

              <div className="relative min-h-0 shrink px-5 pt-8 sm:px-8 sm:pt-9">
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.12, duration: 0.7, ease: EASE }}
                  className="relative overflow-hidden rounded-2xl border border-black/[0.06] shadow-[0_18px_50px_-18px_rgba(2,6,23,0.35)]"
                >
                  <img
                    src={celebrateBanner}
                    alt="PUSAB's 12th anniversary and official website inauguration"
                    className="max-h-[42vh] w-full object-contain"
                  />
                  {/* Sheen that sweeps across the banner once it lands. */}
                  <motion.div
                    initial={{ x: "-120%" }}
                    animate={{ x: "120%" }}
                    transition={{ delay: 0.9, duration: 1.1, ease: "easeInOut" }}
                    className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]"
                  />
                </motion.div>
              </div>

              <div className="relative shrink-0 px-6 pb-6 pt-5 sm:px-9">
                {/* Ornamental divider */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.34, duration: 0.7, ease: EASE }}
                  className="mx-auto flex w-full max-w-xs items-center gap-3"
                >
                  <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-accent-1)_45%,transparent))]" />
                  <Sparkles size={13} className="shrink-0 text-[var(--color-accent-1)]" />
                  <span className="h-px flex-1 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-accent-3)_45%,transparent),transparent)]" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44, duration: 0.55 }}
                  className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed text-muted-foreground sm:text-sm"
                >
                  On 30 July, PUSAB turns 12. To mark it, we're unveiling a brand new website —
                  built to carry our story forward.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.62, duration: 0.5 }}
                  className="mt-5 flex flex-wrap items-center justify-center gap-3"
                >
                  <button
                    onClick={close}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_-14px_color-mix(in_oklab,var(--color-accent-1)_75%,transparent)] transition-transform hover:scale-[1.03]"
                  >
                    <span className="relative z-10">Explore the new site</span>
                    <ArrowRight
                      size={15}
                      className="relative z-10 transition-transform group-hover:translate-x-1"
                    />
                    {/* Light sweep across the button */}
                    <motion.span
                      aria-hidden
                      initial={{ x: "-150%" }}
                      animate={{ x: "150%" }}
                      transition={{ delay: 1.3, duration: 1.4, repeat: Infinity, repeatDelay: 1.6 }}
                      className="absolute inset-y-0 w-1/2 skew-x-[-20deg] bg-white/25"
                    />
                  </button>
                </motion.div>

                {/* Auto-dismiss progress — quietly signals the modal will step aside. */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="mx-auto mt-5 h-[3px] w-32 overflow-hidden rounded-full bg-foreground/10"
                >
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 10, ease: "linear" }}
                    style={{ transformOrigin: "left" }}
                    className="h-full w-full rounded-full bg-[linear-gradient(90deg,var(--color-accent-1),var(--color-accent-3))]"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
