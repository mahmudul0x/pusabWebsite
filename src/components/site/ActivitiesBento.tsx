import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { programPagesApi, optimizeImage } from "@/lib/api";

type Activity = {
  Icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  /** Program page slug — used to pull that page's hero photo. */
  slug?: string;
};

/** Interactive tabs — the list of focus areas on the left drives a detail
 *  panel on the right. Hero photos come from the program pages managed in
 *  the dashboard; the panel falls back to an icon treatment when a program
 *  has no photo yet. */
export function ActivitiesBento({ activities }: { activities: Activity[] }) {
  const [active, setActive] = useState(0);
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let live = true;
    programPagesApi
      .listAll()
      .then((pages) => {
        if (!live) return;
        const map: Record<string, string> = {};
        for (const p of pages) {
          // listAll returns the latest edition per slug; keep the first hit.
          if (p.hero_image_url && !map[p.slug]) map[p.slug] = p.hero_image_url;
        }
        setImages(map);
      })
      .catch(() => {
        /* no photos — the icon fallback covers it */
      });
    return () => {
      live = false;
    };
  }, []);

  const current = activities[active];
  const CurrentIcon = current.Icon;
  const heroUrl = current.slug ? images[current.slug] : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-10">
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
      <div className="relative overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid h-full sm:grid-cols-2"
          >
            {/* Photo */}
            <div className="relative min-h-[13rem] overflow-hidden bg-[var(--color-surface-2)] sm:min-h-[21rem]">
              {heroUrl ? (
                <img
                  src={optimizeImage(heroUrl, 900)}
                  alt={current.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(140deg,var(--color-accent-1),var(--color-accent-2))]">
                  <div className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:24px_24px]" />
                  <CurrentIcon size={54} className="relative text-white/90" />
                </div>
              )}
            </div>

            {/* Copy */}
            <div className="flex flex-col p-8 md:p-10">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white">
                <CurrentIcon size={19} />
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">
                {current.title}
              </h3>
              <p className="mt-3.5 flex-1 text-[15px] leading-[1.75] text-muted-foreground">
                {current.desc}
              </p>

              <Link
                to="/programs"
                className="group mt-7 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-1)]"
              >
                Explore this program
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
