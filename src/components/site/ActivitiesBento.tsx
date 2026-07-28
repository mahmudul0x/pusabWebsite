import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ComponentType } from "react";

type Activity = {
  Icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
};

/** Editorial index list — numbered rows that size to their own content, so
 *  short and long descriptions sit together without the dead whitespace an
 *  equal-height card grid forces. */
export function ActivitiesBento({ activities }: { activities: Activity[] }) {
  return (
    <div className="border-t border-border">
      {activities.map(({ Icon, title, desc }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="group relative border-b border-border"
        >
          {/* Hover wash */}
          <div className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-accent-1)_7%,transparent),transparent_70%)] transition-transform duration-500 ease-out group-hover:scale-x-100" />

          <div className="relative grid items-baseline gap-x-6 gap-y-2 py-6 md:grid-cols-[auto_minmax(0,20rem)_1fr_auto] md:py-7">
            {/* Index */}
            <span className="font-display text-xs font-bold tabular-nums text-muted-foreground/50 transition-colors group-hover:text-[var(--color-accent-1)]">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Title + icon */}
            <div className="flex items-center gap-3">
              <Icon
                size={17}
                className="shrink-0 text-[var(--color-accent-1)] transition-transform duration-300 group-hover:scale-110"
              />
              <h3 className="font-display text-lg font-semibold tracking-tight md:text-xl">
                {title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground md:pr-8">{desc}</p>

            {/* Affordance */}
            <ArrowUpRight
              size={18}
              className="hidden shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-accent-1)] md:block"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
