import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  CalendarClock,
  Clock,
  CheckCircle2,
  ClipboardList,
  ListChecks,
  Quote,
  ChevronRight,
} from "lucide-react";
import { GradientButton } from "@/components/site/GradientButton";
import { programPagesApi, optimizeImage } from "@/lib/api";
import { PROGRAMS } from "@/lib/site-content";
import { useProgramEvents, statusOf, type Status } from "@/lib/usePrograms";
import { themeFor } from "@/lib/programThemes";
import heroPrograms from "@/assets/hero-programs.jpg";

const STATUS_META: Record<Status, { label: string; Icon: typeof CalendarClock; chip: string }> = {
  upcoming: {
    label: "Upcoming",
    Icon: CalendarClock,
    chip: "border-transparent bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white",
  },
  ongoing: {
    label: "Ongoing",
    Icon: Clock,
    chip: "border-[color-mix(in_oklab,var(--color-accent-3)_45%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-3)_14%,transparent)] text-[var(--color-accent-3)]",
  },
  completed: {
    label: "Completed",
    Icon: CheckCircle2,
    chip: "border-border bg-background/50 text-muted-foreground",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export const Route = createFileRoute("/programs_/$slug")({
  loader: async ({ params }) => {
    const fallback = PROGRAMS.find((p) => p.key === params.slug);
    if (!fallback) throw notFound();
    try {
      const page = await programPagesApi.get(params.slug);
      return { fallback, page };
    } catch {
      return { fallback, page: null };
    }
  },
  head: ({ loaderData }) => {
    const title = loaderData?.page?.title ?? loaderData?.fallback.title ?? "Program";
    const desc = loaderData?.page?.tagline || loaderData?.fallback.desc || "";
    const slug = loaderData?.fallback.key ?? "";
    return {
      meta: [
        { title: `${title} — PUSAB` },
        { name: "description", content: desc },
        { property: "og:title", content: `${title} — PUSAB` },
        { property: "og:description", content: desc },
        { property: "og:url", content: `/programs/${slug}` },
      ],
      links: [{ rel: "canonical", href: `/programs/${slug}` }],
    };
  },
  component: ProgramDetailPage,
});

function SectionLabel({
  icon,
  children,
  accent,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <p
      className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]"
      style={{ color: accent }}
    >
      {icon}
      {children}
    </p>
  );
}

function ProgramDetailPage() {
  const { fallback, page } = Route.useLoaderData();
  const { events, now } = useProgramEvents();
  const theme = themeFor(fallback.key);
  const { Icon: MoodIcon, colorA, colorB, mood, emphasis } = theme;
  const gradient = `linear-gradient(120deg, ${colorA}, ${colorB})`;

  const title = page?.title || fallback.title;
  const tagline = page?.tagline || fallback.desc;
  const overview = page?.overview || fallback.desc;
  const heroImage = page?.hero_image_url ? optimizeImage(page.hero_image_url, 1600) : heroPrograms;

  const related = fallback.category
    ? events.filter((e) => e.category.toLowerCase() === fallback.category.toLowerCase())
    : [];

  const hasStats = Boolean(page && page.stats.length > 0);
  const hasHighlights = Boolean(page && page.objectives.length > 0);
  const hasEligibility = Boolean(page?.eligibility || page?.process);

  const statsBlock = hasStats && (
    <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {page!.stats.map((s) => (
        <div
          key={s.id}
          className="rounded-xl border p-4 text-center"
          style={{ borderColor: `color-mix(in oklab, ${colorA} 25%, var(--color-border))` }}
        >
          <p
            className="font-display text-2xl md:text-3xl font-extrabold"
            style={{
              backgroundImage: gradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {s.value}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );

  const highlightsBlock = hasHighlights && (
    <div className="mb-10">
      <SectionLabel icon={<MoodIcon size={13} />} accent={colorA}>
        Highlights
      </SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {page!.objectives.map((o) => (
          <div key={o.id} className="overflow-hidden rounded-xl border border-border bg-[var(--color-surface)]">
            <div className="relative aspect-[16/10] overflow-hidden" style={{ background: gradient }}>
              {o.image_url ? (
                <img
                  src={optimizeImage(o.image_url, 480)}
                  alt={o.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <MoodIcon size={26} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80" />
              )}
            </div>
            <div className="p-3.5">
              <h3 className="font-display text-sm font-semibold leading-tight">{o.title}</h3>
              {o.description && (
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{o.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const eligibilityBlock = hasEligibility && (
    <div className="mb-10 grid gap-3 sm:grid-cols-2">
      {page?.eligibility && (
        <div className="rounded-xl border border-border bg-[var(--color-surface)] p-5">
          <SectionLabel icon={<ListChecks size={13} />} accent={colorA}>
            Who can join
          </SectionLabel>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {page.eligibility}
          </p>
        </div>
      )}
      {page?.process && (
        <div className="rounded-xl border border-border bg-[var(--color-surface)] p-5">
          <SectionLabel icon={<ClipboardList size={13} />} accent={colorA}>
            How it works
          </SectionLabel>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{page.process}</p>
        </div>
      )}
    </div>
  );

  const orderedBlocks =
    emphasis === "stats"
      ? [statsBlock, highlightsBlock, eligibilityBlock]
      : emphasis === "eligibility"
        ? [eligibilityBlock, highlightsBlock, statsBlock]
        : [highlightsBlock, statsBlock, eligibilityBlock];

  return (
    <>
      {/* Custom hero — per-program accent + mood, not the generic site hero */}
      <section className="relative pt-40 pb-16 md:pb-20 overflow-hidden min-h-[58vh] flex items-end">
        <img src={heroImage} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/55 to-slate-950/90" />
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: `radial-gradient(circle at 30% 110%, ${colorA}55, transparent 60%)` }}
        />
        <div className="container-page relative z-10 [text-shadow:0_2px_30px_rgba(2,6,23,0.5)]">
          <nav className="mb-6 flex items-center gap-2 text-xs text-white/70">
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight size={12} className="opacity-60" />
            <Link to="/programs" className="transition-colors hover:text-white">
              Programs
            </Link>
            <ChevronRight size={12} className="opacity-60" />
            <span className="text-white">{title}</span>
          </nav>

          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur"
          >
            <MoodIcon size={13} style={{ color: colorA }} />
            {mood}
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.04] max-w-4xl text-white">
            {title}
          </h1>
          {tagline && (
            <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-white/80">{tagline}</p>
          )}
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-page">
          {/* Overview */}
          <div className="mb-10 max-w-2xl">
            <SectionLabel accent={colorA}>About this program</SectionLabel>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{overview}</p>
            {page?.schedule_note && (
              <p
                className="mt-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs text-muted-foreground"
                style={{ borderColor: `color-mix(in oklab, ${colorA} 25%, var(--color-border))` }}
              >
                <Clock size={12} style={{ color: colorA }} /> {page.schedule_note}
              </p>
            )}
          </div>

          {orderedBlocks}

          {/* Gallery */}
          {page && page.gallery.length > 0 && (
            <div className="mb-10">
              <SectionLabel accent={colorA}>Gallery</SectionLabel>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
                {page.gallery.map((g) => (
                  <div
                    key={g.id}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-[var(--color-surface)]"
                  >
                    <img
                      src={optimizeImage(g.image_url, 320)}
                      alt={g.caption || title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {g.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2">
                        <p className="text-[10px] text-white leading-tight">{g.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials */}
          {page && page.testimonials.length > 0 && (
            <div className="mb-10">
              <SectionLabel accent={colorA}>What people say</SectionLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                {page.testimonials.map((t) => (
                  <div key={t.id} className="rounded-xl border border-border bg-[var(--color-surface)] p-5">
                    <Quote size={16} style={{ color: colorA }} className="opacity-70" />
                    <p className="mt-2 text-sm leading-relaxed">{t.quote}</p>
                    <div className="mt-3 flex items-center gap-2.5">
                      {t.photo_url ? (
                        <img
                          src={optimizeImage(t.photo_url, 80)}
                          alt={t.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-white"
                          style={{ background: gradient }}
                        >
                          {t.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-tight">{t.name}</p>
                        {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related activity from the programme calendar */}
          {related.length > 0 && (
            <div className="mb-14">
              <SectionLabel accent={colorA}>Related activity</SectionLabel>
              <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {related.map((e) => {
                    const status = statusOf(e, now);
                    const sm = STATUS_META[status];
                    const EventIcon = e.Icon;
                    return (
                      <motion.li
                        key={e.id}
                        layout
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          {e.image ? (
                            <img
                              src={e.image}
                              alt={e.title}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center" style={{ background: gradient }}>
                              <EventIcon size={32} className="text-white/85" />
                            </div>
                          )}
                          <span
                            className={
                              "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur " +
                              sm.chip
                            }
                          >
                            <sm.Icon size={11} /> {sm.label}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="font-display text-lg font-semibold leading-tight">{e.title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{e.desc}</p>
                          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={11} /> {e.location}
                            </span>
                            {e.date && <span>{formatDate(e.date)}</span>}
                            {e.recurrence && <span>{e.recurrence}</span>}
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            </div>
          )}

          {/* CTA */}
          <div className="relative overflow-hidden rounded-[2rem] p-8 md:p-12" style={{ background: gradient }}>
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">Get involved</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold leading-tight">
                  Want to take part in {title}? Reach out to the team.
                </h3>
              </div>
              <GradientButton to="/contact" variant="ghost" className="text-white! border-white/45!">
                <span className="inline-flex items-center gap-1.5">
                  Contact the team <ArrowUpRight size={16} />
                </span>
              </GradientButton>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link to="/programs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to all programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
