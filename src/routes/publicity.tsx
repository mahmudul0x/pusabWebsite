import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";
import {
  Calendar,
  Newspaper,
  FileText,
  Inbox,
  ArrowUpRight,
  ExternalLink,
  Loader2,
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

type Post = {
  id: string;
  type: "news" | "press" | "event";
  title: string;
  body: string | null;
  excerpt: string | null;
  date: string | null;
  image_url: string | null;
  link: string | null;
};

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
  const [reading, setReading] = useState<Post | null>(null);
  // Post whose external link is shown in the in-site iframe viewer.
  const [framed, setFramed] = useState<Post | null>(null);
  const [frameLoading, setFrameLoading] = useState(true);

  // Open a post: external link -> in-site iframe viewer; otherwise the reader.
  const openPost = (p: Post) => (p.link ? setFramed(p) : setReading(p));

  useEffect(() => {
    let active = true;
    setPosts(null);
    const load = () =>
      supabase
        .from("publicity_posts")
        .select("*")
        .eq("type", tab)
        .order("date", { ascending: false })
        .then(({ data }) => active && setPosts((data as Post[] | null) ?? []));
    load();
    const channel = supabase
      .channel(`publicity-${tab}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "publicity_posts" }, load)
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
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

  // Reset the loading state each time a new link is opened.
  useEffect(() => {
    if (framed) setFrameLoading(true);
  }, [framed]);

  const featured = posts && posts.length > 0 ? posts[0] : null;
  const rest = posts ? posts.slice(1) : [];

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
            <div className="space-y-5">
              {/* Featured story */}
              {featured && <PostCard post={featured} featured onOpen={openPost} index={0} />}
              {/* Rest */}
              {rest.length > 0 && (
                <div className="grid gap-5 md:grid-cols-3">
                  {rest.map((p, i) => (
                    <PostCard key={p.id} post={p} onOpen={openPost} index={i + 1} />
                  ))}
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
            className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
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
            className="fixed inset-0 z-[100] flex flex-col bg-slate-950/80 backdrop-blur-sm sm:p-4 md:p-6"
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

              {/* Embed */}
              <div className="relative flex-1 bg-background">
                {frameLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Loader2 className="animate-spin" size={22} />
                    <span className="text-sm">Loading the source…</span>
                  </div>
                )}
                <iframe
                  key={framed.id}
                  src={framed.link!}
                  title={framed.title}
                  onLoad={() => setFrameLoading(false)}
                  referrerPolicy="no-referrer"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  className="h-full w-full border-0"
                />
              </div>

              {/* Fallback hint */}
              <div className="border-t border-border px-4 py-2 text-center text-[11px] text-muted-foreground">
                সাইটটি এখানে না খুললে উপরের <span className="font-medium text-foreground">New tab</span>{" "}
                বাটন ব্যবহার করুন — কিছু সংবাদ সাইট embed করতে দেয় না।
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PostCard({
  post,
  onOpen,
  index,
  featured = false,
}: {
  post: Post;
  onOpen: (p: Post) => void;
  index: number;
  featured?: boolean;
}) {
  const hasLink = Boolean(post.link);

  const body = (
    <>
      <div
        className={
          "relative overflow-hidden bg-[linear-gradient(135deg,#0F0F1A,#16162A)] " +
          (featured ? "md:h-full md:min-h-[320px] aspect-[16/10] md:aspect-auto" : "aspect-[16/10]")
        }
      >
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,110,247,0.35),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(124,58,237,0.3),transparent_55%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
          {TYPE_LABEL[post.type]}
        </span>
        {hasLink && (
          <span className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur">
            <ExternalLink size={13} />
          </span>
        )}
      </div>

      <div className={"flex flex-col " + (featured ? "p-7 md:p-9" : "p-6")}>
        {post.date && (
          <p className="text-xs text-muted-foreground">{formatDate(post.date)}</p>
        )}
        <h3
          className={
            "mt-2 font-display font-bold leading-snug tracking-tight transition-colors group-hover:text-[var(--color-accent-1)] " +
            (featured ? "text-2xl md:text-3xl" : "text-lg")
          }
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className={
              "mt-3 text-sm leading-relaxed text-muted-foreground " +
              (featured ? "" : "line-clamp-2")
            }
          >
            {post.excerpt}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-1)]">
          {hasLink ? "Read full story" : "Read more"}
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </>
  );

  const cls =
    "group block overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] text-left transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--color-accent-1)_50%,transparent)] hover:shadow-[0_28px_55px_-35px_rgba(29,78,216,0.5)] " +
    (featured ? "md:grid md:grid-cols-2" : "");

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.5, delay: Math.min(index, 4) * 0.05 },
  } as const;

  // Both link and non-link posts open in-site: link -> iframe viewer, else reader.
  return (
    <motion.button type="button" onClick={() => onOpen(post)} className={cls + " w-full"} {...motionProps}>
      {body}
    </motion.button>
  );
}
