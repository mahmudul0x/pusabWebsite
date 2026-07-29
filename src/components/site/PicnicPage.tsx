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
  Gamepad2,
  Music,
  Utensils,
  Camera,
  Gift,
  Sparkles,
  Facebook,
  Image as ImageIcon,
  X,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { optimizeImage, type ProgramPage } from "@/lib/api";
import { SITE } from "@/lib/site-content";
import { GradientButton } from "./GradientButton";

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
const GRADIENT = `linear-gradient(120deg, ${ACCENT}, ${ACCENT_2})`;

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
  const GALLERY_INITIAL = 8;
  const [galleryVisible, setGalleryVisible] = useState(GALLERY_INITIAL);
  const visibleGallery = gallery.slice(0, galleryVisible);
  const galleryAllShown = galleryVisible >= gallery.length;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const overviewParagraphs = overview.split(/\n{2,}/).filter(Boolean);

  const eventInfo = [
    { icon: Calendar, label: "Date", value: page?.event_date },
    { icon: Clock, label: "Time", value: page?.event_time },
    { icon: MapPin, label: "Venue", value: page?.venue },
  ].filter((f) => f.value);

  const titleParts = title.split(" ");
  const splitAt = Math.ceil(titleParts.length / 2);

  const heroFacts = [
    page?.event_date ? { Icon: Calendar, label: "Date", value: page.event_date } : null,
    page?.venue ? { Icon: MapPin, label: "Venue", value: page.venue } : null,
    page?.eligibility ? { Icon: Users, label: "Who Can Join", value: page.eligibility } : null,
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
            <Sun size={13} style={{ color: ACCENT }} />
            Together in Nature
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

      <section className="pt-14 pb-0 md:pt-20">
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

          {/* About the Picnic — event-info panel with floating badge on the left, copy + checklist on the right */}
          <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div
                className="relative overflow-hidden rounded-3xl border border-border p-7 shadow-[0_40px_90px_-50px_rgba(15,23,42,0.35)] sm:p-8"
                style={{ background: "var(--color-surface-2)" }}
              >
                <div
                  className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full"
                  style={{ background: `color-mix(in oklab, ${ACCENT} 8%, transparent)` }}
                />
                <div
                  className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full"
                  style={{ background: `color-mix(in oklab, ${ACCENT_2} 7%, transparent)` }}
                />

                <p className="relative text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                  Event Details
                </p>

                <div className="relative mt-6 space-y-6">
                  {eventInfo.map((f) => (
                    <div key={f.label} className="flex items-start gap-4">
                      <div
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-sm"
                        style={{ background: GRADIENT }}
                      >
                        <f.icon size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">{f.label}</p>
                        <p className="mt-1 font-display text-lg font-bold leading-snug text-foreground">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                About the Picnic
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Relax. Reconnect. Recharge.</h2>
              <div className="mt-3 h-1 w-14 rounded-full" style={{ background: GRADIENT }} />
              {overviewParagraphs.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "mt-5 text-base leading-relaxed text-foreground/80"
                      : "mt-4 text-sm leading-relaxed text-muted-foreground"
                  }
                >
                  {p}
                </p>
              ))}

              {facts.length > 0 && (
                <ul className="mt-7 space-y-3">
                  {facts.map((f, i) => {
                    const FactIcon = ICONS[f.icon] ?? Sparkles;
                    return (
                      <motion.li
                        key={f.id}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
                        className="flex items-center gap-3"
                      >
                        <span
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                          style={{ background: `color-mix(in oklab, ${ACCENT} 10%, transparent)`, color: ACCENT }}
                        >
                          <FactIcon size={15} />
                        </span>
                        <span className="text-sm font-semibold text-foreground/85">{f.title}</span>
                      </motion.li>
                    );
                  })}
                </ul>
              )}

              {page?.register_label && page?.register_url && (
                <a
                  href={page.register_url}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
                  style={{ background: GRADIENT }}
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
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                  Glimpses From Past Picnics
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">Memories Worth Sharing</h2>
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
                    {galleryAllShown ? "Show less" : "Show more"}
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

          {/* CTA */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] p-10 text-center md:p-14">
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, ${ACCENT} 18%, transparent), transparent 50%), radial-gradient(circle at 70% 70%, color-mix(in oklab, ${ACCENT_2} 16%, transparent), transparent 50%)`,
              }}
            />
            <div className="relative">
              <h3 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
                {page?.cta_title || "Let's make this picnic the best one yet!"}
              </h3>
              {page?.cta_subtitle && (
                <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
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
                  <Facebook size={16} /> Join our Facebook Community
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
