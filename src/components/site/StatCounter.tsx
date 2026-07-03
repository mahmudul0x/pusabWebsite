import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface Props {
  value: number;
  suffix?: string;
  raw?: boolean;
  text?: string;
}

export function StatCounter({ value, suffix = "", raw = false, text }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    raw ? Math.round(v).toString() : Math.round(v).toLocaleString(),
  );

  useEffect(() => {
    if (!inView || text) return;
    const controls = animate(mv, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [inView, value, mv, text]);

  if (text) {
    return (
      <span ref={ref} className="font-display text-5xl md:text-6xl font-bold tracking-tight">
        {text}
      </span>
    );
  }

  return (
    <span ref={ref} className="font-display text-5xl md:text-6xl font-bold tracking-tight">
      <motion.span>{rounded}</motion.span>
      {suffix && <span className="gradient-text">{suffix}</span>}
    </span>
  );
}
