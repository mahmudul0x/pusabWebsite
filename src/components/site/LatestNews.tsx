import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar } from "lucide-react";
import { publicityApi, optimizeImage, type PublicityPost } from "@/lib/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// One card per category — events are forward-looking, so they don't belong
// in a "latest news" feed and are deliberately left out.
const FEATURED_TYPES: PublicityPost["type"][] = ["news", "press", "blog"];

const TYPE_LABEL: Record<PublicityPost["type"], string> = {
  news: "News",
  press: "Press",
  event: "Event",
  blog: "Column",
};

export function LatestNews() {
  const [posts, setPosts] = useState<PublicityPost[] | null>(null);

  useEffect(() => {
    let active = true;
    publicityApi
      .listAll()
      .then((res) => active && setPosts(res))
      .catch(() => active && setPosts([]));
    return () => {
      active = false;
    };
  }, []);

  if (posts !== null && posts.length === 0) return null;

  // Sort by date first; when two posts share a date (e.g. duplicates), break
  // the tie with created_at so the most recently added one wins, not
  // whichever the API happened to return first.
  const byNewest = (a: PublicityPost, b: PublicityPost) => {
    const dateDiff =
      new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime();
    if (dateDiff !== 0) return dateDiff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  };

  // One card per category, newest first — but if a category has nothing (or
  // fewer posts than slots), backfill the gap from News so the row still
  // shows 3 cards whenever there are 3+ published News posts to draw from.
  const featured: PublicityPost[] = [];
  if (posts) {
    const published = posts.filter((p) => p.published).sort(byNewest);
    const news = published.filter((p) => p.type === "news");
    const used = new Set<number>();
    let newsIdx = 0;
    const nextNews = () => {
      while (newsIdx < news.length && used.has(news[newsIdx].id)) newsIdx++;
      return newsIdx < news.length ? news[newsIdx++] : undefined;
    };

    for (const type of FEATURED_TYPES) {
      const pick = published.find((p) => p.type === type && !used.has(p.id)) ?? nextNews();
      if (pick) {
        featured.push(pick);
        used.add(pick.id);
      }
    }
    featured.sort(byNewest);
  }

  if (posts !== null && featured.length === 0) return null;

  return (
    <section className="py-28 md:py-32">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-16">
          <div>
            <p className="text-label mb-3">Stay informed</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight max-w-xl">
              Latest <span className="gradient-text">News</span>
            </h2>
          </div>
          <Link
            to="/publicity"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            View all news{" "}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {posts === null ? null : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featured.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to="/publicity"
                  className="group block overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] transition-all duration-300 hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:shadow-[0_28px_55px_-35px_rgba(29,78,216,0.45)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#0F0F1A,#16162A)]">
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
                    <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                      {TYPE_LABEL[post.type]}
                    </span>
                  </div>
                  <div className="p-6">
                    {post.date && (
                      <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        <Calendar size={12} /> {formatDate(post.date)}
                      </p>
                    )}
                    <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-[var(--color-accent-1)]">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
