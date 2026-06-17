import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BookOpen,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { GradientButton } from "@/components/site/GradientButton";

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

type SayorChapter = {
  title: string;
  author: string;
  bio: string;
  paragraphs: string[];
};
type SayorDoc = { id: number; editor: string; chapters: SayorChapter[] };

// Each issue's text is lazily fetched only when its reader is opened, so the
// page itself stays light.
const CONTENT_LOADERS = import.meta.glob<{ default: SayorDoc }>("../content/sayor/*.json");

function loadIssueContent(id: number): Promise<SayorDoc | null> {
  const loader = CONTENT_LOADERS[`../content/sayor/${id}.json`];
  if (!loader) return Promise.resolve(null);
  return loader().then((mod) => mod.default ?? null);
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
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  const [doc, setDoc] = useState<SayorDoc | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  // null = showing the table of contents; number = reading that chapter.
  const [openChapter, setOpenChapter] = useState<number | null>(null);

  const selectedIndex = ISSUE_ITEMS.findIndex((item) => item.id === selectedIssue);
  const selectedIssueData = selectedIndex >= 0 ? ISSUE_ITEMS[selectedIndex] : null;

  const handleNavigate = (direction: 1 | -1) => {
    if (!selectedIssueData) return;
    const nextIndex = (selectedIndex + direction + ISSUE_ITEMS.length) % ISSUE_ITEMS.length;
    setSelectedIssue(ISSUE_ITEMS[nextIndex].id);
  };

  const chapters = doc?.chapters ?? [];
  const activeChapter = openChapter != null ? chapters[openChapter] : null;

  const flipChapter = (direction: 1 | -1) => {
    if (openChapter == null || chapters.length === 0) return;
    const next = openChapter + direction;
    if (next < 0 || next >= chapters.length) return;
    setOpenChapter(next);
  };

  // Lock background scroll while the reader is open and load the selected issue.
  useEffect(() => {
    if (selectedIssue == null) {
      setDoc(null);
      setOpenChapter(null);
      return;
    }
    document.body.style.overflow = "hidden";
    let cancelled = false;
    setLoadingContent(true);
    setDoc(null);
    setOpenChapter(null);
    loadIssueContent(selectedIssue).then((loaded) => {
      if (!cancelled) {
        setDoc(loaded);
        setLoadingContent(false);
      }
    });
    return () => {
      cancelled = true;
      document.body.style.overflow = "";
    };
  }, [selectedIssue]);

  // When jumping into a chapter (or flipping pages), scroll the reader to top.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.getElementById("sayor-reader-scroll")?.scrollTo({ top: 0 });
  }, [openChapter]);

  return (
    <>
      {/* Wordmark */}
      <section className="pt-32 pb-10 overflow-hidden md:pt-40">
        <div className="container-page text-center">
          <h2 className="font-display font-extrabold tracking-tighter gradient-text leading-none text-[clamp(4rem,18vw,16rem)]">
            SAYOR
          </h2>
          <p className="-mt-2 text-label">Annual · Bilingual · Bishwambarpur</p>
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
            className="fixed inset-0 z-[100] flex flex-col bg-[var(--color-background)] pt-[88px] sm:pt-[100px]"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedIssueData.title} reader`}
          >
            {/* Reader top bar */}
            <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-[var(--color-surface)]/85 px-4 py-3 backdrop-blur-md sm:px-8">
              <div className="flex min-w-0 items-center gap-3">
                {activeChapter && (
                  <button
                    type="button"
                    onClick={() => setOpenChapter(null)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]"
                  >
                    <BookOpen size={16} /> <span className="hidden sm:inline">Contents</span>
                  </button>
                )}
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    SAYOR · Edition {String(selectedIssueData.id).padStart(2, "0")}
                  </p>
                  <h3 className="truncate font-display text-lg font-semibold sm:text-xl">
                    {activeChapter ? activeChapter.title : selectedIssueData.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!activeChapter && (
                  <>
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
                  </>
                )}
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
            <div id="sayor-reader-scroll" className="flex-1 overflow-y-auto">
              {loadingContent && (
                <div className="flex items-center justify-center gap-3 py-32 text-muted-foreground">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm">Loading the issue…</span>
                </div>
              )}

              {/* TABLE OF CONTENTS */}
              {!loadingContent && !activeChapter && (
                <div className="container-page py-10 sm:py-14">
                  <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
                    {/* Cover */}
                    <div className="lg:sticky lg:top-6 lg:self-start">
                      <img
                        src={selectedIssueData.image}
                        alt={`${selectedIssueData.title} cover`}
                        className="mx-auto w-full max-w-[300px] rounded-lg border border-black/10 shadow-[0_30px_70px_-25px_rgba(15,23,42,0.6)]"
                      />
                      {doc?.editor && (
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                          সম্পাদক · {doc.editor}
                        </p>
                      )}
                    </div>

                    {/* Contents list */}
                    <div>
                      <p className="text-label mb-1">Contents · সূচিপত্র</p>
                      <h2 className="font-display text-3xl font-bold tracking-tight">
                        {chapters.length} {chapters.length === 1 ? "piece" : "pieces"} in this edition
                      </h2>
                      <ol className="mt-8 divide-y divide-border border-y border-border">
                        {chapters.map((c, idx) => (
                          <li key={idx}>
                            <button
                              type="button"
                              onClick={() => setOpenChapter(idx)}
                              className="group flex w-full items-baseline gap-4 py-4 text-left transition-colors hover:bg-[var(--color-surface)]"
                            >
                              <span className="w-8 shrink-0 font-display text-sm tabular-nums text-muted-foreground">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="sayor-prose block text-lg font-semibold leading-snug text-foreground group-hover:text-[var(--color-accent-1)]">
                                  {c.title}
                                </span>
                                {c.author && (
                                  <span className="sayor-prose mt-0.5 block text-sm text-muted-foreground">
                                    {c.author}
                                  </span>
                                )}
                              </span>
                              <ChevronRight
                                size={18}
                                className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent-1)]"
                              />
                            </button>
                          </li>
                        ))}
                      </ol>
                      {chapters.length === 0 && (
                        <p className="py-10 text-sm text-muted-foreground">
                          The text for this edition isn't available yet — enjoy the cover.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SINGLE ARTICLE */}
              {!loadingContent && activeChapter && (
                <AnimatePresence mode="wait">
                  <motion.article
                    key={openChapter}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-6 sm:py-16"
                  >
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {String((openChapter ?? 0) + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
                    </p>
                    <h1 className="sayor-prose mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                      {activeChapter.title}
                    </h1>
                    {activeChapter.author && (
                      <p className="sayor-prose mt-3 text-base text-[var(--color-accent-1)]">
                        {activeChapter.author}
                      </p>
                    )}

                    <div className="sayor-prose mt-10">
                      {activeChapter.paragraphs.map((p, i) => (
                        <p key={i} className="mb-5 text-[1.075rem] leading-[2] text-foreground/85">
                          {p}
                        </p>
                      ))}
                    </div>

                    {activeChapter.bio && (
                      <p className="sayor-prose mt-8 border-l-2 border-[var(--color-accent-1)] pl-4 text-sm italic text-muted-foreground">
                        {activeChapter.bio}
                      </p>
                    )}

                    <div className="mt-16 flex items-center justify-between gap-3 border-t border-border pt-8">
                      <button
                        type="button"
                        disabled={openChapter === 0}
                        onClick={() => flipChapter(-1)}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={16} /> Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenChapter(null)}
                        className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Contents
                      </button>
                      <button
                        type="button"
                        disabled={openChapter === chapters.length - 1}
                        onClick={() => flipChapter(1)}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.article>
                </AnimatePresence>
              )}
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
