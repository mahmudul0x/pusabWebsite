import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Clock, MapPin } from "lucide-react";
import { useProgramEvents, statusOf, type IconType, type Status } from "@/lib/usePrograms";

const STATUS_CHIP: Record<Status, { label: string; Icon: IconType; cls: string }> = {
  upcoming: {
    label: "Upcoming",
    Icon: CalendarClock,
    cls: "border-transparent bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white",
  },
  ongoing: {
    label: "Ongoing",
    Icon: Clock,
    cls: "border-[color-mix(in_oklab,var(--color-accent-3)_45%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-3)_14%,transparent)] text-[var(--color-accent-3)]",
  },
  completed: {
    label: "Completed",
    Icon: Clock,
    cls: "border-border bg-background/50 text-muted-foreground",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function UpcomingPrograms() {
  const { events, now } = useProgramEvents();

  const upcoming = [...events]
    .filter((e) => statusOf(e, now) !== "completed")
    .sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : now;
      const tb = b.date ? new Date(b.date).getTime() : now;
      return ta - tb;
    })
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section className="py-28 md:py-32 bg-[var(--color-surface-2)]">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-16">
          <div>
            <p className="text-label mb-3">What's happening</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight max-w-xl">
              Recent <span className="gradient-text">Activities</span>
            </h2>
          </div>
          <Link
            to="/programs"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            View all programs{" "}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((e, i) => {
            const status = statusOf(e, now);
            const sm = STATUS_CHIP[status];
            const Icon = e.Icon;
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--color-accent-1)_35%,transparent)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {e.image ? (
                    <img
                      src={e.image}
                      alt={e.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,color-mix(in_oklab,var(--color-accent-1)_60%,transparent),transparent_55%),radial-gradient(circle_at_82%_88%,color-mix(in_oklab,var(--color-accent-2)_50%,transparent),transparent_55%)]">
                      <Icon
                        size={38}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/85"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <span
                    className={
                      "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] border backdrop-blur " +
                      sm.cls
                    }
                  >
                    <sm.Icon size={11} /> {sm.label}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold tracking-tight">{e.title}</h3>
                  <p className="mt-2 flex-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {e.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{e.location}</span>
                    {e.date && <span className="text-foreground/30">·</span>}
                    {e.date && <span className="shrink-0">{formatDate(e.date)}</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
