import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  MapPin,
  CalendarClock,
  Clock,
  CheckCircle2,
  ClipboardList,
  ListChecks,
  Quote,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { programPagesApi, optimizeImage, type ProgramPage } from "@/lib/api";
import { PROGRAMS } from "@/lib/site-content";
import { useProgramEvents, statusOf, type Status } from "@/lib/usePrograms";
import { themeFor, type ProgramTheme } from "@/lib/programThemes";
import { ReunionPage } from "@/components/site/ReunionPage";
import { SchoolingPage } from "@/components/site/SchoolingPage";
import { HumanityPage } from "@/components/site/HumanityPage";
import { ScholarshipPage } from "@/components/site/ScholarshipPage";
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

function StatBanner({ page, theme }: { page: ProgramPage; theme: ProgramTheme }) {
  if (page.stats.length === 0) return null;
  return (
    <div
      className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-4"
      style={{ background: `linear-gradient(120deg, ${theme.colorA}, ${theme.colorB})` }}
    >
      {page.stats.map((s) => (
        <div key={s.id} className="bg-slate-950/85 px-4 py-6 text-center backdrop-blur">
          <p className="font-display text-2xl md:text-3xl font-extrabold text-white">{s.value}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/70">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function StatChips({ page, theme }: { page: ProgramPage; theme: ProgramTheme }) {
  if (page.stats.length === 0) return null;
  return (
    <div className="mb-10 flex flex-wrap gap-2.5">
      {page.stats.map((s) => (
        <div
          key={s.id}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
          style={{ borderColor: `color-mix(in oklab, ${theme.colorA} 30%, var(--color-border))` }}
        >
          <span className="font-display text-sm font-extrabold" style={{ color: theme.colorA }}>
            {s.value}
          </span>
          <span className="text-xs text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Reunion — a once-a-year gathering: everyone who's ever been part of PUSAB
 * comes back, and the day is remembered through its photos. So the page
 * leads with that framing, then puts the photo wall front and center
 * (bigger and earlier than any other layout). The whole edition (title,
 * overview, stats, gallery — everything) can differ year to year; the year
 * switcher lives in the page header, not here.
 */
function TimelineLayout({ page, theme }: { page: ProgramPage; theme: ProgramTheme }) {
  return (
    <>
      <div
        className="mb-10 rounded-2xl border p-5 sm:p-6"
        style={{
          borderColor: `color-mix(in oklab, ${theme.colorA} 25%, var(--color-border))`,
          background: `color-mix(in oklab, ${theme.colorA} 6%, transparent)`,
        }}
      >
        <p className="text-sm leading-relaxed">
          Once every year, PUSAB members from every batch and every university find their way back
          to Bishwambarpur for one evening — old friends, familiar faces, and a room full of
          people who grew up in the same place. It's the one night the whole family shows up, and
          the photos from that night are what everyone remembers it by.
        </p>
      </div>

      <StatBanner page={page} theme={theme} />

      {page.gallery.length > 0 && (
        <div className="mb-10">
          <SectionLabel icon={<theme.Icon size={13} />} accent={theme.colorA}>
            Faces from the night
          </SectionLabel>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {page.gallery.map((g, i) => (
              <div
                key={g.id}
                className={
                  "group relative overflow-hidden rounded-xl border border-border " +
                  (i === 0 ? "col-span-2 aspect-[16/9] sm:col-span-1 sm:row-span-2 sm:aspect-square" : "aspect-square")
                }
              >
                <img
                  src={optimizeImage(g.image_url, i === 0 ? 800 : 400)}
                  alt={g.caption || page.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {g.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2">
                    <p className="text-[11px] text-white leading-tight">{g.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(page.eligibility || page.process) && (
        <div className="mb-10 rounded-xl border border-border bg-[var(--color-surface)] p-5">
          {page.eligibility && (
            <p className="text-sm text-muted-foreground leading-relaxed">{page.eligibility}</p>
          )}
          {page.process && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{page.process}</p>
          )}
        </div>
      )}
    </>
  );
}

/** Scholarship — big stat banner, numbered checklist, eligibility emphasized. */
function ChecklistLayout({ page, theme }: { page: ProgramPage; theme: ProgramTheme }) {
  return (
    <>
      <StatBanner page={page} theme={theme} />
      {page.eligibility && (
        <div
          className="mb-10 rounded-2xl border-2 p-6"
          style={{ borderColor: `color-mix(in oklab, ${theme.colorA} 35%, var(--color-border))` }}
        >
          <SectionLabel icon={<ListChecks size={13} />} accent={theme.colorA}>
            Who's eligible
          </SectionLabel>
          <p className="text-sm leading-relaxed">{page.eligibility}</p>
        </div>
      )}
      {page.process && (
        <div className="mb-10 rounded-xl border border-border bg-[var(--color-surface)] p-5">
          <SectionLabel icon={<ClipboardList size={13} />} accent={theme.colorA}>
            How to apply
          </SectionLabel>
          <p className="text-sm text-muted-foreground leading-relaxed">{page.process}</p>
        </div>
      )}
    </>
  );
}

/** Schooling — photo-mosaic highlights, plain-text eligibility/process (ongoing, low-friction program). */
function CurriculumLayout({ page, theme }: { page: ProgramPage; theme: ProgramTheme }) {
  return (
    <>
      <div className="mb-10 grid gap-6 sm:grid-cols-2">
        {page.eligibility && (
          <div>
            <SectionLabel accent={theme.colorA}>Who it's for</SectionLabel>
            <p className="text-sm text-muted-foreground leading-relaxed">{page.eligibility}</p>
          </div>
        )}
        {page.process && (
          <div>
            <SectionLabel accent={theme.colorA}>How sessions run</SectionLabel>
            <p className="text-sm text-muted-foreground leading-relaxed">{page.process}</p>
          </div>
        )}
      </div>
      <StatChips page={page} theme={theme} />
    </>
  );
}

/** Felicitation — award-style spotlight cards, testimonials pulled up near the top. */
function SpotlightLayout({ page, theme }: { page: ProgramPage; theme: ProgramTheme }) {
  return (
    <>
      {page.testimonials.length > 0 && (
        <div className="mb-10">
          <SectionLabel icon={<Quote size={13} />} accent={theme.colorA}>
            In their words
          </SectionLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            {page.testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border-2 p-5"
                style={{ borderColor: `color-mix(in oklab, ${theme.colorA} 30%, var(--color-border))` }}
              >
                <Quote size={18} style={{ color: theme.colorA }} className="opacity-70" />
                <p className="mt-2 text-sm leading-relaxed italic">{t.quote}</p>
                <div className="mt-3 flex items-center gap-2.5">
                  {t.photo_url ? (
                    <img src={optimizeImage(t.photo_url, 80)} alt={t.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div
                      className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${theme.colorA}, ${theme.colorB})` }}
                    >
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold leading-tight">{t.name}</p>
                    {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {(page.eligibility || page.process) && (
        <div className="mb-10 grid gap-3 sm:grid-cols-2">
          {page.eligibility && (
            <div className="rounded-xl border border-border bg-[var(--color-surface)] p-5">
              <SectionLabel icon={<ListChecks size={13} />} accent={theme.colorA}>Achievers</SectionLabel>
              <p className="text-sm text-muted-foreground leading-relaxed">{page.eligibility}</p>
            </div>
          )}
          {page.process && (
            <div className="rounded-xl border border-border bg-[var(--color-surface)] p-5">
              <SectionLabel icon={<ClipboardList size={13} />} accent={theme.colorA}>The programme</SectionLabel>
              <p className="text-sm text-muted-foreground leading-relaxed">{page.process}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/** Humanity — urgent alert strip, numbered action steps, gallery of relief work prioritized. */
function AlertLayout({ page, theme }: { page: ProgramPage; theme: ProgramTheme }) {
  return (
    <>
      {page.eligibility && (
        <div
          className="mb-10 flex items-start gap-3 rounded-xl border-2 p-5"
          style={{ borderColor: theme.colorA, background: `color-mix(in oklab, ${theme.colorA} 8%, transparent)` }}
        >
          <AlertTriangle size={18} style={{ color: theme.colorA }} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: theme.colorA }}>
              Who this reaches
            </p>
            <p className="mt-1 text-sm leading-relaxed">{page.eligibility}</p>
          </div>
        </div>
      )}
      {page.process && (
        <div className="mb-10">
          <SectionLabel icon={<ClipboardList size={13} />} accent={theme.colorA}>
            Response steps
          </SectionLabel>
          <ol className="space-y-2">
            {page.process.split(/(?<=[.!])\s+/).filter(Boolean).map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                  style={{ background: theme.colorA }}
                >
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
      <StatChips page={page} theme={theme} />
    </>
  );
}

/** Picnic — masonry gallery leads, no eligibility/process (informal, everyone welcome). */
function GalleryFirstLayout({ page, theme }: { page: ProgramPage; theme: ProgramTheme }) {
  return (
    <>
      {page.gallery.length > 0 && (
        <div className="mb-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {page.gallery.map((g, i) => (
            <div
              key={g.id}
              className={
                "group relative overflow-hidden rounded-xl border border-border " +
                (i === 0 ? "col-span-2 aspect-[16/9] sm:col-span-2 sm:row-span-2 sm:aspect-square" : "aspect-square")
              }
            >
              <img
                src={optimizeImage(g.image_url, i === 0 ? 800 : 400)}
                alt={g.caption || page.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {g.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2">
                  <p className="text-[11px] text-white leading-tight">{g.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <StatChips page={page} theme={theme} />
    </>
  );
}

/** Online — minimal, schedule-focused; no gallery (it's a virtual programme). */
function CompactLayout({ page, theme }: { page: ProgramPage; theme: ProgramTheme }) {
  return (
    <>
      {(page.eligibility || page.process) && (
        <div className="mb-10 space-y-3 rounded-xl border border-border bg-[var(--color-surface)] p-5">
          {page.eligibility && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: theme.colorA }}>
                Who can join
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{page.eligibility}</p>
            </div>
          )}
          {page.process && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: theme.colorA }}>
                How to join
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{page.process}</p>
            </div>
          )}
        </div>
      )}
      <StatChips page={page} theme={theme} />
    </>
  );
}

const LAYOUTS: Record<ProgramTheme["layout"], (props: { page: ProgramPage; theme: ProgramTheme }) => React.ReactNode> = {
  timeline: TimelineLayout,
  checklist: ChecklistLayout,
  curriculum: CurriculumLayout,
  spotlight: SpotlightLayout,
  alert: AlertLayout,
  "gallery-first": GalleryFirstLayout,
  compact: CompactLayout,
};

function ProgramDetailPage() {
  const { fallback, page: initialPage } = Route.useLoaderData();
  const { events, now } = useProgramEvents();
  const theme = themeFor(fallback.key);
  const { Icon: MoodIcon, colorA, colorB, mood, layout } = theme;
  const gradient = `linear-gradient(120deg, ${colorA}, ${colorB})`;

  const [page, setPage] = useState(initialPage);
  const [loadingYear, setLoadingYear] = useState(false);
  const years = page?.years ?? [];

  async function switchYear(y: number) {
    if (!page || y === page.year) return;
    setLoadingYear(true);
    try {
      const edition = await programPagesApi.get(fallback.key, y);
      setPage(edition);
    } catch {
      // Leave the current edition showing if the fetch fails.
    } finally {
      setLoadingYear(false);
    }
  }

  // Reunion has a fully bespoke design (hero, event-info card, highlights
  // grid, gallery with a "+N more" overlay, testimonial carousel, CTA
  // banner) that doesn't fit the shared layout system used by the other 6
  // programs — it's rendered by its own component instead.
  if (fallback.key === "reunion") {
    return (
      <ReunionPage
        page={page}
        fallbackTitle={fallback.title}
        fallbackDesc={fallback.desc}
        heroImageFallback={heroPrograms}
        years={years}
        currentYear={page?.year ?? new Date().getFullYear()}
        loadingYear={loadingYear}
        onSwitchYear={switchYear}
      />
    );
  }

  // Schooling also has a fully bespoke design (icon-facts hero, About +
  // info-grid card, 5-stat impact row, gallery, testimonial carousel, CTA
  // banner) matching a specific reference layout.
  if (fallback.key === "schooling") {
    return (
      <SchoolingPage
        page={page}
        fallbackTitle={fallback.title}
        fallbackDesc={fallback.desc}
        heroImageFallback={heroPrograms}
        years={years}
        currentYear={page?.year ?? new Date().getFullYear()}
        loadingYear={loadingYear}
        onSwitchYear={switchYear}
      />
    );
  }

  // Humanity also has a fully bespoke design (boxed cream/green hero,
  // Serve/Support/Sustain hero facts, a 4-stat mission card, a 5-card
  // initiatives grid, a dark impact-stats banner, gallery with nav arrows,
  // and a CTA banner) matching a specific reference layout.
  if (fallback.key === "humanity") {
    return (
      <HumanityPage
        page={page}
        fallbackTitle={fallback.title}
        fallbackDesc={fallback.desc}
        heroImageFallback={heroPrograms}
        years={years}
        currentYear={page?.year ?? new Date().getFullYear()}
        loadingYear={loadingYear}
        onSwitchYear={switchYear}
      />
    );
  }

  // Scholarship has a fully bespoke design (boxed navy hero, feature icons,
  // 6-card info grid, dark impact-stats banner, gallery with nav arrows,
  // numbered application-process panel, CTA banner) matching a specific
  // reference layout.
  if (fallback.key === "scholarship") {
    return (
      <ScholarshipPage
        page={page}
        fallbackTitle={fallback.title}
        fallbackDesc={fallback.desc}
        heroImageFallback={heroPrograms}
        years={years}
        currentYear={page?.year ?? new Date().getFullYear()}
        loadingYear={loadingYear}
        onSwitchYear={switchYear}
      />
    );
  }

  const title = page?.title || fallback.title;
  const tagline = page?.tagline || fallback.desc;
  const overview = page?.overview || fallback.desc;
  const heroImage = page?.hero_image_url ? optimizeImage(page.hero_image_url, 1600) : heroPrograms;

  const related = fallback.category
    ? events.filter((e) => e.category.toLowerCase() === fallback.category.toLowerCase())
    : [];

  // Reunion (photo wall) and Picnic render the gallery themselves, inline
  // with their own story — the generic gallery block below only renders for
  // layouts that don't already handle it.
  const rendersOwnGallery = layout === "gallery-first" || layout === "timeline";
  const rendersOwnTestimonials = layout === "spotlight";

  const LayoutComponent = LAYOUTS[layout];

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

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
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
          {/* Edition (year) switcher — only shown once more than one year exists */}
          {years.length > 1 && page && (
            <div className="mb-10">
              <SectionLabel icon={<CalendarClock size={13} />} accent={colorA}>
                Browse by year
              </SectionLabel>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => {
                  const isActive = y === page.year;
                  return (
                    <button
                      key={y}
                      onClick={() => switchYear(y)}
                      disabled={loadingYear}
                      className={
                        "rounded-full px-5 py-2.5 text-sm font-bold transition-all disabled:opacity-60 " +
                        (isActive ? "text-white shadow-md" : "border text-foreground/80 hover:text-foreground")
                      }
                      style={
                        isActive
                          ? { background: gradient }
                          : { borderColor: `color-mix(in oklab, ${colorA} 30%, var(--color-border))` }
                      }
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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

          {/* Per-program layout renders its own mix of stats/highlights/eligibility/process */}
          {page && <LayoutComponent page={page} theme={theme} />}

          {/* Gallery — skipped for layouts that already render it inline, and for "compact" (virtual events) */}
          {page && page.gallery.length > 0 && !rendersOwnGallery && layout !== "compact" && (
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

          {/* Testimonials — skipped for "spotlight" which already shows them near the top */}
          {page && page.testimonials.length > 0 && !rendersOwnTestimonials && (
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

        </div>
      </section>
    </>
  );
}
