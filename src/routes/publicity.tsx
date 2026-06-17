import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Newspaper, FileText, Inbox } from "lucide-react";
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
  date: string | null;
  image_url: string | null;
};

const TABS: { key: Post["type"]; label: string; Icon: typeof Newspaper }[] = [
  { key: "news", label: "News", Icon: Newspaper },
  { key: "press", label: "Press Releases", Icon: FileText },
  { key: "event", label: "Upcoming Events", Icon: Calendar },
];

function PublicityPage() {
  const [tab, setTab] = useState<Post["type"]>("news");
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    let active = true;
    setPosts(null);
    (async () => {
      const { data } = await supabase
        .from("publicity_posts")
        .select("id,type,title,body,date,image_url")
        .eq("type", tab)
        .order("date", { ascending: false });
      if (active) setPosts((data as Post[] | null) ?? []);
    })();
    const channel = supabase
      .channel(`publicity-${tab}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "publicity_posts" }, () => {
        supabase
          .from("publicity_posts")
          .select("id,type,title,body,date,image_url")
          .eq("type", tab)
          .order("date", { ascending: false })
          .then(({ data }) => active && setPosts((data as Post[] | null) ?? []));
      })
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [tab]);

  return (
    <>
      <PageHero
        title="Publicity"
        lede="News, press releases and upcoming events — straight from PUSAB."
        crumbs={[{ label: "Home", to: "/" }, { label: "Publicity" }]}
        image={heroPublicity}
        imageAlt="PUSAB press conference"
      />
      <section className="pb-24">
        <div className="container-page">
          <div className="inline-flex glass rounded-full p-1 gap-1 mb-10">
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

          {posts === null ? (
            <div className="grid md:grid-cols-3 gap-5">
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
            <div className="grid md:grid-cols-3 gap-5">
              {posts.map((p, i) => (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group rounded-2xl border border-border overflow-hidden bg-[var(--color-surface)] hover:border-[color-mix(in_oklab,var(--color-accent-1)_50%,transparent)] transition-colors"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#0F0F1A,#16162A)]">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(79,110,247,0.3),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(124,58,237,0.25),transparent_55%)]" />
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-label">{p.type.toUpperCase()}</span>
                    <h3 className="mt-3 font-display text-lg font-semibold leading-snug">
                      {p.title}
                    </h3>
                    {p.date && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(p.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
