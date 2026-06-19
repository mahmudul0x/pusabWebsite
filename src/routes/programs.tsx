import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, type ComponentType } from "react";
import { PageHero } from "@/components/site/PageHero";
import { GradientButton } from "@/components/site/GradientButton";
import {
  Users,
  GraduationCap,
  HeartHandshake,
  Trees,
  Stethoscope,
  Radio,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import heroPrograms from "@/assets/hero-programs.jpg";

// Drop a photo named by the event id into src/assets/programs (e.g.
// reunion-2026.jpg) and it shows up automatically — no code change needed.
const PROGRAM_IMAGES = import.meta.glob<{ default: string }>(
  "../assets/programs/*.{jpg,jpeg,png}",
  { eager: true },
);

function imageFor(id: string): string | undefined {
  for (const ext of ["jpg", "jpeg", "png"]) {
    const hit = PROGRAM_IMAGES[`../assets/programs/${id}.${ext}`];
    if (hit) return hit.default;
  }
  return undefined;
}

type IconType = ComponentType<{ size?: number; className?: string }>;
type Status = "upcoming" | "ongoing" | "completed";

type ProgramEvent = {
  id: string;
  title: string;
  category: string;
  Icon: IconType;
  /** ISO date — drives the computed status. Omit for always-on programs. */
  date?: string;
  /** Always-on / recurring programs are surfaced as "ongoing". */
  ongoing?: boolean;
  recurrence?: string;
  location: string;
  desc: string;
};

// Real-world programme calendar. Status is derived from the date below, so the
// page stays correct over time without code changes.
const EVENTS: ProgramEvent[] = [
  {
    id: "webinar-2026",
    title: "Online Career Webinar",
    category: "Digital",
    Icon: Radio,
    date: "2026-07-12",
    location: "Online · Zoom",
    desc: "Live Q&A with alumni across medicine, engineering and civil service on careers after graduation.",
  },
  {
    id: "medical-camp-2026",
    title: "Free Medical Camp",
    category: "Relief",
    Icon: Stethoscope,
    date: "2026-08-23",
    location: "Bishwambarpur Upazila",
    desc: "A day-long free health camp — general check-ups, medicine and awareness for the local community.",
  },
  {
    id: "sayor-2026",
    title: "SAYOR — 12th Edition",
    category: "Publication",
    Icon: BookOpen,
    date: "2026-10-15",
    location: "Print + Digital",
    desc: "The new issue of PUSAB's annual magazine, gathering literature, essays and alumni voices.",
  },
  {
    id: "scholarship-2026",
    title: "PUSAB Scholarship 2026",
    category: "Aid",
    Icon: HeartHandshake,
    date: "2026-11-05",
    location: "Applications online",
    desc: "Merit and need-based stipends for deserving students from underserved families, with mentor pairing.",
  },
  {
    id: "reunion-2026",
    title: "Annual Reunion 2026",
    category: "Flagship",
    Icon: Users,
    date: "2026-12-20",
    location: "Sunamganj",
    desc: "The flagship gathering — cross-batch networking, awards and a cultural evening for 500+ members.",
  },
  {
    id: "schooling",
    title: "School Tutoring Programme",
    category: "Education",
    Icon: GraduationCap,
    ongoing: true,
    recurrence: "Weekly sessions",
    location: "12 local schools",
    desc: "Free tutoring, career mentoring and olympiad prep delivered by members across the upazila.",
  },
  {
    id: "online-mentoring",
    title: "Admission Mentoring",
    category: "Digital",
    Icon: Radio,
    ongoing: true,
    recurrence: "Monthly AMAs",
    location: "Online",
    desc: "Rolling admission AMAs and one-to-one guidance for university aspirants from Bishwambarpur.",
  },
  {
    id: "picnic-2026",
    title: "Winter Picnic 2026",
    category: "Community",
    Icon: Trees,
    date: "2026-01-31",
    location: "Tanguar Haor",
    desc: "A full-day outdoor reunion with games, cuisine and families welcome — a warm start to the year.",
  },
  {
    id: "sayor-11",
    title: "SAYOR — 11th Edition",
    category: "Publication",
    Icon: BookOpen,
    date: "2025-12-10",
    location: "Print + Digital",
    desc: "Released the eleventh annual issue with 17 pieces spanning education, culture and creative writing.",
  },
  {
    id: "reunion-2025",
    title: "Annual Reunion 2025",
    category: "Flagship",
    Icon: Users,
    date: "2025-12-21",
    location: "Sunamganj",
    desc: "Hundreds of members reunited for recognition, networking and a memorable cultural night.",
  },
  {
    id: "scholarship-2025",
    title: "PUSAB Scholarship 2025",
    category: "Aid",
    Icon: HeartHandshake,
    date: "2025-11-08",
    location: "Disbursed directly",
    desc: "Awarded need-based stipends to students preparing for and entering public universities.",
  },
  {
    id: "flood-relief-2024",
    title: "Flood Relief Drive",
    category: "Relief",
    Icon: Stethoscope,
    date: "2024-07-15",
    location: "Sunamganj",
    desc: "Coordinated emergency relief, food and shelter support for flood-affected families across the region.",
  },
];

const STATUS_META: Record<
  Status,
  { label: string; Icon: IconType; chip: string; cta: string; ctaTo: string }
> = {
  upcoming: {
    label: "Upcoming",
    Icon: CalendarClock,
    chip: "border-transparent bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white",
    cta: "Register interest",
    ctaTo: "/contact",
  },
  ongoing: {
    label: "Ongoing",
    Icon: Clock,
    chip: "border-[color-mix(in_oklab,var(--color-accent-3)_45%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-3)_14%,transparent)] text-[var(--color-accent-3)]",
    cta: "Join in",
    ctaTo: "/contact",
  },
  completed: {
    label: "Completed",
    Icon: CheckCircle2,
    chip: "border-border bg-background/50 text-muted-foreground",
    cta: "View highlights",
    ctaTo: "/moments",
  },
};

function statusOf(e: ProgramEvent, now: number): Status {
  if (e.ongoing) return "ongoing";
  if (e.date && new Date(e.date).getTime() >= now) return "upcoming";
  return "completed";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function relativeLabel(iso: string, now: number) {
  const days = Math.round((new Date(iso).getTime() - now) / 86_400_000);
  if (days > 0) return days === 1 ? "Tomorrow" : `In ${days} days`;
  if (days === 0) return "Today";
  const ago = Math.abs(days);
  if (ago < 30) return `${ago} days ago`;
  const months = Math.round(ago / 30);
  if (months < 12) return `${months} mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs & Activities — PUSAB" },
      {
        name: "description",
        content:
          "PUSAB programs — upcoming and past: annual reunion, scholarships, medical camps, online webinars, SAYOR magazine, schooling and humanitarian relief.",
      },
      { property: "og:title", content: "Programs & Activities — PUSAB" },
      {
        property: "og:description",
        content: "Explore PUSAB's upcoming and completed programs across Bishwambarpur.",
      },
      { property: "og:url", content: "/programs" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
  component: ProgramsPage,
});

const FILTERS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Completed" },
];

function ProgramsPage() {
  const now = useMemo(() => Date.now(), []);
  const [filter, setFilter] = useState<"all" | Status>("all");

  const { ordered, counts } = useMemo(() => {
    const rank: Record<Status, number> = { upcoming: 0, ongoing: 1, completed: 2 };
    const withStatus = EVENTS.map((e) => ({ e, status: statusOf(e, now) }));
    const counts = {
      all: withStatus.length,
      upcoming: withStatus.filter((x) => x.status === "upcoming").length,
      ongoing: withStatus.filter((x) => x.status === "ongoing").length,
      completed: withStatus.filter((x) => x.status === "completed").length,
    };
    const ordered = [...withStatus].sort((a, b) => {
      if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
      // upcoming: soonest first; completed: most recent first
      const ta = a.e.date ? new Date(a.e.date).getTime() : now;
      const tb = b.e.date ? new Date(b.e.date).getTime() : now;
      return a.status === "completed" ? tb - ta : ta - tb;
    });
    return { ordered, counts };
  }, [now]);

  const visible = ordered.filter((x) => filter === "all" || x.status === filter);

  return (
    <>
      <PageHero
        title="Programs & Activities"
        lede="From annual reunions to scholarships, medical camps to humanitarian response — here's what PUSAB has delivered, what's running now, and what's next."
        crumbs={[{ label: "Home", to: "/" }, { label: "Programs" }]}
        image={heroPrograms}
        imageAlt="PUSAB scholarship handover ceremony"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          {/* Filter bar */}
          <div className="mb-10 flex flex-col items-start justify-between gap-5 border-b border-border pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-label mb-2">The programme calendar</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                {counts.upcoming} upcoming · {counts.ongoing} ongoing · {counts.completed} completed
              </h2>
            </div>
            <ul className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const isActive = filter === f.key;
                return (
                  <li key={f.key}>
                    <button
                      onClick={() => setFilter(f.key)}
                      className={
                        "relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors " +
                        (isActive
                          ? "border-transparent text-white"
                          : "border-border bg-[var(--color-surface)] text-foreground/75 hover:text-foreground hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]")
                      }
                    >
                      {isActive && (
                        <motion.span
                          layoutId="prog-filter"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))]"
                        />
                      )}
                      <span className="relative z-10">{f.label}</span>
                      <span
                        className={
                          "relative z-10 rounded-full px-1.5 text-[11px] tabular-nums " +
                          (isActive ? "bg-white/20 text-white" : "bg-background/70 text-muted-foreground")
                        }
                      >
                        {counts[f.key]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Events grid */}
          <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map(({ e, status }) => {
                const sm = STATUS_META[status];
                const Icon = e.Icon;
                const img = imageFor(e.id);
                const isUpcoming = status === "upcoming";
                const isCompleted = status === "completed";
                const dotColor = isUpcoming
                  ? "var(--color-accent-1)"
                  : status === "ongoing"
                    ? "var(--color-accent-3)"
                    : "rgba(255,255,255,0.6)";
                return (
                  <motion.li
                    key={e.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={
                      "group relative flex flex-col overflow-hidden rounded-2xl border bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1 " +
                      (isUpcoming
                        ? "border-[color-mix(in_oklab,var(--color-accent-1)_40%,transparent)] shadow-[0_24px_50px_-34px_rgba(29,78,216,0.55)] hover:shadow-[0_30px_60px_-30px_rgba(29,78,216,0.6)]"
                        : "border-border hover:border-[color-mix(in_oklab,var(--color-accent-1)_35%,transparent)]")
                    }
                  >
                    {/* Image banner (photo, or gradient + icon fallback) */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={e.title}
                          loading="lazy"
                          className={
                            "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 " +
                            (isCompleted ? "[filter:grayscale(0.15)]" : "")
                          }
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,color-mix(in_oklab,var(--color-accent-1)_60%,transparent),transparent_55%),radial-gradient(circle_at_82%_88%,color-mix(in_oklab,var(--color-accent-2)_50%,transparent),transparent_55%)]">
                          <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />
                          <Icon
                            size={42}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/85"
                          />
                        </div>
                      )}
                      {/* gradient for chip legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/20" />

                      {/* status badge */}
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                        <span className="relative flex h-1.5 w-1.5">
                          {isUpcoming && (
                            <span
                              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                              style={{ background: dotColor }}
                            />
                          )}
                          <span
                            className="relative inline-flex h-1.5 w-1.5 rounded-full"
                            style={{ background: dotColor }}
                          />
                        </span>
                        {sm.label}
                      </span>

                      {/* timing */}
                      <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur">
                        {e.date ? relativeLabel(e.date, now) : e.recurrence}
                      </span>

                      {/* category */}
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                        <Icon size={13} />
                        {e.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-xl font-bold tracking-tight">{e.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {e.desc}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin size={13} className="shrink-0" />
                          {e.location}
                          {e.date && <span className="text-foreground/30">·</span>}
                          {e.date && <span>{formatDate(e.date)}</span>}
                        </span>
                        <GradientButton
                          to={sm.ctaTo}
                          variant={isUpcoming ? "solid" : "ghost"}
                          className="px-4! py-2! text-xs"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {sm.cta} <ArrowUpRight size={14} />
                          </span>
                        </GradientButton>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>

          {visible.length === 0 && (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Nothing here right now — check another tab.
            </p>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-24 md:pb-28">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] p-8 md:p-12">
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                  Get involved
                </p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold leading-tight">
                  Want to volunteer, sponsor, or join an upcoming program?
                </h3>
              </div>
              <GradientButton to="/contact" variant="ghost" className="text-white! border-white/45!">
                <span className="inline-flex items-center gap-1.5">
                  Reach the team <ArrowUpRight size={16} />
                </span>
              </GradientButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
