import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { publicityApi, optimizeImage, type PublicityPost } from "@/lib/api";
import { usePageHero } from "@/lib/usePageHero";
import {
  Calendar,
  Newspaper,
  FileText,
  Inbox,
  ArrowUpRight,
  ExternalLink,
  X,
  WifiOff,
  RefreshCw,
  LayoutGrid,
  PenLine,
} from "lucide-react";
import heroPublicity from "@/assets/hero-publicity.jpg";

export const Route = createFileRoute("/publicity")({
  head: () => ({
    meta: [
      { title: "Publicity — News, Press & Events | PUSAB" },
      {
        name: "description",
        content: "Latest news, press releases and upcoming events from PUSAB.",
      },
      { property: "og:title", content: "Publicity — PUSAB" },
      { property: "og:description", content: "News, press releases and event updates from PUSAB." },
      { property: "og:url", content: "/publicity" },
    ],
    links: [{ rel: "canonical", href: "/publicity" }],
  }),
  component: PublicityPage,
});

type Post = PublicityPost;
type Tab = Post["type"] | "all";

const TABS: { key: Tab; label: string; Icon: typeof Newspaper }[] = [
  { key: "all", label: "All", Icon: LayoutGrid },
  { key: "news", label: "News", Icon: Newspaper },
  { key: "press", label: "Press Releases", Icon: FileText },
  { key: "event", label: "Upcoming Events", Icon: Calendar },
  { key: "blog", label: "Columns", Icon: PenLine },
];

const TYPE_LABEL: Record<Post["type"], string> = {
  news: "News",
  press: "Press",
  event: "Event",
  blog: "Column",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Today as `YYYY-MM-DD` in the visitor's own timezone. */
function today() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/**
 * True once the event's day is over. `date` is a calendar day with no time, so
 * compare it as a string — an event stays "upcoming" for the whole of its day
 * rather than expiring at midnight UTC partway through it.
 */
function hasPassed(date: string) {
  return date < today();
}

/** Soonest first, so the next event leads the Events tab. */
function bySoonest(a: Post, b: Post) {
  // Undated events sort last; there is no date to promise the visitor.
  if (!a.date) return b.date ? 1 : 0;
  if (!b.date) return -1;
  return a.date.localeCompare(b.date);
}

function PublicityPage() {
  const hero = usePageHero("publicity");
  const [tab, setTab] = useState<Tab>("all");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [failed, setFailed] = useState(false);
  // Bumped by "Try again" to re-run the fetch effect.
  const [reloadKey, setReloadKey] = useState(0);
  const [visibleCount, setVisibleCount] = useState(9);
  const [pastCount, setPastCount] = useState(9);
  const [reading, setReading] = useState<Post | null>(null);
  // Post whose external link is shown in the in-site viewer.
  const [framed, setFramed] = useState<Post | null>(null);

  // Open a post: external link -> in-site preview viewer; otherwise the reader.
  const openPost = (p: Post) => (p.link ? setFramed(p) : setReading(p));

  useEffect(() => {
    let active = true;
    setPosts(null);
    setFailed(false);
    setVisibleCount(9);
    setPastCount(9);
    publicityApi
      .listAll(tab === "all" ? {} : { type: tab })
      .then((res) => active && setPosts(res))
      // A failed request is not the same as an empty tab — say so, rather than
      // telling the visitor there is nothing to see.
      .catch(() => {
        if (!active) return;
        setFailed(true);
        setPosts([]);
      });
    return () => {
      active = false;
    };
  }, [tab, reloadKey]);

  // Lock scroll and close on Escape while any overlay is open.
  useEffect(() => {
    if (!reading && !framed) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setReading(null);
      setFramed(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [reading, framed]);

  // Events are forward-looking, so they sort by what happens next; news and
  // press releases are a record of what already happened, so newest leads.
  const isEvents = tab === "event";
  const isAll = tab === "all";
  const all = posts ?? [];

  const byNewest = (a: Post, b: Post) =>
    new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime();

  // Undated events can't have passed yet, so they stay in the upcoming list.
  const upcoming = isEvents ? all.filter((p) => !p.date || !hasPassed(p.date)).sort(bySoonest) : [];
  const past = isEvents ? all.filter((p) => p.date && hasPassed(p.date)).sort(byNewest) : [];

  // "All" leads with news/press (what already happened); events get their own
  // strip below rather than being buried by date among old stories.
  const primary = isEvents
    ? upcoming
    : isAll
      ? [...all].filter((p) => p.type !== "event").sort(byNewest)
      : [...all].sort(byNewest);
  const featured = primary[0] ?? null;
  const rest = primary.slice(1);

  // On "All", only upcoming events get their own strip — past ones would just
  // be clutter next to a feed that's already newest-first.
  const allUpcoming = isAll
    ? all.filter((p) => p.type === "event" && (!p.date || !hasPassed(p.date))).sort(bySoonest)
    : [];

  // With events split in two, the tab is only empty when both halves are.
  const isEmpty = isEvents
    ? upcoming.length === 0 && past.length === 0
    : isAll
      ? primary.length === 0 && allUpcoming.length === 0
      : primary.length === 0;

  return (
    <>
      <PageHero
        title={hero.title ?? "Publicity"}
        lede={
          hero.lede ??
          "News, press releases and upcoming events — straight from PUSAB. Tap any story to read the full coverage."
        }
        crumbs={[{ label: "Home", to: "/" }, { label: "Publicity" }]}
        image={hero.image ?? heroPublicity}
        imageAlt={hero.imageAlt ?? "PUSAB press conference"}
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          {/* Tabs */}
          <div className="mb-10 flex items-center justify-between gap-4 flex-wrap">
            <div
              role="tablist"
              aria-label="Publicity categories"
              className="inline-flex glass rounded-full p-1 gap-1"
            >
              {TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  aria-controls="publicity-panel"
                  onClick={() => setTab(t.key)}
                  className="relative px-4 py-2 text-sm font-medium"
                >
                  {tab === t.key && (
                    <motion.span
                      layoutId="pub-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))]"
                    />
                  )}
                  <span
                    className={
                      "relative z-10 inline-flex items-center gap-2 " +
                      (tab === t.key ? "text-white" : "text-foreground/70 hover:text-foreground")
                    }
                  >
                    <t.Icon size={14} /> {t.label}
                  </span>
                </button>
              ))}
            </div>
            {posts && !failed && !isEmpty && (
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {isEvents
                  ? `${upcoming.length} upcoming`
                  : `${primary.length} ${primary.length === 1 ? "story" : "stories"}` +
                    (isAll && allUpcoming.length > 0 ? ` · ${allUpcoming.length} upcoming` : "")}
              </span>
            )}
          </div>

          <div id="publicity-panel" role="tabpanel" aria-busy={posts === null}>
            {posts === null ? (
              <div className="grid gap-5 md:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-2xl border border-border overflow-hidden">
                    <div className="aspect-[16/10] shimmer" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 w-16 shimmer rounded" />
                      <div className="h-5 w-3/4 shimmer rounded" />
                      <div className="h-3 w-1/2 shimmer rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : failed ? (
              <div className="rounded-3xl border border-border bg-[var(--color-surface)] p-16 text-center">
                <WifiOff size={32} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Couldn't load this section. Please check your connection.
                </p>
                <button
                  onClick={() => setReloadKey((k) => k + 1)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:text-foreground"
                >
                  <RefreshCw size={14} /> Try again
                </button>
              </div>
            ) : isEmpty ? (
              <div className="rounded-3xl border border-border bg-[var(--color-surface)] p-16 text-center">
                <Inbox size={32} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No posts yet. Check back soon.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Featured lead story */}
                {featured && <FeaturedStory post={featured} onOpen={openPost} />}

                {/* Compact news-grid of more stories — scales cleanly */}
                {rest.length > 0 && (
                  <div>
                    <p className="text-label mb-4">{isEvents ? "More events" : "More stories"}</p>
                    <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                      {rest.slice(0, visibleCount).map((p) => (
                        <PostGridCard key={p.id} post={p} onOpen={openPost} />
                      ))}
                    </div>
                    {rest.length > visibleCount && (
                      <div className="mt-10 text-center">
                        <button
                          onClick={() => setVisibleCount((c) => c + 9)}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:text-foreground"
                        >
                          {isEvents ? "Load more events" : "Load more stories"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* On "All", upcoming events get their own strip instead of being
                    buried by date among older news and press releases. */}
                {isAll && allUpcoming.length > 0 && (
                  <div className={primary.length > 0 ? "border-t border-border pt-10" : undefined}>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <p className="text-label">Upcoming events</p>
                      {allUpcoming.length > 3 && (
                        <button
                          onClick={() => setTab("event")}
                          className="text-xs font-semibold text-[var(--color-accent-1)] hover:underline"
                        >
                          See all events
                        </button>
                      )}
                    </div>
                    <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                      {allUpcoming.slice(0, 3).map((p) => (
                        <PostGridCard key={p.id} post={p} onOpen={openPost} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Events that have already happened — kept visible as a record,
                  but clearly separated from what is still to come. */}
                {isEvents && past.length > 0 && (
                  <div className={upcoming.length > 0 ? "border-t border-border pt-10" : undefined}>
                    <p className="text-label mb-4">Past events</p>
                    <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                      {past.slice(0, pastCount).map((p) => (
                        <PostGridCard key={p.id} post={p} onOpen={openPost} />
                      ))}
                    </div>
                    {past.length > pastCount && (
                      <div className="mt-10 text-center">
                        <button
                          onClick={() => setPastCount((c) => c + 9)}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:text-foreground"
                        >
                          Load more past events
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reader modal — for posts without an external link. */}
      <AnimatePresence>
        {reading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setReading(null)}
          >
            <motion.article
              role="dialog"
              aria-modal="true"
              aria-labelledby="publicity-reader-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-[var(--color-surface)] sm:rounded-3xl"
            >
              {reading.image_url && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={reading.image_url}
                    alt={reading.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => setReading(null)}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65"
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-[color-mix(in_oklab,var(--color-accent-1)_14%,transparent)] px-2.5 py-1 font-bold uppercase tracking-[0.16em] text-[var(--color-accent-1)]">
                    {TYPE_LABEL[reading.type]}
                  </span>
                  {reading.date && (
                    <span className="text-muted-foreground">{formatDate(reading.date)}</span>
                  )}
                </div>
                <h2
                  id="publicity-reader-title"
                  className="mt-4 font-display text-2xl md:text-3xl font-bold tracking-tight"
                >
                  {reading.title}
                </h2>
                {reading.excerpt && reading.excerpt.trim() !== reading.title.trim() && (
                  <p className="mt-2 text-base font-medium leading-snug text-muted-foreground">
                    {reading.excerpt}
                  </p>
                )}
                {reading.author && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
                    By {reading.author}
                  </p>
                )}
                <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/85">
                  {reading.body || "No further details available."}
                </p>
                {reading.link && (
                  <a
                    href={reading.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Read full coverage <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      {/* In-site link viewer — embeds the external source, with an open-in-new-tab fallback. */}
      <AnimatePresence>
        {framed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex flex-col bg-slate-950/80 backdrop-blur-sm sm:p-4 md:p-6"
            onClick={() => setFramed(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="publicity-viewer-title"
              initial={{ opacity: 0, y: 24, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.99 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden border border-border bg-[var(--color-surface)] sm:rounded-2xl"
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div className="min-w-0">
                  <p
                    id="publicity-viewer-title"
                    className="truncate font-display text-sm font-semibold sm:text-base"
                  >
                    {framed.title}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">{framed.link}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={framed.link!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-3.5 py-2 text-xs font-semibold text-white"
                  >
                    <ExternalLink size={13} /> <span className="hidden sm:inline">New tab</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setFramed(null)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Preview — many news sites block embedding, so we show the
                  post's own image and link out to the full story. */}
              <div className="relative flex-1 overflow-hidden bg-[var(--color-surface)]">
                {framed.image_url ? (
                  <img
                    src={optimizeImage(framed.image_url, 1400)}
                    alt={framed.title}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-muted-foreground">
                    No image was added for this story.
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2.5 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent p-6">
                  <a
                    href={framed.link!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(29,78,216,0.7)]"
                  >
                    Read the original story <ExternalLink size={15} />
                  </a>
                  <p className="text-[11px] text-white/80">
                    Opens the full story on the source site.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Clean, professional lead story — image left, content right. */
function FeaturedStory({ post, onOpen }: { post: Post; onOpen: (p: Post) => void }) {
  const showExcerpt = post.excerpt && post.excerpt.trim() !== post.title.trim();
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(post)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="group grid w-full overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] text-left transition-all duration-300 hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:shadow-[0_28px_55px_-35px_rgba(29,78,216,0.45)] md:grid-cols-2"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#0F0F1A,#16162A)] md:aspect-auto md:min-h-[260px]">
        {post.image_url ? (
          <img
            src={optimizeImage(post.image_url, 1000)}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,110,247,0.35),transparent_55%)]" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
          {TYPE_LABEL[post.type]}
        </span>
        {post.link && (
          <span className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur">
            <ExternalLink size={13} />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center p-6 md:p-8">
        {post.date && (
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {formatDate(post.date)}
          </p>
        )}
        <h2 className="mt-2 line-clamp-3 font-display text-xl font-bold leading-snug tracking-tight transition-colors group-hover:text-[var(--color-accent-1)] md:text-2xl">
          {post.title}
        </h2>
        {showExcerpt && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground md:line-clamp-3">
            {post.excerpt}
          </p>
        )}
        {post.author && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            By {post.author}
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-1)]">
          Read full story
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </motion.button>
  );
}

/** Compact news card (image top, headline, tag) — used in the stories grid. */
function PostGridCard({ post, onOpen }: { post: Post; onOpen: (p: Post) => void }) {
  return (
    <button type="button" onClick={() => onOpen(post)} className="group block text-left">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[linear-gradient(135deg,#0F0F1A,#16162A)]">
        {post.image_url ? (
          <img
            src={optimizeImage(post.image_url, 560)}
            alt={post.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,110,247,0.35),transparent_55%)]" />
        )}
        {post.link && (
          <span className="absolute right-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur">
            <ExternalLink size={12} />
          </span>
        )}
      </div>

      <h3 className="mt-3 line-clamp-2 font-display text-base font-bold leading-snug tracking-tight transition-colors group-hover:text-[var(--color-accent-1)]">
        {post.title}
      </h3>
      <div className="mt-2 flex items-center gap-2">
        <span className="rounded bg-[var(--color-accent-1)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {TYPE_LABEL[post.type]}
        </span>
        {post.date && (
          <span className="text-[11px] text-muted-foreground">{formatDate(post.date)}</span>
        )}
        {post.author && (
          <span className="truncate text-[11px] text-muted-foreground">By {post.author}</span>
        )}
      </div>
    </button>
  );
}
