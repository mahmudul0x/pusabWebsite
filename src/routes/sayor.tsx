import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { SAYOR_SECTIONS } from "@/lib/site-content";
import {
  BookOpen,
  Globe2,
  FlaskConical,
  Landmark,
  Feather,
  Users,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { GradientButton } from "@/components/site/GradientButton";
import heroSayor from "@/assets/hero-sayor.jpg";

const SECTION_META = [
  {
    icon: BookOpen,
    tag: "Feature",
    blurb: "Admissions, careers, mentorship — the academic pulse of every batch.",
  },
  {
    icon: Globe2,
    tag: "Culture",
    blurb: "Cultural memory, community stories, and the rhythm of Bishwambarpur.",
  },
  {
    icon: FlaskConical,
    tag: "Research",
    blurb: "Student research notes, lab reports, and frontier-tech essays.",
  },
  {
    icon: Landmark,
    tag: "Heritage",
    blurb: "Historical deep-dives, archives, and the roots of our upazila.",
  },
  {
    icon: Feather,
    tag: "Literature",
    blurb: "Poetry, short fiction, and creative essays from alumni voices.",
  },
  {
    icon: Users,
    tag: "Directory",
    blurb: "A complete index of Bishwambarpur's brightest — past and present.",
  },
];

// Cover images live in src/assets so Vite can fingerprint and serve them.
const COVER_IMAGES = import.meta.glob<{ default: string }>(
  "../assets/sayor/*.{jpg,jpeg}",
  { eager: true },
);

function coverFor(id: number, extension: string): string {
  return COVER_IMAGES[`../assets/sayor/${id}.${extension}`]?.default ?? "";
}

const ISSUE_ITEMS = Array.from({ length: 11 }, (_, index) => {
  const id = index + 1;
  const extension = id === 6 ? "jpeg" : "jpg";

  return {
    id,
    title: `SAYOR Issue ${String(id).padStart(2, "0")}`,
    image: coverFor(id, extension),
  };
});

type SayorBlock = { type: "h2" | "h3" | "p"; text: string };
type SayorDoc = { id: number; blocks: SayorBlock[] };

// Each issue's text is lazily fetched only when its reader is opened, so the
// page itself stays light.
const CONTENT_LOADERS = import.meta.glob<{ default: SayorDoc }>("../content/sayor/*.json");

function loadIssueContent(id: number): Promise<SayorBlock[]> {
  const loader = CONTENT_LOADERS[`../content/sayor/${id}.json`];
  if (!loader) return Promise.resolve([]);
  return loader().then((mod) => mod.default.blocks ?? []);
}

export const Route = createFileRoute("/sayor")({
  head: () => ({
    meta: [
      { title: "SAYOR — The Annual Magazine of PUSAB" },
      {
        name: "description",
        content:
          "SAYOR is PUSAB's annual magazine spanning education, culture, science, heritage, literature and a directory of Bishwambarpur students.",
      },
      { property: "og:title", content: "SAYOR — Annual Magazine of PUSAB" },
      {
        property: "og:description",
        content: "Six sections, one publication — the voice of Bishwambarpur's brightest.",
      },
      { property: "og:url", content: "/sayor" },
    ],
    links: [{ rel: "canonical", href: "/sayor" }],
  }),
  component: SayorPage,
});

function SayorPage() {
  const featured = SECTION_META[0];
  const FeaturedIcon = featured.icon;
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  const [content, setContent] = useState<SayorBlock[] | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  const selectedIndex = ISSUE_ITEMS.findIndex((item) => item.id === selectedIssue);
  const selectedIssueData = selectedIndex >= 0 ? ISSUE_ITEMS[selectedIndex] : null;

  const handleNavigate = (direction: 1 | -1) => {
    if (!selectedIssueData) return;
    const nextIndex = (selectedIndex + direction + ISSUE_ITEMS.length) % ISSUE_ITEMS.length;
    setSelectedIssue(ISSUE_ITEMS[nextIndex].id);
  };

  // Lock background scroll while the reader is open and load the selected issue.
  useEffect(() => {
    if (selectedIssue == null) {
      setContent(null);
      return;
    }
    document.body.style.overflow = "hidden";
    let cancelled = false;
    setLoadingContent(true);
    setContent(null);
    loadIssueContent(selectedIssue).then((blocks) => {
      if (!cancelled) {
        setContent(blocks);
        setLoadingContent(false);
      }
    });
    return () => {
      cancelled = true;
      document.body.style.overflow = "";
    };
  }, [selectedIssue]);

  return (
    <>
      <PageHero
        title="SAYOR"
        lede="The flagship annual magazine of PUSAB — six sections, one publication, the voice of Bishwambarpur's brightest."
        crumbs={[{ label: "Home", to: "/" }, { label: "SAYOR" }]}
        image={heroSayor}
        imageAlt="SAYOR magazine on a desk"
      />

      {/* Wordmark */}
      <section className="pb-10 overflow-hidden">
        <div className="container-page text-center">
          <h2 className="font-display font-extrabold tracking-tighter gradient-text leading-none text-[clamp(4rem,18vw,16rem)]">
            SAYOR
          </h2>
          <p className="-mt-2 text-label">Annual · Bilingual · Bishwambarpur</p>
        </div>
      </section>

      {/* Editorial bento — six sections */}
      <section className="pb-20">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-border pb-4">
            <div>
              <p className="text-label mb-2">Inside SAYOR</p>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
                Six sections, one voice.
              </h2>
            </div>
            <span className="hidden sm:block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Vol · 05 / 24
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[180px] md:auto-rows-[200px]">
            {/* Featured */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-8 md:row-span-2 group relative overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)] bg-[var(--color-surface)] p-8 flex flex-col justify-end transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_55%,transparent)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,color-mix(in_oklab,var(--color-accent-1)_45%,transparent),transparent_55%),radial-gradient(circle_at_80%_80%,color-mix(in_oklab,var(--color-accent-2)_40%,transparent),transparent_55%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
              <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-[var(--color-accent-1)] text-white">
                  {featured.tag}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] border border-white/15 bg-black/30 backdrop-blur text-foreground/80">
                  01 / 06
                </span>
              </div>
              <div className="absolute top-6 left-6 z-20 grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white shadow-lg">
                <FeaturedIcon size={20} />
              </div>
              <div className="relative z-20 space-y-3">
                <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-[0.95]">
                  {SAYOR_SECTIONS[0]}
                </h3>
                <p className="text-foreground/70 max-w-md">{featured.blurb}</p>
              </div>
            </motion.article>

            {/* Sections 2 & 3 */}
            {SAYOR_SECTIONS.slice(1, 3).map((title, idx) => {
              const m = SECTION_META[idx + 1];
              const Icon = m.icon;
              const accent = idx === 0 ? "var(--color-accent-2)" : "var(--color-accent-1)";
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.08 * (idx + 1) }}
                  className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] p-6 hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <Icon size={20} style={{ color: accent }} />
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: accent }}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <h4 className="mt-6 font-display text-xl font-bold tracking-tight">{title}</h4>
                  <p className="mt-2 text-sm text-foreground/60 line-clamp-2">{m.blurb}</p>
                </motion.div>
              );
            })}

            {/* Sections 4, 5, 6 */}
            {SAYOR_SECTIONS.slice(3, 6).map((title, idx) => {
              const m = SECTION_META[idx + 3];
              const Icon = m.icon;
              const isMiddle = idx === 1;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.08 * (idx + 3) }}
                  className={
                    "md:col-span-4 group relative overflow-hidden rounded-3xl border p-6 transition-colors " +
                    (isMiddle
                      ? "border-[color-mix(in_oklab,var(--color-accent-2)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-2)_10%,var(--color-surface))] hover:border-[color-mix(in_oklab,var(--color-accent-2)_60%,transparent)]"
                      : "border-border bg-[var(--color-surface)] hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]")
                  }
                >
                  <div className="flex items-start justify-between">
                    <Icon size={20} className="text-[var(--color-accent-3)]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/60">
                      {m.tag}
                    </span>
                  </div>
                  <h4 className="mt-6 font-display text-xl font-bold tracking-tight">{title}</h4>
                  <p className="mt-2 text-sm text-foreground/60 line-clamp-2">{m.blurb}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Archive — actual issue gallery */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-6 border-b border-border pb-4">
            <div>
              <p className="text-label mb-2">Archive</p>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
                Browse all SAYOR editions
              </h2>
            </div>
            <span className="hidden sm:block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              11 issues
            </span>
          </div>

          <p className="mb-10 max-w-2xl text-sm text-muted-foreground">
            Pull any volume off the shelf — click a cover to open the full magazine and read it
            page by page.
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {ISSUE_ITEMS.map((issue, i) => (
              <motion.button
                key={issue.id}
                type="button"
                onClick={() => setSelectedIssue(issue.id)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (i % 5) * 0.05 }}
                className="group flex flex-col items-center [perspective:1400px]"
                aria-label={`Open ${issue.title}`}
              >
                {/* Book */}
                <div className="relative w-full max-w-[200px] aspect-[3/4] transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-22deg)] group-hover:-translate-y-1">
                  {/* page block (right edge) */}
                  <div className="absolute right-0 top-[2%] h-[96%] w-3 translate-x-[1px] rounded-r-sm bg-[repeating-linear-gradient(to_right,#e7e2d6_0px,#e7e2d6_1px,#cfc9ba_2px,#cfc9ba_3px)] [transform:rotateY(78deg)] origin-right" />
                  {/* cover */}
                  <div className="relative h-full w-full overflow-hidden rounded-r-md rounded-l-sm border border-black/10 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.55)] transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-20px_rgba(79,110,247,0.45)]">
                    <img
                      src={issue.image}
                      alt={issue.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    {/* spine shading + sheen */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                      No. {String(issue.id).padStart(2, "0")}
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="font-display text-base font-semibold tracking-tight">
                    {issue.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Read now →
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedIssueData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[var(--color-background)]"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedIssueData.title} reader`}
          >
            {/* Reader top bar */}
            <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-[var(--color-surface)]/85 px-4 py-3 backdrop-blur-md sm:px-8">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  SAYOR · Edition {String(selectedIssueData.id).padStart(2, "0")}
                </p>
                <h3 className="truncate font-display text-lg font-semibold sm:text-xl">
                  {selectedIssueData.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigate(-1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]"
                  aria-label="Previous issue"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate(1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]"
                  aria-label="Next issue"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  className="ml-1 inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]"
                  aria-label="Close reader"
                >
                  <X size={16} /> <span className="hidden sm:inline">Close</span>
                </button>
              </div>
            </header>

            {/* Reader body */}
            <div className="flex-1 overflow-y-auto">
              {/* Cover */}
              <div className="relative border-b border-border bg-[var(--color-surface)] px-4 py-10 sm:py-14">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--color-accent-1)_18%,transparent),transparent_60%)]" />
                <img
                  src={selectedIssueData.image}
                  alt={`${selectedIssueData.title} cover`}
                  className="relative mx-auto max-h-[70vh] w-auto max-w-full rounded-lg border border-black/10 shadow-[0_30px_70px_-25px_rgba(15,23,42,0.6)]"
                />
              </div>

              {/* Article text */}
              <article className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-6 sm:py-16">
                {loadingContent && (
                  <div className="flex items-center justify-center gap-3 py-20 text-muted-foreground">
                    <Loader2 className="animate-spin" size={20} />
                    <span className="text-sm">Loading the issue…</span>
                  </div>
                )}

                {!loadingContent && content && content.length === 0 && (
                  <p className="py-16 text-center text-sm text-muted-foreground">
                    The text for this edition isn't available yet — enjoy the cover above.
                  </p>
                )}

                {!loadingContent && content && content.length > 0 && (
                  <div className="sayor-prose">
                    {content.map((block, idx) => {
                      if (block.type === "h2") {
                        return (
                          <h2
                            key={idx}
                            className="mt-12 mb-4 font-display text-2xl font-bold leading-snug first:mt-0"
                          >
                            {block.text}
                          </h2>
                        );
                      }
                      if (block.type === "h3") {
                        return (
                          <h3
                            key={idx}
                            className="mt-9 mb-3 font-display text-lg font-semibold text-[var(--color-accent-1)]"
                          >
                            {block.text}
                          </h3>
                        );
                      }
                      return (
                        <p
                          key={idx}
                          className="mb-5 text-[1.075rem] leading-[2] text-foreground/85"
                        >
                          {block.text}
                        </p>
                      );
                    })}

                    <div className="mt-16 flex items-center justify-between gap-3 border-t border-border pt-8">
                      <button
                        type="button"
                        onClick={() => handleNavigate(-1)}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]"
                      >
                        <ChevronLeft size={16} /> Previous issue
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavigate(1)}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]"
                      >
                        Next issue <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Directory CTA */}
      <section className="py-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2rem] p-8 md:p-12 bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))]">
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
            <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div className="max-w-xl text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                  Student Directory
                </p>
                <h3 className="mt-3 font-display text-2xl md:text-4xl font-bold leading-tight">
                  A complete directory of Bishwambarpur's brightest — past and present.
                </h3>
                <p className="mt-3 text-white/85">
                  Connect with the creators, writers, doctors, and engineers featured across every
                  SAYOR issue.
                </p>
              </div>
              <div className="flex md:justify-end">
                <GradientButton to="/contact">
                  <span className="inline-flex items-center gap-1.5">
                    Explore directory <ArrowUpRight size={16} />
                  </span>
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
