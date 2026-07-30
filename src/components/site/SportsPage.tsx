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
  Users,
  ArrowRight,
  Trophy,
  Medal,
  Target,
  Flag,
  Zap,
  HeartPulse,
  Sparkles,
  Facebook,
  Image as ImageIcon,
  X,
  type LucideIcon,
} from "lucide-react";
import { optimizeImage, type ProgramPage } from "@/lib/api";
import { SITE } from "@/lib/site-content";
import { GradientButton } from "./GradientButton";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  target: Target,
  award: Trophy,
  heart: HeartPulse,
  sparkles: Sparkles,
  calendar: Calendar,
  "map-pin": MapPin,
  gift: Medal,
  music: Flag,
  camera: ImageIcon,
  mic: Zap,
  utensils: Medal,
  "graduation-cap": Trophy,
};

const ACCENT = "var(--color-accent-1)";
const ACCENT_2 = "var(--color-accent-2)";
const GRADIENT = `linear-gradient(120deg, ${ACCENT}, ${ACCENT_2})`;

/** Shown when the dashboard hasn't filled in highlights for this edition yet. */
const FALLBACK_HIGHLIGHTS = [
  { icon: "award", title: "Tournaments", description: "Football and cricket played across the season." },
  { icon: "users", title: "Open to All", description: "Every member is welcome, whatever their level." },
  { icon: "heart", title: "Fitness First", description: "Staying active together, on and off the field." },
  { icon: "sparkles", title: "Team Spirit", description: "Friendly rivalry that ends in a shared meal." },
];

export function SportsPage({
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
  heroImageFallback?: string;
  years: number[];
  currentYear: number;
  loadingYear: boolean;
  onSwitchYear: (y: number) => void;
}) {
  const title = page?.title || fallbackTitle;
  const tagline = page?.tagline || fallbackDesc;
  const overview = page?.overview || fallbackDesc;
  const heroImage = page?.hero_image_url
    ? optimizeImage(page.hero_image_url, 1200)
    : heroImageFallback;

  const stats = page?.stats ?? [];
  const facts = page?.info_items ?? [];
  const highlights = page?.objectives ?? [];
  const gallery = page?.gallery ?? [];
  const testimonials = page?.testimonials ?? [];

  const GALLERY_INITIAL = 8;
  const [galleryVisible, setGalleryVisible] = useState(GALLERY_INITIAL);
  const visibleGallery = gallery.slice(0, galleryVisible);
  const galleryAllShown = galleryVisible >= gallery.length;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const overviewParagraphs = overview.split(/\n{2,}/).filter(Boolean);

  const eventInfo = [
    { Icon: Calendar, label: "Date", value: page?.event_date },
    { Icon: MapPin, label: "Venue", value: page?.venue },
    { Icon: Clock, label: "Time", value: page?.event_time },
  ].filter((r) => r.value);

  // Fall back to a sensible set so the section never renders empty.
  const shownHighlights =
    highlights.length > 0
      ? highlights.map((h) => ({
          icon: h.icon,
          title: h.title,
          description: h.description,
        }))
      : FALLBACK_HIGHLIGHTS;

  const closeLightbox = () => setLightboxIndex(null);
  const stepLightbox = (delta: number) =>
    setLightboxIndex((i) => (i === null ? i : (i + delta + gallery.length) % gallery.length));

  return (
    <div className="pb-20">
      {/* ── Hero: a floodlit-pitch feel, dark so the type carries ── */}
      <section className="relative min-h-[62vh] w-full overflow-hidden bg-slate-950">
        {/* No photo yet? The dark base + gradients below still read fine. */}
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
        {/* Pitch-marking arc, purely decorative. */}
        <div
          className="pointer-events-none absolute -right-24 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 rounded-full border md:block"
          style={{ borderColor: `color-mix(in oklab, ${ACCENT} 30%, transparent)` }}
        />

        <div className="container-page relative z-10 flex min-h-[62vh] flex-col justify-end pb-14 pt-36">
          <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-white/70">
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link to="/programs" className="transition-colors hover:text-white">
              Programs
            </Link>
            <ChevronRight size={12} />
            <span className="text-white">{title}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white"
              style={{ background: GRADIENT }}
            >
              <Trophy size={13} /> Sports
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-7xl">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base font-medium text-white/85 md:text-lg">{tagline}</p>

            {page?.register_label && page?.register_url && (
              <a
                href={page.register_url}
                className="mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
                style={{ background: GRADIENT }}
              >
                {page.register_label} <ArrowRight size={15} />
              </a>
            )}
          </motion.div>

          {/* Year switcher, shown once more than one edition exists. */}
          {years.length > 1 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                Edition
              </span>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => onSwitchYear(y)}
                  disabled={loadingYear}
                  className={
                    "rounded-lg px-3 py-1.5 text-sm font-bold transition-all disabled:opacity-50 " +
                    (y === currentYear
                      ? "text-white"
                      : "border border-white/20 text-white/70 hover:border-white/40 hover:text-white")
                  }
                  style={y === currentYear ? { background: GRADIENT } : undefined}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Scoreboard strip ── */}
      {stats.length > 0 && (
        <section className="relative z-10 -mt-8 px-4">
          <div className="container-page">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-lg sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.id} className="bg-[var(--color-surface)] px-4 py-6 text-center">
                  <p
                    className="font-display text-2xl font-extrabold tabular-nums md:text-4xl"
                    style={{ color: ACCENT }}
                  >
                    {s.value}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Overview + at-a-glance facts ── */}
      <section className="py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p
              className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: ACCENT }}
            >
              About the program
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              More than a game
            </h2>
            <div className="mt-5 space-y-4">
              {overviewParagraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {p}
                </p>
              ))}
            </div>

            {page?.schedule_note && (
              <p
                className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold"
                style={{ borderColor: `color-mix(in oklab, ${ACCENT} 25%, var(--color-border))` }}
              >
                <Clock size={12} style={{ color: ACCENT }} /> {page.schedule_note}
              </p>
            )}
          </div>

          {/* Event card */}
          {(eventInfo.length > 0 || facts.length > 0) && (
            <div className="rounded-2xl border border-border bg-[var(--color-surface)] p-6">
              {eventInfo.length > 0 && (
                <div className="space-y-4">
                  {eventInfo.map(({ Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold leading-tight">{label}</p>
                        <p className="text-sm text-muted-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {facts.length > 0 && (
                <div
                  className={
                    "space-y-4 " + (eventInfo.length > 0 ? "mt-5 border-t border-border pt-5" : "")
                  }
                >
                  {facts.map((f) => {
                    const Icon = ICONS[f.icon] ?? Flag;
                    return (
                      <div key={f.id} className="flex items-start gap-3">
                        <Icon size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold leading-tight">{f.label}</p>
                          <p className="text-sm text-muted-foreground">{f.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="pb-16 md:pb-20">
        <div className="container-page">
          <div className="text-center">
            <p
              className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: ACCENT }}
            >
              What to expect
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              On the field
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shownHighlights.map((h, i) => {
              const Icon = ICONS[h.icon ?? ""] ?? Trophy;
              return (
                <motion.div
                  key={h.title + i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] p-6 transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]"
                >
                  {/* Jersey-number style index, faint in the corner. */}
                  <span className="pointer-events-none absolute -right-2 -top-4 font-display text-6xl font-extrabold text-foreground/[0.04]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="relative grid h-11 w-11 place-items-center rounded-xl"
                    style={{ background: `color-mix(in oklab, ${ACCENT} 12%, transparent)` }}
                  >
                    <Icon size={20} style={{ color: ACCENT }} />
                  </div>
                  <h3 className="relative mt-4 font-display text-base font-bold">{h.title}</h3>
                  {h.description && (
                    <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {h.description}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      {gallery.length > 0 && (
        <section className="pb-16 md:pb-20">
          <div className="container-page">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p
                  className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: ACCENT }}
                >
                  Moments
                </p>
                <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  From the ground
                </h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {gallery.length} photo{gallery.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleGallery.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-border"
                >
                  <img
                    src={optimizeImage(g.image_url, 500)}
                    alt={g.caption || `${title} photo ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {g.caption && (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2.5 text-left text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {g.caption}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {!galleryAllShown && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setGalleryVisible((v) => v + GALLERY_INITIAL)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]"
                >
                  Show more <ChevronDown size={15} />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Voices ── */}
      {testimonials.length > 0 && (
        <section className="pb-16 md:pb-20">
          <div className="container-page">
            <div className="text-center">
              <p
                className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: ACCENT }}
              >
                Voices
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                From the players
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <figure
                  key={t.id}
                  className="rounded-2xl border border-border bg-[var(--color-surface)] p-6"
                >
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    {t.photo_url ? (
                      <img
                        src={optimizeImage(t.photo_url, 96)}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white"
                        style={{ background: GRADIENT }}
                      >
                        {t.name.charAt(0)}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold leading-tight">{t.name}</p>
                      {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {(page?.cta_title || page?.register_label) && (
        <section className="px-4">
          <div className="container-page">
            <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-10 text-center md:p-14">
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  background: `radial-gradient(circle at 25% 25%, color-mix(in oklab, ${ACCENT} 30%, transparent), transparent 55%), radial-gradient(circle at 75% 75%, color-mix(in oklab, ${ACCENT_2} 26%, transparent), transparent 55%)`,
                }}
              />
              <div className="relative">
                <h3 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
                  {page?.cta_title || "Get in the game"}
                </h3>
                {page?.cta_subtitle && (
                  <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 md:text-base">
                    {page.cta_subtitle}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  {page?.register_label && page?.register_url && (
                    <GradientButton href={page.register_url}>
                      {page.register_label} <ArrowRight size={15} />
                    </GradientButton>
                  )}
                  {gallery.length > 0 && (
                    <GradientButton onClick={() => setLightboxIndex(0)} variant="ghost">
                      <ImageIcon size={16} /> View Gallery
                    </GradientButton>
                  )}
                  <GradientButton href={SITE.facebook} target="_blank" variant="ghost">
                    <Facebook size={16} /> Follow updates
                  </GradientButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && gallery[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/92 p-4 backdrop-blur-sm"
          >
            <button
              onClick={closeLightbox}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            >
              <X size={18} />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    stepLightbox(-1);
                  }}
                  aria-label="Previous photo"
                  className="absolute left-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 md:left-8"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    stepLightbox(1);
                  }}
                  aria-label="Next photo"
                  className="absolute right-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 md:right-8"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <figure onClick={(e) => e.stopPropagation()} className="max-h-full max-w-4xl">
              <img
                src={optimizeImage(gallery[lightboxIndex].image_url, 1400)}
                alt={gallery[lightboxIndex].caption || ""}
                className="max-h-[80vh] w-auto rounded-xl object-contain"
              />
              {gallery[lightboxIndex].caption && (
                <figcaption className="mt-3 text-center text-sm text-white/75">
                  {gallery[lightboxIndex].caption}
                </figcaption>
              )}
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
