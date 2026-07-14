import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Users,
  Heart,
  Music,
  Sparkles,
  Mic,
  Utensils,
  Camera,
  Gift,
  Quote,
  MoonStar,
  ZoomIn,
  X,
  type LucideIcon,
} from "lucide-react";
import { optimizeImage, type ProgramPage } from "@/lib/api";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  users: Users,
  heart: Heart,
  music: Music,
  sparkles: Sparkles,
  mic: Mic,
  utensils: Utensils,
  camera: Camera,
  gift: Gift,
};

const ACCENT = "var(--color-accent-1)";
const ACCENT_2 = "var(--color-accent-2)";
const GRADIENT = `linear-gradient(120deg, ${ACCENT}, ${ACCENT_2})`;

export function IftarMahfilPage({
  page,
  fallbackTitle,
  fallbackDesc,
  heroImageFallback,
  years,
  currentYear,
  loadingYear,
  onSwitchYear,
}: {
  page: ProgramPage | null;
  fallbackTitle: string;
  fallbackDesc: string;
  heroImageFallback: string;
  years: number[];
  currentYear: number;
  loadingYear: boolean;
  onSwitchYear: (y: number) => void;
}) {
  const title = page?.title || fallbackTitle;
  const tagline = page?.tagline || fallbackDesc;
  const overview = page?.overview || fallbackDesc;
  const heroImage = page?.hero_image_url ? optimizeImage(page.hero_image_url, 1200) : heroImageFallback;

  const gallery = page?.gallery ?? [];
  const GALLERY_INITIAL = 8;
  const [galleryVisible, setGalleryVisible] = useState(GALLERY_INITIAL);
  const visibleGallery = gallery.slice(0, galleryVisible);
  const galleryAllShown = galleryVisible >= gallery.length;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const aboutFeatures = page?.objectives ?? [];
  const highlights = page?.info_items ?? [];

  const titleParts = title.split(" ");
  const splitAt = Math.ceil(titleParts.length / 2);

  const heroFacts = [
    page?.event_date ? { Icon: Calendar, label: "Date", value: page.event_date } : null,
    page?.event_time ? { Icon: Clock, label: "Time", value: page.event_time } : null,
    page?.venue ? { Icon: MapPin, label: "Venue", value: page.venue } : null,
  ].filter((f): f is { Icon: LucideIcon; label: string; value: string } => f !== null);

  return (
    <>
      {/* Hero — full-cover photo header (site's standard full-photo hero pattern) */}
      <section className="relative flex h-[380px] items-end overflow-hidden pt-28 pb-10 md:h-[460px] md:pt-32 md:pb-14">
        <img src={heroImage} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/55 to-slate-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        <div className="container-page relative z-10 [text-shadow:0_2px_30px_rgba(2,6,23,0.5)]">
          <nav className="mb-4 flex items-center gap-2 text-xs text-white/70">
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight size={12} className="opacity-60" />
            <Link to="/programs" className="transition-colors hover:text-white">
              Programs
            </Link>
            <ChevronRight size={12} className="opacity-60" />
            <span className="text-white">{title}</span>
          </nav>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
            <MoonStar size={13} style={{ color: ACCENT }} />
            Faith &middot; Unity &middot; Gratitude
          </div>

          <h1 className="max-w-2xl font-display text-3xl font-extrabold leading-[1.04] tracking-[-0.03em] text-white md:text-5xl">
            {titleParts.slice(0, splitAt).join(" ")}{" "}
            <span style={{ color: ACCENT }}>{titleParts.slice(splitAt).join(" ")}</span>
          </h1>
          {tagline && <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">{tagline}</p>}

          {heroFacts.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-white/85 md:text-sm">
              {heroFacts.map((f) => (
                <span key={f.label} className="inline-flex items-center gap-2">
                  <f.Icon size={14} style={{ color: ACCENT }} />
                  {f.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-page">
          {/* Year switcher */}
          {years.length > 1 && page && (
            <div className="mb-10">
              <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                <Calendar size={13} /> Browse by year
              </p>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => {
                  const isActive = y === currentYear;
                  return (
                    <button
                      key={y}
                      onClick={() => onSwitchYear(y)}
                      disabled={loadingYear}
                      className={
                        "rounded-full px-5 py-2.5 text-sm font-bold transition-all disabled:opacity-60 " +
                        (isActive ? "text-white shadow-md" : "border text-foreground/80 hover:text-foreground")
                      }
                      style={
                        isActive
                          ? { background: GRADIENT }
                          : { borderColor: "color-mix(in oklab, var(--color-accent-1) 30%, var(--color-border))" }
                      }
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* About + quote card */}
          <div className="mb-16 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                About the Iftar
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                More Than Just Breaking the Fast
              </h2>
              <div className="mt-2 h-1 w-14 rounded-full" style={{ background: GRADIENT }} />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{overview}</p>

              {aboutFeatures.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {aboutFeatures.map((f, i) => {
                    const FeatureIcon = FEATURE_ICONS[f.icon] ?? Sparkles;
                    return (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
                        className="rounded-2xl border border-border bg-[var(--color-surface)] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-sm" style={{ background: GRADIENT }}>
                          <FeatureIcon size={17} />
                        </div>
                        <p className="mt-3 text-sm font-bold leading-tight">{f.title}</p>
                        {f.description && <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{f.description}</p>}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border p-6 md:p-8" style={{ background: "var(--color-surface-2)" }}>
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full"
                style={{ background: `color-mix(in oklab, ${ACCENT} 8%, transparent)` }}
              />
              <h3 className="relative font-display text-lg font-bold" style={{ color: ACCENT }}>
                All Are Welcome
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                Open to all PUSAB members, alumni, and their families.
              </p>
              <div className="relative mt-6 rounded-xl border-l-4 bg-[var(--color-surface)] p-5" style={{ borderColor: ACCENT }}>
                <Quote size={18} style={{ color: ACCENT }} className="opacity-80" />
                <p className="mt-2 text-sm italic leading-relaxed text-foreground">
                  "The best of you are those who feed others and return greetings of peace."
                </p>
                <p className="mt-2 text-xs text-muted-foreground">— Prophet Muhammad (ﷺ)</p>
              </div>
              <a
                href={page?.register_url || "#"}
                className="relative mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: GRADIENT }}
              >
                Join Us <ArrowRight size={15} />
              </a>
            </div>
          </div>

          {/* Highlights — numbered cards with reveal accent line */}
          {highlights.length > 0 && (
            <div className="mb-16">
              <div className="text-center">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                  What to Expect
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Iftar Highlights</h2>
                <div className="mx-auto mt-2 h-1 w-14 rounded-full" style={{ background: GRADIENT }} />
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {highlights.map((item, idx) => {
                  const ItemIcon = FEATURE_ICONS[item.icon] ?? Sparkles;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: (idx % 6) * 0.06, ease: "easeOut" }}
                      className="group relative overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <span
                        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                        style={{ background: GRADIENT }}
                      />
                      <div className="flex items-start justify-between">
                        <div className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-sm" style={{ background: GRADIENT }}>
                          <ItemIcon size={16} />
                        </div>
                        <span className="font-display text-2xl font-extrabold leading-none text-foreground/10">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-4 text-sm font-bold leading-tight">{item.label}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.value}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gallery — 4-up grid, 8 photos initially, show-more below */}
          {gallery.length > 0 && (
            <div className="mb-16">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                    Glimpses from Past Iftar
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">
                    Moments That Stay in Our Hearts
                  </h2>
                </div>
                <button
                  onClick={() => setLightboxIndex(0)}
                  className="hidden shrink-0 rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground/80 transition-colors hover:text-foreground sm:inline-flex"
                >
                  View All Photos
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {visibleGallery.map((g, i) => (
                  <motion.button
                    key={g.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: (i % 4) * 0.07, ease: "easeOut" }}
                    onClick={() => setLightboxIndex(i)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-sm transition-shadow duration-300 hover:shadow-xl"
                  >
                    <img
                      src={optimizeImage(g.image_url, 480)}
                      alt={g.caption || title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-slate-950/55 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      {String(i + 1).padStart(2, "0")} / {gallery.length}
                    </span>
                    <span className="absolute right-2.5 top-2.5 grid h-7 w-7 scale-75 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <ZoomIn size={13} />
                    </span>
                    {g.caption && (
                      <p className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left text-[11px] font-medium leading-snug text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {g.caption}
                      </p>
                    )}
                  </motion.button>
                ))}
              </div>

              {gallery.length > GALLERY_INITIAL && (
                <div className="mt-7 flex justify-center">
                  <button
                    onClick={() =>
                      setGalleryVisible((c) =>
                        galleryAllShown ? GALLERY_INITIAL : Math.min(c + GALLERY_INITIAL, gallery.length),
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-bold text-foreground/85 transition-colors hover:text-foreground"
                    style={{ borderColor: `color-mix(in oklab, ${ACCENT} 35%, var(--color-border))` }}
                  >
                    {galleryAllShown ? "Show less" : `Show more (${gallery.length - galleryVisible} more)`}
                    <ChevronDown
                      size={15}
                      className={"transition-transform duration-300 " + (galleryAllShown ? "rotate-180" : "")}
                      style={{ color: ACCENT }}
                    />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxIndex !== null && gallery[lightboxIndex] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxIndex(null)}
                className="fixed inset-0 z-[10000] grid place-items-center bg-black/85 p-6 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-[92vw]"
                >
                  <img
                    src={optimizeImage(gallery[lightboxIndex].image_url, 1600)}
                    alt={gallery[lightboxIndex].caption || title}
                    className="max-h-[80vh] max-w-full rounded-2xl border border-white/10 object-contain"
                  />
                  {gallery[lightboxIndex].caption && (
                    <p className="mt-4 text-center text-sm text-white/85">{gallery[lightboxIndex].caption}</p>
                  )}
                </motion.div>
                <button
                  onClick={() => setLightboxIndex(null)}
                  aria-label="Close"
                  className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur"
                >
                  <X size={18} />
                </button>
                {lightboxIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((i) => (i !== null ? i - 1 : i));
                    }}
                    aria-label="Previous photo"
                    className="absolute left-4 top-1/2 hidden -translate-y-1/2 h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur sm:grid"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                {lightboxIndex < gallery.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((i) => (i !== null ? i + 1 : i));
                    }}
                    aria-label="Next photo"
                    className="absolute right-4 top-1/2 hidden -translate-y-1/2 h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur sm:grid"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA — gradient banner with decorative rings */}
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-10" style={{ background: GRADIENT }}>
            <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/[0.07]" />
            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
                  <MoonStar size={20} />
                </div>
                <div className="text-white">
                  <h3 className="font-display text-xl font-bold leading-tight md:text-2xl">
                    {page?.cta_title || "Let's make this Ramadan memorable together."}
                  </h3>
                  {page?.cta_subtitle && <p className="mt-1 text-sm text-white/85">{page.cta_subtitle}</p>}
                </div>
              </div>
              {page?.register_label && (
                <a
                  href={page.register_url || "#"}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold shadow-md transition-opacity hover:opacity-90"
                  style={{ color: ACCENT }}
                >
                  {page.register_label} <ArrowRight size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
