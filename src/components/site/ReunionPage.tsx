import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Quote,
  Users,
  Mic,
  Camera,
  Award,
  Utensils,
  Gift,
  Heart,
  Music,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { optimizeImage, type ProgramPage } from "@/lib/api";

const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  users: Users,
  mic: Mic,
  camera: Camera,
  award: Award,
  utensils: Utensils,
  gift: Gift,
  calendar: Calendar,
  heart: Heart,
  music: Music,
  sparkles: Sparkles,
};

const ACCENT = "var(--color-accent-1)";
const ACCENT_2 = "var(--color-accent-2)";
const GRADIENT = `linear-gradient(120deg, ${ACCENT}, ${ACCENT_2})`;

function TestimonialCarousel({ testimonials }: { testimonials: ProgramPage["testimonials"] }) {
  const [start, setStart] = useState(0);
  const perPage = 3;
  const visible = testimonials.slice(start, start + perPage);
  const canPrev = start > 0;
  const canNext = start + perPage < testimonials.length;

  return (
    <div className="relative">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-[var(--color-surface)] p-6">
            <Quote size={20} style={{ color: ACCENT }} className="opacity-70" />
            <p className="mt-3 text-sm leading-relaxed italic text-foreground/90">{t.quote}</p>
            <div className="mt-4 flex items-center gap-3">
              {t.photo_url ? (
                <img src={optimizeImage(t.photo_url, 80)} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div
                  className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white"
                  style={{ background: GRADIENT }}
                >
                  {t.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{t.name}</p>
                {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {testimonials.length > perPage && (
        <>
          <button
            onClick={() => setStart((s) => Math.max(0, s - perPage))}
            disabled={!canPrev}
            aria-label="Previous testimonials"
            className="absolute left-0 top-1/2 hidden -translate-x-14 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full border border-border bg-[var(--color-surface)] text-foreground transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_40%,transparent)] disabled:opacity-30 sm:grid"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setStart((s) => (s + perPage < testimonials.length ? s + perPage : s))}
            disabled={!canNext}
            aria-label="Next testimonials"
            className="absolute right-0 top-1/2 hidden translate-x-14 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full border border-border bg-[var(--color-surface)] text-foreground transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_40%,transparent)] disabled:opacity-30 sm:grid"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}

export function ReunionPage({
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
  const heroImage = page?.hero_image_url ? optimizeImage(page.hero_image_url, 1600) : heroImageFallback;

  const gallery = page?.gallery ?? [];
  const GALLERY_PAGE_SIZE = 8;
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const visibleGallery = galleryExpanded ? gallery : gallery.slice(0, GALLERY_PAGE_SIZE);
  const remainingCount = gallery.length - visibleGallery.length;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      {/* Hero — a compact, wide banner (not full-viewport): scrim concentrated
          on the left where the text sits, photo clearly visible on the right. */}
      <section className="relative pt-28 pb-8 md:pt-32 md:pb-10 overflow-hidden h-[280px] md:h-[360px] flex items-end">
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
            <Users size={13} style={{ color: ACCENT }} />
            Celebration
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.04] max-w-2xl text-white">
            Annual{" "}
            <span style={{ backgroundImage: GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              Reunion
            </span>
          </h1>
          {tagline && (
            <p className="mt-3 max-w-md text-sm md:text-base leading-relaxed text-white/80">{tagline}</p>
          )}

          {/* Quick facts row */}
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm text-white/85">
            {page?.event_date && (
              <span className="inline-flex items-center gap-2">
                <Calendar size={14} style={{ color: ACCENT }} />
                {page.event_date}
              </span>
            )}
            {page?.venue && (
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} style={{ color: ACCENT }} />
                {page.venue}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <Users size={14} style={{ color: ACCENT }} />
              Open to All Members &amp; Alumni
            </span>
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
                          ? { background: GRADIENT }
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

          {/* Overview + Event info card */}
          <div className="mb-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                About this program
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                A Tradition That Brings Us Together
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">{overview}</p>
              {page?.schedule_note && (
                <p
                  className="mt-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs text-muted-foreground"
                  style={{ borderColor: `color-mix(in oklab, ${ACCENT} 25%, var(--color-border))` }}
                >
                  <Clock size={12} style={{ color: ACCENT }} /> {page.schedule_note}
                </p>
              )}
            </div>

            {(page?.event_date || page?.venue || page?.event_time || page?.register_label) && (
              <div className="rounded-2xl border border-border bg-[var(--color-surface)] p-6">
                <div className="space-y-4">
                  {page.event_date && (
                    <div className="flex items-start gap-3">
                      <Calendar size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold leading-tight">Date</p>
                        <p className="text-sm text-muted-foreground">{page.event_date}</p>
                      </div>
                    </div>
                  )}
                  {page.venue && (
                    <div className="flex items-start gap-3">
                      <MapPin size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold leading-tight">Venue</p>
                        <p className="text-sm text-muted-foreground">{page.venue}</p>
                      </div>
                    </div>
                  )}
                  {page.event_time && (
                    <div className="flex items-start gap-3">
                      <Clock size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold leading-tight">Time</p>
                        <p className="text-sm text-muted-foreground">{page.event_time}</p>
                      </div>
                    </div>
                  )}
                </div>
                {page.register_label && (
                  <a
                    href={page.register_url || "#"}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: GRADIENT }}
                  >
                    {page.register_label} <ArrowRight size={15} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Framing strip */}
          <div
            className="mb-12 flex items-center gap-6 overflow-hidden rounded-2xl p-6 sm:p-8"
            style={{ background: GRADIENT }}
          >
            {page?.stats[0] && (
              <p className="shrink-0 font-display text-4xl md:text-5xl font-extrabold text-white">
                {page.stats[0].value}
              </p>
            )}
            <p className="text-sm leading-relaxed text-white/90">
              Once every year, PUSAB members from every batch and every university find their way
              back to Bishwambarpur for one evening — old friends, familiar faces, and a room full
              of people who grew up in the same place. It's the one night the whole family shows
              up, and the photos from that night are what everyone remembers it by.
            </p>
          </div>

          {/* Stats row */}
          {page && page.stats.length > 0 && (
            <div className="mb-14 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-[var(--color-surface)] p-4 sm:grid-cols-4 sm:p-6">
              {page.stats.map((s) => (
                <div key={s.id} className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-extrabold" style={{ color: ACCENT }}>
                    {s.value}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Highlights */}
          {page && page.objectives.length > 0 && (
            <div className="mb-14 text-center">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                What to expect
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Reunion Highlights</h2>
              <div className="mx-auto mt-2 h-1 w-14 rounded-full" style={{ background: GRADIENT }} />
              <div className="mt-10 grid gap-8 sm:grid-cols-3 lg:grid-cols-6">
                {page.objectives.map((o) => {
                  const HighlightIcon = HIGHLIGHT_ICONS[o.icon] ?? Sparkles;
                  return (
                    <div key={o.id} className="flex flex-col items-center text-center">
                      <div
                        className="grid h-16 w-16 place-items-center rounded-full"
                        style={{ background: `color-mix(in oklab, ${ACCENT} 12%, transparent)` }}
                      >
                        {o.image_url ? (
                          <img src={optimizeImage(o.image_url, 120)} alt={o.title} className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <HighlightIcon size={24} style={{ color: ACCENT }} />
                        )}
                      </div>
                      <h3 className="mt-4 text-sm font-semibold leading-tight">{o.title}</h3>
                      {o.description && (
                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{o.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="mb-14">
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                  Gallery
                </p>
                <h2 className="mt-1 font-display text-2xl md:text-3xl font-bold tracking-tight">
                  Moments from Previous Reunions
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {visibleGallery.map((g, i) => (
                  <button
                    key={g.id}
                    onClick={() => setLightboxIndex(i)}
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
              {remainingCount > 0 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setGalleryExpanded(true)}
                    className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground"
                    style={{ borderColor: `color-mix(in oklab, ${ACCENT} 30%, var(--color-border))` }}
                  >
                    View more ({remainingCount} more photo{remainingCount === 1 ? "" : "s"})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxIndex !== null && visibleGallery[lightboxIndex] && (
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
                    src={optimizeImage(visibleGallery[lightboxIndex].image_url, 1600)}
                    alt={visibleGallery[lightboxIndex].caption || title}
                    className="max-h-[80vh] max-w-full rounded-2xl border border-white/10 object-contain"
                  />
                  {visibleGallery[lightboxIndex].caption && (
                    <p className="mt-4 text-center text-sm text-white/85">
                      {visibleGallery[lightboxIndex].caption}
                    </p>
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
                {lightboxIndex < visibleGallery.length - 1 && (
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

          {/* Testimonials */}
          {page && page.testimonials.length > 0 && (
            <div className="mb-14 text-center">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                Memories that last
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Voices from Our Members</h2>
              <div className="mt-10 text-left">
                <TestimonialCarousel testimonials={page.testimonials} />
              </div>
            </div>
          )}

          {/* CTA */}
          {(page?.cta_title || page?.register_label) && (
            <div
              className="flex flex-col items-center gap-5 rounded-2xl p-8 text-center sm:flex-row sm:justify-between sm:text-left"
              style={{ background: GRADIENT }}
            >
              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                  <Calendar size={18} />
                </div>
                <div className="text-white">
                  <h3 className="font-display text-lg font-bold leading-tight">
                    {page?.cta_title || "Be Part of the Tradition"}
                  </h3>
                  {page?.cta_subtitle && <p className="mt-1 text-sm text-white/85">{page.cta_subtitle}</p>}
                </div>
              </div>
              {page?.register_label && (
                <a
                  href={page.register_url || "#"}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold transition-opacity hover:opacity-90"
                  style={{ color: ACCENT }}
                >
                  Register Now <ArrowRight size={15} />
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
