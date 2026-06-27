import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { publicityApi, optimizeImage, type PublicityPost } from "@/lib/api";
import {
  Calendar,
  Newspaper,
  FileText,
  Inbox,
  ArrowUpRight,
  ExternalLink,
  X,
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

const TABS: { key: Post["type"]; label: string; Icon: typeof Newspaper }[] = [
  { key: "news", label: "News", Icon: Newspaper },
  { key: "press", label: "Press Releases", Icon: FileText },
  { key: "event", label: "Upcoming Events", Icon: Calendar },
];

const TYPE_LABEL: Record<Post["type"], string> = {
  news: "News",
  press: "Press",
  event: "Event",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PublicityPage() {
  const [tab, setTab] = useState<Post["type"]>("news");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);
  const [reading, setReading] = useState<Post | null>(null);
  // Post whose external link is shown in the in-site viewer.
  const [framed, setFramed] = useState<Post | null>(null);

  // Open a post: external link -> in-site preview viewer; otherwise the reader.
  const openPost = (p: Post) => (p.link ? setFramed(p) : setReading(p));

  useEffect(() => {
    let active = true;
    setPosts(null);
    setVisibleCount(9);
    publicityApi
      .list({ type: tab })
      .then((res) => active && setPosts(res.results))
      .catch(() => active && setPosts([]));
    return () => {
      active = false;
    };
  }, [tab]);

  // Lock scroll while any overlay is open.
  useEffect(() => {
    if (!reading && !framed) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [reading, framed]);

  // Newest first (by date, falling back to created_at) so the lead is the latest.
  const sorted = posts
    ? [...posts].sort(
        (a, b) =>
          new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime(),
      )
    : [];
  const featured = sorted[0] ?? null;
  const rest = sorted.slice(1);

  return (
    <>
      <PageHero
        title="Publicity"
        lede="News, press releases and upcoming events — straight from PUSAB. Tap any story to read the full coverage."
        crumbs={[{ label: "Home", to: "/" }, { label: "Publicity" }]}
        image={heroPublicity}
        imageAlt="PUSAB press conference"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          {/* Tabs */}
          <div className="mb-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="inline-flex glass rounded-full p-1 gap-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
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
            {posts && posts.length > 0 && (
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {posts.length} {posts.length === 1 ? "story" : "stories"}
              </span>
            )}
          </div>

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
          ) : posts.length === 0 ? (
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
                  <p className="text-label mb-4">More stories</p>
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
                        Load more stories
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
                <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold tracking-tight">
                  {reading.title}
                </h2>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/85">
                  {reading.body || reading.excerpt || "No further details available."}
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
                  <p className="truncate font-display text-sm font-semibold sm:text-base">
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
                    এই সংবাদের জন্য কোনো ছবি যোগ করা হয়নি।
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2.5 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent p-6">
                  <a
                    href={framed.link!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(29,78,216,0.7)]"
                  >
                    মূল সংবাদ পড়ুন <ExternalLink size={15} />
                  </a>
                  <p className="text-[11px] text-white/80">পুরো সংবাদটি মূল সাইটে খুলবে।</p>
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
      </div>
    </button>
  );
}
