import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { galleryApi, optimizeImage, type GalleryItem } from "@/lib/api";
import { usePageHero } from "@/lib/usePageHero";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  LayoutGrid,
  PartyPopper,
  Trophy,
  Users,
  Heart,
  Sparkles,
} from "lucide-react";
import heroMoments from "@/assets/hero-moments.jpg";

export const Route = createFileRoute("/moments")({
  head: () => ({
    meta: [
      { title: "Proud Moments — PUSAB" },
      {
        name: "description",
        content:
          "A photo journey through PUSAB's events, achievements, community service and reunions.",
      },
      { property: "og:title", content: "Proud Moments — PUSAB" },
      {
        property: "og:description",
        content: "Memories from PUSAB events, achievements and community service.",
      },
      { property: "og:url", content: "/moments" },
    ],
    links: [{ rel: "canonical", href: "/moments" }],
  }),
  component: MomentsPage,
});

type Item = GalleryItem;

const CATS = ["all", "events", "achievements", "community", "reunion", "other"] as const;
type Cat = (typeof CATS)[number];

const CAT_TABS: { key: Cat; label: string; Icon: typeof LayoutGrid }[] = [
  { key: "all", label: "All", Icon: LayoutGrid },
  { key: "events", label: "Events", Icon: PartyPopper },
  { key: "achievements", label: "Achievements", Icon: Trophy },
  { key: "community", label: "Community", Icon: Users },
  { key: "reunion", label: "Reunions", Icon: Heart },
  { key: "other", label: "Other", Icon: Sparkles },
];

const CAT_LABEL: Record<Cat, string> = {
  all: "All",
  events: "Events",
  achievements: "Achievements",
  community: "Community",
  reunion: "Reunions",
  other: "Other",
};

/**
 * Deterministic size pattern for the mosaic grid — repeats every 9 photos so a
 * couple of images per "page" of the grid stand out as bigger tiles instead of
 * every photo being the same uniform square.
 */
const TILE_SPAN = [
  "col-span-2 row-span-2", // big feature tile
  "",
  "",
  "row-span-2", // tall tile
  "",
  "col-span-2", // wide tile
  "",
  "",
  "",
];

function tileClass(i: number) {
  return TILE_SPAN[i % TILE_SPAN.length];
}

function MomentsPage() {
  const hero = usePageHero("moments");
  const [items, setItems] = useState<Item[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<Cat>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    galleryApi
      .listAll()
      .then((res) => setItems(res))
      .catch(() => {
        setFailed(true);
        setItems([]);
      });
  }, []);

  const shown = useMemo(
    () => (items ?? []).filter((i) => filter === "all" || i.category === filter),
    [items, filter],
  );

  const open = openIndex !== null ? shown[openIndex] : null;

  const showPrev = () =>
    setOpenIndex((i) => (i === null ? i : (i - 1 + shown.length) % shown.length));
  const showNext = () => setOpenIndex((i) => (i === null ? i : (i + 1) % shown.length));

  // Keyboard nav for the lightbox: Escape closes, arrows move between photos.
  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, shown.length]);

  return (
    <>
      <PageHero
        title={hero.title ?? "Proud Moments"}
        lede={
          hero.lede ??
          "A photo journey through PUSAB's events, achievements, community service and reunions."
        }
        crumbs={[{ label: "Home", to: "/" }, { label: "Moments" }]}
        image={hero.image ?? heroMoments}
        imageAlt={hero.imageAlt ?? "PUSAB reunion moments collage"}
      />

      <section className="relative -mt-10 pb-24 sm:-mt-12">
        <div className="container-page">
          <div className="relative z-20 mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-[var(--color-surface)]/95 p-2 shadow-[0_18px_40px_-20px_rgba(2,6,23,0.35)] backdrop-blur-md">
            <div
              role="tablist"
              aria-label="Filter by category"
              className="inline-flex flex-wrap gap-1"
            >
              {CAT_TABS.map((t) => {
                const count =
                  t.key === "all"
                    ? (items ?? []).length
                    : (items ?? []).filter((i) => i.category === t.key).length;
                const active = filter === t.key;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(t.key)}
                    className="relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors"
                  >
                    {active && (
                      <motion.span
                        layoutId="cat-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] shadow-[0_6px_16px_-6px_rgba(29,78,216,0.55)]"
                      />
                    )}
                    <span
                      className={
                        "relative z-10 inline-flex items-center gap-1.5 " +
                        (active ? "text-white" : "text-foreground/65 hover:text-foreground")
                      }
                    >
                      <t.Icon size={13} />
                      {t.label}
                      {count > 0 && (
                        <span
                          className={
                            "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums " +
                            (active ? "bg-white/20" : "bg-[var(--color-background)]")
                          }
                        >
                          {count}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            {items && !failed && shown.length > 0 && (
              <span className="mr-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {shown.length} {shown.length === 1 ? "photo" : "photos"}
              </span>
            )}
          </div>

          {items === null ? (
            <div className="grid auto-rows-[130px] grid-cols-3 gap-3 sm:auto-rows-[150px] sm:grid-cols-4 lg:auto-rows-[160px] lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={"rounded-2xl shimmer " + tileClass(i)} />
              ))}
            </div>
          ) : failed ? (
            <div className="rounded-3xl border border-border bg-[var(--color-surface)] p-16 text-center text-muted-foreground">
              Couldn't load photos right now — please try again shortly.
            </div>
          ) : shown.length === 0 ? (
            <div className="rounded-3xl border border-border bg-[var(--color-surface)] p-16 text-center text-muted-foreground">
              No moments here yet — but our story is still being written.
            </div>
          ) : (
            <div className="grid auto-rows-[130px] grid-cols-3 grid-flow-dense gap-3 sm:auto-rows-[150px] sm:grid-cols-4 lg:auto-rows-[160px] lg:grid-cols-6">
              {shown.map((it, i) => (
                <motion.button
                  key={it.id}
                  layoutId={`m-${it.id}`}
                  onClick={() => setOpenIndex(i)}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (i % 12) * 0.03 }}
                  className={
                    "group relative overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] text-left " +
                    tileClass(i)
                  }
                >
                  <img
                    src={optimizeImage(it.image_url, 640)}
                    alt={it.title || "PUSAB moment"}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {(it.title || it.year) && (
                    <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {it.title && (
                        <p className="line-clamp-1 text-sm font-semibold text-white">{it.title}</p>
                      )}
                      {it.year && (
                        <p className="mt-0.5 text-[11px] font-medium text-white/70">{it.year}</p>
                      )}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox — full detail view with prev/next navigation. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIndex(null)}
            className="fixed inset-0 z-[10000] grid place-items-center bg-slate-950/90 p-4 backdrop-blur-xl sm:p-8"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-full w-full max-w-5xl flex-col items-center"
            >
              <div className="relative w-full">
                <motion.img
                  key={open.id}
                  layoutId={`m-${open.id}`}
                  src={optimizeImage(open.image_url, 1600)}
                  alt={open.title || "PUSAB moment"}
                  className="mx-auto max-h-[72vh] rounded-2xl border border-border object-contain"
                />

                {shown.length > 1 && (
                  <>
                    <button
                      onClick={showPrev}
                      aria-label="Previous photo"
                      className="absolute left-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65 sm:-left-4"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={showNext}
                      aria-label="Next photo"
                      className="absolute right-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65 sm:-right-4"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setOpenIndex(null)}
                  aria-label="Close"
                  className="absolute -top-3 -right-3 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75 sm:top-0 sm:-right-14"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Caption bar */}
              <div className="mt-4 w-full max-w-2xl px-2 text-center">
                {(open.title || open.caption) && (
                  <>
                    {open.title && (
                      <p className="font-display text-lg font-bold text-white">{open.title}</p>
                    )}
                    {open.caption && (
                      <p className="mt-1 text-sm leading-relaxed text-white/70">{open.caption}</p>
                    )}
                  </>
                )}
                <div className="mt-3 flex items-center justify-center gap-3 text-xs text-white/50">
                  <span className="rounded-full border border-white/15 px-2.5 py-1 font-semibold uppercase tracking-wide">
                    {CAT_LABEL[open.category]}
                  </span>
                  {open.year && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={11} /> {open.year}
                    </span>
                  )}
                  {shown.length > 1 && (
                    <span>
                      {(openIndex ?? 0) + 1} / {shown.length}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
