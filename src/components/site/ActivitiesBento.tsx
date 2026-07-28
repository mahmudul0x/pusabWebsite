import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
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

// Most program slugs live at /programs/<slug>, but a few have their own
// top-level route — send those to the real page instead.
const SLUG_ROUTE_OVERRIDES: Record<string, string> = {
  felicitation: "/felicitation",
};

function hrefFor(slug?: string): string {
  if (!slug) return "/programs";
  return SLUG_ROUTE_OVERRIDES[slug] ?? `/programs/${slug}`;
}

/** Focus areas. Desktop: a list on the left drives a detail panel on the
 *  right. Mobile: the same list becomes an accordion, expanding the detail
 *  inline under the tapped row.
 *
 *  Hovering previews an item and that preview sticks after the cursor leaves.
 *  Clicking locks an item, so later hovers no longer change the panel — the
 *  user's explicit pick wins over an accidental sweep across the list. */
export function ActivitiesBento({ activities }: { activities: Activity[] }) {
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);
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

  const imageFor = (a: Activity) => (a.slug ? images[a.slug] : undefined);
  const current = activities[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-10">
      {/* Selector — accordion on mobile, tab list on desktop */}
      <ul className="flex flex-col">
        {activities.map((activity, i) => {
          const { Icon, title } = activity;
          const isActive = i === active;
          return (
            <li key={title} className="border-b border-border">
              <button
                type="button"
                onMouseEnter={() => !locked && setActive(i)}
                onFocus={() => !locked && setActive(i)}
                onClick={() => {
                  setActive(i);
                  setLocked(true);
                }}
                aria-expanded={isActive}
                className={
                  "relative flex w-full items-center gap-3.5 py-4 pl-4 pr-3 text-left transition-colors duration-200 " +
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
                    "hidden font-display text-[11px] font-bold tabular-nums transition-colors lg:inline " +
                    (isActive ? "text-[var(--color-accent-1)]" : "text-muted-foreground/35")
                  }
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ChevronDown
                  size={16}
                  className={
                    "shrink-0 text-muted-foreground/50 transition-transform duration-300 lg:hidden " +
                    (isActive ? "rotate-180" : "")
                  }
                />
              </button>

              {/* Inline detail — mobile only */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden lg:hidden"
                  >
                    <div className="pb-6 pl-4 pr-3">
                      <Panel activity={activity} heroUrl={imageFor(activity)} stacked />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {/* Detail panel — desktop only */}
      <div className="relative hidden overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] lg:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <Panel activity={current} heroUrl={imageFor(current)} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Panel({
  activity,
  heroUrl,
  stacked = false,
}: {
  activity: Activity;
  heroUrl?: string;
  stacked?: boolean;
}) {
  const { Icon, title, desc, slug } = activity;
  return (
    <div
      className={
        stacked
          ? "overflow-hidden rounded-xl border border-border bg-[var(--color-surface)]"
          : "grid h-full sm:grid-cols-2"
      }
    >
      {/* Photo */}
      <div
        className={
          "relative overflow-hidden bg-[var(--color-surface-2)] " +
          (stacked ? "aspect-[16/10]" : "min-h-[13rem] sm:min-h-[21rem]")
        }
      >
        {heroUrl ? (
          <img
            src={optimizeImage(heroUrl, 900)}
            alt={title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(140deg,var(--color-accent-1),var(--color-accent-2))]">
            <div className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:24px_24px]" />
            <Icon size={stacked ? 40 : 54} className="relative text-white/90" />
          </div>
        )}
      </div>

      {/* Copy */}
      <div className={stacked ? "p-5" : "flex flex-col p-8 md:p-10"}>
        {!stacked && (
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white">
            <Icon size={19} />
          </div>
        )}

        {!stacked && (
          <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">{title}</h3>
        )}

        <p
          className={
            "text-muted-foreground " +
            (stacked ? "text-sm leading-relaxed" : "mt-3.5 flex-1 text-[15px] leading-[1.75]")
          }
        >
          {desc}
        </p>

        <Link
          to={hrefFor(slug)}
          className={
            "group inline-flex w-fit items-center gap-1.5 font-semibold text-[var(--color-accent-1)] " +
            (stacked ? "mt-4 text-[13px]" : "mt-7 text-sm")
          }
        >
          Explore this program
          <ArrowUpRight
            size={stacked ? 13 : 15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
