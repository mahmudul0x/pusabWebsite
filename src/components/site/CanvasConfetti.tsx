import { useEffect, useRef } from "react";

/**
 * Full-screen canvas confetti with a two-phase burst.
 *
 * Phase "high" — a dense one-shot volley (no recycling) that erupts upward and
 * drifts down under low gravity. After `highDurationMs` it steps down to phase
 * "low": far fewer pieces, recycled forever, so the page keeps a light festive
 * shimmer without eating CPU or distracting from the content.
 *
 * Canvas-based rather than DOM nodes — hundreds of pieces stay smooth here where
 * hundreds of animated elements would not.
 */

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  angle: number;
  spin: number;
  color: string;
  shape: "bar" | "dot" | "ring";
  /** Phase of the wobble that fakes a fluttering paper edge. */
  wobble: number;
  wobbleSpeed: number;
};

const DEFAULT_COLORS = ["#03A9EC", "#7C5CFF", "#22C55E", "#F59E0B", "#EC4899", "#FFFFFF"];

export function CanvasConfetti({
  active,
  colors = DEFAULT_COLORS,
  highPieces = 500,
  lowPieces = 80,
  highDurationMs = 3000,
  gravity = 0.2,
  wind = 0.01,
  friction = 0.99,
  initialVelocityX = 2,
  initialVelocityY = 7,
  zIndex = 10001,
}: {
  active: boolean;
  colors?: string[];
  highPieces?: number;
  lowPieces?: number;
  highDurationMs?: number;
  gravity?: number;
  wind?: number;
  friction?: number;
  initialVelocityX?: number;
  initialVelocityY?: number;
  zIndex?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Latest prop values, read inside the animation loop without restarting it.
  const opts = useRef({
    colors,
    highPieces,
    lowPieces,
    highDurationMs,
    gravity,
    wind,
    friction,
    initialVelocityX,
    initialVelocityY,
  });
  opts.current = {
    colors,
    highPieces,
    lowPieces,
    highDurationMs,
    gravity,
    wind,
    friction,
    initialVelocityX,
    initialVelocityY,
  };

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect users who have asked for reduced motion — show nothing at all.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const o = opts.current;
    const shapes: Piece["shape"][] = ["bar", "dot", "ring"];

    /**
     * Seed a piece. During the opening volley pieces launch from just above the
     * fold so the whole screen fills at once; recycled pieces re-enter from the
     * top edge and simply drift down.
     */
    const spawn = (piece: Piece | null, burst: boolean): Piece => {
      const cur = opts.current;
      const size = 6 + Math.random() * 8;
      const p: Piece = piece ?? ({} as Piece);
      p.x = Math.random() * width;
      p.y = burst
        ? Math.random() * height * 0.6 - height * 0.15
        : -20 - Math.random() * height * 0.3;
      p.vx = (Math.random() - 0.5) * 2 * cur.initialVelocityX;
      // Negative vy == upward. The burst throws pieces up; recycled ones fall in.
      p.vy = burst
        ? -Math.random() * cur.initialVelocityY
        : Math.random() * cur.initialVelocityY * 0.3;
      p.w = size;
      p.h = size;
      p.angle = Math.random() * Math.PI * 2;
      p.spin = (Math.random() - 0.5) * 0.24;
      p.color = cur.colors[Math.floor(Math.random() * cur.colors.length)];
      p.shape = shapes[Math.floor(Math.random() * shapes.length)];
      p.wobble = Math.random() * Math.PI * 2;
      p.wobbleSpeed = 0.06 + Math.random() * 0.08;
      return p;
    };

    let pieces: Piece[] = Array.from({ length: o.highPieces }, () => spawn(null, true));
    let recycle = false;
    let raf = 0;

    // Phase 2 — thin the field out and start recycling for an endless shimmer.
    const phaseTimer = setTimeout(() => {
      recycle = true;
      pieces = pieces.slice(0, opts.current.lowPieces);
      // Top back up if the volley has already thinned below the low count.
      while (pieces.length < opts.current.lowPieces) pieces.push(spawn(null, false));
    }, o.highDurationMs);

    const draw = (p: Piece) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      // Squashing the height as it wobbles reads as a piece flipping edge-on.
      ctx.scale(1, Math.max(0.15, Math.abs(Math.cos(p.wobble))));
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;

      if (p.shape === "bar") {
        ctx.fillRect(-p.w / 2, -p.h * 0.18, p.w, p.h * 0.36);
      } else if (p.shape === "dot") {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    };

    const tick = () => {
      const cur = opts.current;
      ctx.clearRect(0, 0, width, height);

      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];

        p.vy += cur.gravity;
        p.vx += cur.wind;
        p.vx *= cur.friction;
        p.vy *= cur.friction;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.wobble += p.wobbleSpeed;

        draw(p);

        const gone = p.y > height + 30 || p.x < -60 || p.x > width + 60;
        if (gone) {
          // Recycling on → respawn in place; off → the volley thins out and ends.
          if (recycle) spawn(p, false);
          else pieces.splice(i, 1);
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(phaseTimer);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex }}
    />
  );
}
