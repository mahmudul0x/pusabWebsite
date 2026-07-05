import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Gamepad2,
  Music,
  Utensils,
  Camera,
  Gift,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { optimizeImage, type ProgramPage } from "@/lib/api";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  target: Gamepad2,
  music: Music,
  utensils: Utensils,
  camera: Camera,
  gift: Gift,
  heart: Sparkles,
  sparkles: Sparkles,
};

const ACCENT = "var(--color-accent-1)";
const ACCENT_2 = "var(--color-accent-2)";

function HeroFacts({
  eventDate,
  venue,
  eligibility,
}: {
  eventDate: string;
  venue: string;
  eligibility: string;
}) {
  const facts = [
    { icon: Calendar, label: "Date", value: eventDate },
    { icon: MapPin, label: "Venue", value: venue },
    { icon: Users, label: "Who Can Join", value: eligibility },
  ].filter((f) => f.value);

  if (facts.length === 0) return null;

  return (
    <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {facts.map((f) => (
        <div key={f.label} className="flex items-start gap-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: "color-mix(in oklab, var(--color-accent-1) 8%, transparent)" }}>
            <f.icon size={15} style={{ color: ACCENT }} />
          </div>
          <div>
            <p className="text-xs font-bold leading-tight text-foreground">{f.label}</p>
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{f.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PicnicPage({
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

  const highlights = page?.info_items ?? [];
  const facts = page?.objectives ?? [];

  const gallery = page?.gallery ?? [];
  const GALLERY_STEP = 6;
  const [galleryStart, setGalleryStart] = useState(0);
  const galleryPage = gallery.slice(galleryStart, galleryStart + GALLERY_STEP);
  const canGalleryPrev = galleryStart > 0;
  const canGalleryNext = galleryStart + GALLERY_STEP < gallery.length;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const overviewParagraphs = overview.split(/\n{2,}/).filter(Boolean);

  const eventInfo = [
    { icon: Calendar, label: "Date", value: page?.event_date },
    { icon: Clock, label: "Time", value: page?.event_time },
    { icon: MapPin, label: "Venue", value: page?.venue },
  ].filter((f) => f.value);

  return (
    <>
      {/* Hero — boxed light card, image on the right */}
      <section className="pt-28 pb-10 md:pt-32 md:pb-14" style={{ background: "var(--color-surface-2)" }}>
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight size={12} className="opacity-60" />
            <Link to="/programs" className="transition-colors hover:text-foreground">
              Programs
            </Link>
            <ChevronRight size={12} className="opacity-60" />
            <span className="text-foreground">{title}</span>
          </nav>

          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p
                className="mb-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ borderColor: `color-mix(in oklab, ${ACCENT} 35%, var(--color-border))`, color: ACCENT }}
              >
                Together in Nature
              </p>
              <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-foreground md:text-5xl">
                {title.split(" ").slice(0, -1).join(" ")}{" "}
                <span style={{ color: ACCENT }}>{title.split(" ").slice(-1)}</span>
              </h1>
              {tagline && <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">{tagline}</p>}

              <HeroFacts eventDate={page?.event_date ?? ""} venue={page?.venue ?? ""} eligibility={page?.eligibility ?? ""} />

              {page?.register_label && (
                <a
                  href={page.register_url || "#"}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: ACCENT }}
                >
                  Stay Updated <ArrowRight size={15} />
                </a>
              )}
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-auto md:h-full md:min-h-[320px]">
              <img src={heroImage} alt={title} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
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
                          ? { background: ACCENT }
                          : { borderColor: `color-mix(in oklab, ${ACCENT} 30%, var(--color-border))` }
                      }
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* About the Picnic — text + 4 icon facts on the left, "Open to All" card on the right */}
          <div className="mb-16 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                About the Picnic
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Relax. Reconnect. Recharge.</h2>
              {overviewParagraphs.map((p, i) => (
                <p key={i} className="mt-4 text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}

              {facts.length > 0 && (
                <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                  {facts.map((f) => {
                    const FactIcon = ICONS[f.icon] ?? Sparkles;
                    return (
                      <div key={f.id} className="flex items-start gap-2">
                        <FactIcon size={16} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
                        <p className="text-xs font-semibold leading-snug text-foreground/80">{f.title}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl p-6" style={{ background: "var(--color-surface-2)" }}>
              <div className="grid h-14 w-14 place-items-center rounded-full" style={{ background: ACCENT }}>
                <Users size={24} className="text-white" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight">Open to All</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {page?.eligibility || "All PUSAB members, alumni, and their families are warmly invited."}
              </p>
              {page?.register_label && (
                <a
                  href={page.register_url || "#"}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: ACCENT }}
                >
                  {page.register_label} <ArrowRight size={15} />
                </a>
              )}
            </div>
          </div>

          {/* Picnic Highlights */}
          {highlights.length > 0 && (
            <div className="mb-16">
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                  What to Expect
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">Picnic Highlights</h2>
                <div className="mx-auto mt-3 h-1 w-14 rounded-full" style={{ background: ACCENT }} />
              </div>
              <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                {highlights.map((item) => {
                  const ItemIcon = ICONS[item.icon] ?? Sparkles;
                  return (
                    <div key={item.id} className="text-center">
                      <div
                        className="mx-auto grid h-14 w-14 place-items-center rounded-full"
                        style={{ background: "color-mix(in oklab, var(--color-accent-1) 10%, transparent)" }}
                      >
                        <ItemIcon size={22} style={{ color: ACCENT }} />
                      </div>
                      <p className="mt-3 text-sm font-bold leading-tight">{item.label}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gallery with prev/next arrows */}
          {gallery.length > 0 && (
            <div className="mb-16">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                    Glimpses From Past Picnics
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">Memories Worth Sharing</h2>
                </div>
                <button
                  onClick={() => setLightboxIndex(0)}
                  className="hidden shrink-0 rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground/80 transition-colors hover:text-foreground sm:inline-flex"
                >
                  View All Photos
                </button>
              </div>
              <div className="relative flex items-center gap-3">
                <button
                  onClick={() => setGalleryStart((s) => Math.max(0, s - GALLERY_STEP))}
                  disabled={!canGalleryPrev}
                  aria-label="Previous photos"
                  className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-[var(--color-surface)] text-foreground transition-colors disabled:opacity-30 sm:grid"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="grid flex-1 grid-cols-3 gap-2.5 sm:grid-cols-6">
                  {galleryPage.map((g, i) => (
                    <button
                      key={g.id}
                      onClick={() => setLightboxIndex(galleryStart + i)}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-border"
                    >
                      <img
                        src={optimizeImage(g.image_url, 320)}
                        alt={g.caption || title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {g.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2">
                          <p className="text-[10px] text-white leading-tight">{g.caption}</p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setGalleryStart((s) => (s + GALLERY_STEP < gallery.length ? s + GALLERY_STEP : s))}
                  disabled={!canGalleryNext}
                  aria-label="Next photos"
                  className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-[var(--color-surface)] text-foreground transition-colors disabled:opacity-30 sm:grid"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
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

          {/* Event info strip — light card, three columns */}
          {eventInfo.length > 0 && (
            <div className="mb-8 grid grid-cols-1 gap-6 rounded-2xl p-6 sm:grid-cols-3 sm:p-8" style={{ background: "var(--color-surface-2)" }}>
              {eventInfo.map((f) => (
                <div key={f.label} className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border" style={{ borderColor: `color-mix(in oklab, ${ACCENT} 35%, var(--color-border))` }}>
                    <f.icon size={18} style={{ color: ACCENT }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-tight">{f.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div
            className="flex flex-col items-center gap-5 rounded-2xl p-8 text-center sm:flex-row sm:justify-between sm:text-left"
            style={{ background: `linear-gradient(120deg, ${ACCENT}, ${ACCENT_2})` }}
          >
            <div className="text-white">
              <h3 className="font-display text-lg font-bold leading-tight">
                {page?.cta_title || "Let's make this picnic the best one yet!"}
              </h3>
              {page?.cta_subtitle && <p className="mt-1 text-sm text-white/85">{page.cta_subtitle}</p>}
            </div>
            {page?.register_label && (
              <a
                href={page.register_url || "#"}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold transition-opacity hover:opacity-90"
                style={{ color: ACCENT }}
              >
                {page.register_label} <ArrowRight size={15} />
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
