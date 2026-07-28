import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ComponentType } from "react";

type Activity = {
  Icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
};

// Span pattern for a 6-card bento grid on a 3-col desktop grid:
// [0] large feature (2 cols) · [1] tall accent (1 col, 2 rows) · [2..5] regular
const SPAN: Record<number, string> = {
  0: "lg:col-span-2",
  1: "lg:row-span-2",
};

export function ActivitiesBento({ activities }: { activities: Activity[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(0,1fr)]">
      {activities.map(({ Icon, title, desc }, i) => {
        const featured = i === 0;
        const accent = i === 1;
        return (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className={
              "group relative flex flex-col overflow-hidden rounded-2xl border p-8 transition-colors duration-300 " +
              (SPAN[i] ?? "") +
              " " +
              (accent
                ? "border-transparent text-white"
                : "border-border bg-[var(--color-surface)] hover:border-[color-mix(in_oklab,var(--color-accent-1)_60%,transparent)] hover:shadow-[0_0_60px_-10px_rgba(79,110,247,0.30)]")
            }
            style={
              accent
                ? { background: "linear-gradient(150deg,var(--color-accent-1),var(--color-accent-2))" }
                : undefined
            }
          >
            {accent && (
              <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:22px_22px]" />
            )}

            <div
              className={
                "relative inline-flex items-center justify-center h-12 w-12 rounded-xl " +
                (accent
                  ? "bg-white/15 text-white"
                  : "bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white")
              }
            >
              <Icon size={featured ? 24 : 20} />
            </div>

            <h3
              className={
                "relative mt-6 font-display font-semibold " +
                (featured ? "text-2xl" : "text-xl")
              }
            >
              {title}
            </h3>
            <p
              className={
                "relative mt-3 flex-1 leading-relaxed " +
                (featured ? "text-base" : "text-sm") +
                " " +
                (accent ? "text-white/85" : "text-muted-foreground")
              }
            >
              {desc}
            </p>

            <div
              className={
                "relative mt-6 flex items-center text-sm opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 " +
                (accent ? "text-white" : "text-[var(--color-accent-1)]")
              }
            >
              Learn more <ArrowRight size={14} className="ml-1" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
