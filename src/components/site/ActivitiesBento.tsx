import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, type ComponentType } from "react";

type Activity = {
  Icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
};

/** Interactive tabs — the list of focus areas on the left drives a detail
 *  panel on the right, so the section stays compact no matter how long any
 *  one description runs. */
export function ActivitiesBento({ activities }: { activities: Activity[] }) {
  const [active, setActive] = useState(0);
  const current = activities[active];
  const CurrentIcon = current.Icon;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12">
      {/* Selector */}
      <ul className="flex flex-col">
        {activities.map(({ Icon, title }, i) => {
          const isActive = i === active;
          return (
            <li key={title}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-selected={isActive}
                className={
                  "group relative flex w-full items-center gap-3.5 border-b border-border py-4 pl-4 pr-3 text-left transition-colors duration-200 " +
                  (isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")
                }
              >
                {isActive && (
                  <motion.span
                    layoutId="activity-marker"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-y-0 left-0 w-0.5 bg-[linear-gradient(180deg,var(--color-accent-1),var(--color-accent-2))]"
                  />
                )}
                <Icon
                  size={16}
                  className={
                    "shrink-0 transition-colors duration-200 " +
                    (isActive ? "text-[var(--color-accent-1)]" : "text-muted-foreground/60")
                  }
                />
                <span className="flex-1 font-display text-[15px] font-semibold tracking-tight">
                  {title}
                </span>
                <span
                  className={
                    "font-display text-[11px] font-bold tabular-nums transition-colors " +
                    (isActive ? "text-[var(--color-accent-1)]" : "text-muted-foreground/35")
                  }
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Detail panel */}
      <div className="relative min-h-[19rem] overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] p-8 md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--color-accent-1)] opacity-[0.07] blur-[90px]" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full flex-col"
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white shadow-[0_14px_36px_-14px_color-mix(in_oklab,var(--color-accent-1)_75%,transparent)]">
              <CurrentIcon size={24} />
            </div>

            <h3 className="mt-7 font-display text-2xl font-bold tracking-tight md:text-3xl">
              {current.title}
            </h3>
            <p className="mt-4 max-w-xl flex-1 text-[15px] leading-[1.75] text-muted-foreground">
              {current.desc}
            </p>

            <Link
              to="/programs"
              className="group mt-8 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-1)]"
            >
              Explore this program
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
