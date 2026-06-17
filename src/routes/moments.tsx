import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import heroMoments from "@/assets/hero-moments.jpg";

export const Route = createFileRoute("/moments")({
  head: () => ({
    meta: [
      { title: "Proud Moments — PUSAB" },
      { name: "description", content: "A photo journey through PUSAB's events, achievements, community service and reunions." },
      { property: "og:title", content: "Proud Moments — PUSAB" },
      { property: "og:description", content: "Memories from PUSAB events, achievements and community service." },
      { property: "og:url", content: "/moments" },
    ],
    links: [{ rel: "canonical", href: "/moments" }],
  }),
  component: MomentsPage,
});

type Item = { id: string; title: string | null; category: string; image_url: string; year: number | null };
const CATS = ["all", "events", "achievements", "community", "reunion"] as const;

function MomentsPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [filter, setFilter] = useState<(typeof CATS)[number]>("all");
  const [open, setOpen] = useState<Item | null>(null);

  useEffect(() => {
    supabase
      .from("gallery_items")
      .select("id,title,category,image_url,year")
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Item[] | null) ?? []));
  }, []);

  const shown = (items ?? []).filter((i) => filter === "all" || i.category === filter);

  return (
    <>
      <PageHero title="Proud Moments" lede="A photo journey through PUSAB's events, achievements, community service and reunions." crumbs={[{ label: "Home", to: "/" }, { label: "Moments" }]} image={heroMoments} imageAlt="PUSAB reunion moments collage" />

      <section className="pb-24">
        <div className="container-page">
          <div className="inline-flex glass rounded-full p-1 gap-1 mb-10 capitalize">
            {CATS.map((c) => (
              <button key={c} onClick={() => setFilter(c)} className="relative px-4 py-2 text-sm font-medium">
                {filter === c && (
                  <motion.span layoutId="cat-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))]" />
                )}
                <span className={"relative z-10 " + (filter === c ? "text-white" : "text-foreground/70 hover:text-foreground")}>{c}</span>
              </button>
            ))}
          </div>

          {items === null ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="mb-4 break-inside-avoid rounded-2xl shimmer" style={{ height: 180 + (i % 3) * 60 }} />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <div className="rounded-3xl border border-border bg-[var(--color-surface)] p-16 text-center text-muted-foreground">
              No moments here yet — but our story is still being written.
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {shown.map((it) => (
                <motion.button
                  key={it.id}
                  layoutId={`m-${it.id}`}
                  onClick={() => setOpen(it)}
                  className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]"
                >
                  <img src={it.image_url} alt={it.title ?? ""} className="w-full h-auto transition-transform duration-500 hover:scale-105" />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(null)}
            className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-xl grid place-items-center p-6"
          >
            <motion.img
              layoutId={`m-${open.id}`}
              src={open.image_url}
              alt={open.title ?? ""}
              className="max-h-[88vh] max-w-[92vw] rounded-2xl border border-border"
            />
            <button onClick={() => setOpen(null)} className="absolute top-6 right-6 h-10 w-10 rounded-full glass grid place-items-center">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}