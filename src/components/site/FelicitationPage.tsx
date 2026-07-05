import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  ArrowRight,
  Users,
  Award,
  Star,
  Camera,
  Sparkles,
  Heart,
  Mic,
  Music,
  PartyPopper,
  ClipboardList,
  Utensils,
  X,
  type LucideIcon,
} from "lucide-react";
import { optimizeImage, type ProgramPage } from "@/lib/api";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  users: Users,
  award: Award,
  sparkles: Sparkles,
  heart: Heart,
  camera: Camera,
  mic: Mic,
  music: Music,
  calendar: Calendar,
  "map-pin": MapPin,
};

// Deep green + gold — this page's own palette, distinct from the site's
// usual blue accent, matching its reference design by deliberate request.
const GREEN = "#0F2E24";
const GREEN_2 = "#173D30";
const GOLD = "#D9A441";
const GOLD_GRADIENT = `linear-gradient(120deg, ${GOLD}, #C4872B)`;

const SCHEDULE = [
  { time: "03:00 PM – 03:30 PM", title: "Registration & Meet Up", desc: "Check-in and meet fellow members.", icon: ClipboardList },
  { time: "03:30 PM – 04:30 PM", title: "Felicitation Ceremony", desc: "Honoring our achievers and contributors.", icon: Award },
  { time: "04:30 PM – 05:30 PM", title: "Freshers Reception", desc: "Welcoming our new members.", icon: Users },
  { time: "05:30 PM – 06:30 PM", title: "Cultural Program", desc: "Enjoy performances and entertainment.", icon: Utensils },
  { time: "06:30 PM Onwards", title: "Networking & Refreshments", desc: "Connect, interact and enjoy together.", icon: Utensils },
];

export function FelicitationPage({
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
  const heroImage = page?.hero_image_url ? optimizeImage(page.hero_image_url, 1200) : heroImageFallback;

  const gallery = page?.gallery ?? [];
  const GALLERY_STEP = 5;
  const [galleryStart, setGalleryStart] = useState(0);
  const galleryPage = gallery.slice(galleryStart, galleryStart + GALLERY_STEP);
  const canGalleryPrev = galleryStart > 0;
  const canGalleryNext = galleryStart + GALLERY_STEP < gallery.length;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const features = page?.objectives ?? [];
  const expectCards = page?.info_items ?? [];

  const titleParts = title.split(" ");
  const splitAt = Math.ceil(titleParts.length / 2);

  return (
    <>
      {/* Hero — boxed dark-green card with a diagonal gold-edge split */}
      <section className="pt-28 pb-10 md:pt-32 md:pb-0" style={{ background: GREEN }}>
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-white/60">
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
        </div>

        <div className="relative overflow-hidden md:grid md:grid-cols-2 md:items-stretch">
          <div className="container-page md:mx-0 md:max-w-none py-8 md:py-16 md:pr-12 lg:pr-20">
            <p
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: GOLD }}
            >
              Celebrating Achievements. Welcoming New Journeys.
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-white md:text-5xl">
              {titleParts.slice(0, splitAt).join(" ")}
              {" "}
              <span style={{ color: GOLD }}>{titleParts.slice(splitAt).join(" ")}</span>
            </h1>
            <div className="mt-4 h-1 w-14 rounded-full" style={{ background: GOLD_GRADIENT }} />
            {tagline && (
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75 md:text-base">
                {tagline}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {page?.event_date && (
                <div
                  className="flex items-center gap-2.5 rounded-xl border px-4 py-2.5"
                  style={{ borderColor: "color-mix(in oklab, #D9A441 30%, transparent)" }}
                >
                  <Calendar size={16} style={{ color: GOLD }} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-white/60">Date</p>
                    <p className="text-xs font-semibold text-white">{page.event_date}</p>
                  </div>
                </div>
              )}
              {page?.venue && (
                <div
                  className="flex items-center gap-2.5 rounded-xl border px-4 py-2.5"
                  style={{ borderColor: "color-mix(in oklab, #D9A441 30%, transparent)" }}
                >
                  <MapPin size={16} style={{ color: GOLD }} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-white/60">Venue</p>
                    <p className="text-xs font-semibold text-white">{page.venue}</p>
                  </div>
                </div>
              )}
              <div
                className="flex items-center gap-2.5 rounded-xl border px-4 py-2.5"
                style={{ borderColor: "color-mix(in oklab, #D9A441 30%, transparent)" }}
              >
                <Users size={16} style={{ color: GOLD }} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/60">Who Can Join</p>
                  <p className="text-xs font-semibold text-white">All PUSAB members, alumni &amp; new students</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[280px] md:h-auto">
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                clipPath: "polygon(6% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <img src={heroImage} alt={title} className="h-full w-full object-cover" />
            </div>
            <img src={heroImage} alt={title} className="absolute inset-0 h-full w-full object-cover md:hidden" />
            <div
              className="absolute inset-y-0 left-0 hidden w-2 md:block"
              style={{ background: GOLD, clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            />
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-page">
          {/* Year switcher */}
          {years.length > 1 && page && (
            <div className="mb-10">
              <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
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
                          ? { background: GOLD_GRADIENT }
                          : { borderColor: "color-mix(in oklab, #D9A441 30%, var(--color-border))" }
                      }
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feature row */}
          {features.length > 0 && (
            <div className="mb-14 rounded-2xl border border-border bg-[var(--color-surface)] p-6 md:p-8">
              <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                {features.map((f) => {
                  const FeatureIcon = FEATURE_ICONS[f.icon] ?? Star;
                  return (
                    <div key={f.id} className="flex flex-col items-start gap-2">
                      <FeatureIcon size={26} style={{ color: GOLD }} />
                      <p className="text-sm font-bold leading-tight">{f.title}</p>
                      {f.description && (
                        <p className="text-xs leading-snug text-muted-foreground">{f.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Schedule + What to Expect */}
          <div className="mb-14 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-[var(--color-surface-2)] p-6 md:p-8">
              <span
                className="inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
                style={{ background: GREEN }}
              >
                Event Schedule (Tentative)
              </span>
              <div className="mt-8 space-y-0">
                {SCHEDULE.map((s, i) => (
                  <div key={s.title} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < SCHEDULE.length - 1 && (
                      <div
                        className="absolute left-[19px] top-10 bottom-0 w-px"
                        style={{ background: "color-mix(in oklab, var(--color-accent-1) 25%, transparent)" }}
                      />
                    )}
                    <div
                      className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full text-white"
                      style={{ background: GREEN }}
                    >
                      <s.icon size={16} />
                    </div>
                    <div className="min-w-0 pt-1">
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--color-accent-1)" }}>
                        {s.time}
                      </p>
                      <p className="mt-1 text-sm font-bold leading-tight">{s.title}</p>
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--color-surface-2)] p-6 md:p-8">
              <span
                className="inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
                style={{ background: GOLD_GRADIENT }}
              >
                What to Expect
              </span>
              {expectCards.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
                  {expectCards.map((item) => {
                    const ItemIcon = FEATURE_ICONS[item.icon] ?? Sparkles;
                    return (
                      <div key={item.id}>
                        <ItemIcon size={24} style={{ color: GREEN }} />
                        <p className="mt-2.5 text-sm font-bold leading-tight">{item.label}</p>
                        <p className="mt-1 text-xs leading-snug text-muted-foreground">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Gallery with prev/next arrows */}
          {gallery.length > 0 && (
            <div className="mb-14">
              <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                Glimpses from Past Events
              </p>
              <div className="relative flex items-center gap-3">
                <button
                  onClick={() => setGalleryStart((s) => Math.max(0, s - GALLERY_STEP))}
                  disabled={!canGalleryPrev}
                  aria-label="Previous photos"
                  className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-[var(--color-surface)] text-foreground transition-colors disabled:opacity-30 sm:grid"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-5">
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

          {/* CTA */}
          <div
            className="flex flex-col items-center gap-5 rounded-2xl p-8 text-center sm:flex-row sm:justify-between sm:text-left"
            style={{ background: `linear-gradient(120deg, ${GREEN}, ${GREEN_2})` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                style={{ background: "color-mix(in oklab, #D9A441 20%, transparent)", color: GOLD }}
              >
                <PartyPopper size={20} />
              </div>
              <div className="text-white">
                <h3 className="font-display text-lg font-bold leading-tight">
                  {page?.cta_title || "Be a Part of This Special Day!"}
                </h3>
                {page?.cta_subtitle && <p className="mt-1 text-sm text-white/75">{page.cta_subtitle}</p>}
              </div>
            </div>
            {page?.register_label && (
              <a
                href={page.register_url || "#"}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-[#1a1a1a] transition-opacity hover:opacity-90"
                style={{ background: GOLD_GRADIENT }}
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
