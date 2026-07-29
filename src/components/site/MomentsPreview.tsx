import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { galleryApi, optimizeImage, type GalleryItem } from "@/lib/api";

const PREVIEW_COUNT = 7;

// Mosaic span pattern for the 7-tile preview — one big feature tile, one
// tall tile, the rest uniform squares — same rhythm as the Moments page grid.
const TILE_SPAN = ["col-span-2 row-span-2", "", "", "row-span-2", "", "", ""];

export function MomentsPreview() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    let active = true;
    galleryApi
      .listAll()
      .then((res) => active && setItems(res))
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, []);

  if (items !== null && items.length === 0) return null;

  const byNewest = (a: GalleryItem, b: GalleryItem) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

  const preview = items ? [...items].sort(byNewest).slice(0, PREVIEW_COUNT) : [];

  return (
    <section className="py-28 md:py-32">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-16">
          <div>
            <p className="text-label mb-3">Life at PUSAB</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight max-w-xl">
              Recent <span className="gradient-text">Moments</span>
            </h2>
          </div>
          <Link
            to="/moments"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            View all moments{" "}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {items === null ? null : (
          <div className="grid auto-rows-[110px] grid-cols-3 grid-flow-dense gap-3 sm:auto-rows-[130px] sm:grid-cols-4 lg:auto-rows-[150px] lg:grid-cols-6">
            {preview.map((it, i) => (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (i % 7) * 0.06, ease: "easeOut" }}
                className={
                  "group relative overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] " +
                  TILE_SPAN[i % TILE_SPAN.length]
                }
              >
                <Link to="/moments" className="block h-full w-full">
                  <img
                    src={optimizeImage(it.image_url, 480)}
                    alt={it.title || "PUSAB moment"}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {it.title && (
                    <p className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left text-[11px] font-medium leading-snug text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {it.title}
                    </p>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
