import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  ArrowRight,
  Users,
  Heart,
  Sparkles,
  Utensils,
  Gift,
  GraduationCap,
  Globe2,
  HeartHandshake,
  X,
  type LucideIcon,
} from "lucide-react";
import { optimizeImage, type ProgramPage } from "@/lib/api";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  heart: Heart,
  sparkles: Sparkles,
  utensils: Utensils,
  gift: Gift,
  "graduation-cap": GraduationCap,
};

// This page's palette matches its reference design 1:1 — deep green + cream
// — rather than the site's usual blue accent tokens, following the same
// deliberate-match precedent used for the Scholarship page.
const GREEN = "#1F4D2E";
const GREEN_2 = "#0F3320";
const GOLD = "#D9A441";
const CREAM = "#F7F3E8";

const MISSION_ICONS = [Users, HeartHandshake, Globe2, Sparkles];

function HeroFacts({ objectives }: { objectives: ProgramPage["objectives"] }) {
  if (objectives.length === 0) return null;
  return (
    <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {objectives.slice(0, 3).map((o) => {
        const ObjIcon = ICONS[o.icon] ?? Sparkles;
        return (
          <div key={o.id} className="flex items-start gap-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: "color-mix(in oklab, #1F4D2E 10%, transparent)" }}>
              <ObjIcon size={15} style={{ color: GREEN }} />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight text-[#12251a]">{o.title}</p>
              {o.description && <p className="mt-1 text-[11px] leading-snug text-[#12251a]/60">{o.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HumanityPage({
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

  const allStats = page?.stats ?? [];
  const missionStats = allStats.slice(0, 4);
  const impactStats = allStats.length > 4 ? allStats.slice(4) : allStats;
  const initiatives = page?.info_items ?? [];

  const gallery = page?.gallery ?? [];
  const GALLERY_STEP = 5;
  const [galleryStart, setGalleryStart] = useState(0);
  const galleryPage = gallery.slice(galleryStart, galleryStart + GALLERY_STEP);
  const canGalleryPrev = galleryStart > 0;
  const canGalleryNext = galleryStart + GALLERY_STEP < gallery.length;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const overviewParagraphs = overview.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      {/* Hero — boxed cream card, image on the right */}
      <section className="pt-28 pb-10 md:pt-32 md:pb-14" style={{ background: CREAM }}>
        <div className="container-page">
          <nav className="mb-6 flex items-center gap-2 text-xs text-[#12251a]/60">
            <Link to="/" className="transition-colors hover:text-[#12251a]">
              Home
            </Link>
            <ChevronRight size={12} className="opacity-60" />
            <Link to="/programs" className="transition-colors hover:text-[#12251a]">
              Programs
            </Link>
            <ChevronRight size={12} className="opacity-60" />
            <span className="text-[#12251a]">{title}</span>
          </nav>

          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GREEN }}>
                <HeartHandshake size={13} /> Compassion in Action
              </p>
              <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-[#12251a] md:text-5xl">
                {title.split(" ").slice(0, -1).join(" ")}{" "}
                <span style={{ color: GREEN }}>{title.split(" ").slice(-1)}</span>
              </h1>
              {tagline && <p className="mt-5 max-w-md text-sm leading-relaxed text-[#12251a]/70 md:text-base">{tagline}</p>}

              <HeroFacts objectives={page?.objectives ?? []} />
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-auto md:h-full md:min-h-[320px]">
              <img src={heroImage} alt={title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(120deg, ${GREEN}, ${GREEN_2})`, clipPath: "polygon(0 100%, 100% 40%, 100% 100%)" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-page">
          {/* Year switcher */}
          {years.length > 1 && page && (
            <div className="mb-10">
              <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GREEN }}>
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
                          ? { background: `linear-gradient(120deg, ${GREEN}, ${GREEN_2})` }
                          : { borderColor: `color-mix(in oklab, ${GREEN} 30%, var(--color-border))` }
                      }
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Our Mission — text + button on the left, 4-stat card on the right */}
          <div className="mb-14 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GREEN }}>
                Our Mission
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Humanity is Our Purpose</h2>
              {overviewParagraphs.map((p, i) => (
                <p key={i} className="mt-4 text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
              {page?.register_label && (
                <a
                  href={page.register_url || "#"}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: `linear-gradient(120deg, ${GREEN}, ${GREEN_2})` }}
                >
                  {page.register_label} <ArrowRight size={15} />
                </a>
              )}
            </div>

            {missionStats.length > 0 && (
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
                {missionStats.map((s, i) => {
                  const StatIcon = MISSION_ICONS[i % MISSION_ICONS.length];
                  return (
                    <div key={s.id} className="bg-[var(--color-surface)] p-5 text-center">
                      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full" style={{ background: "color-mix(in oklab, #1F4D2E 10%, transparent)" }}>
                        <StatIcon size={18} style={{ color: GREEN }} />
                      </div>
                      <p className="mt-3 font-display text-2xl font-extrabold" style={{ color: GREEN }}>
                        {s.value}
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Our Initiatives */}
          {initiatives.length > 0 && (
            <div className="mb-14">
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GREEN }}>
                  What We Do
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">Our Initiatives</h2>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {initiatives.map((item) => {
                  const ItemIcon = ICONS[item.icon] ?? Sparkles;
                  return (
                    <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
                      <div className="relative aspect-[4/3]">
                        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, color-mix(in oklab, ${GREEN} 20%, transparent), transparent)` }} />
                        <div
                          className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full text-white shadow-sm"
                          style={{ background: `linear-gradient(120deg, ${GREEN}, ${GREEN_2})` }}
                        >
                          <ItemIcon size={16} />
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-bold leading-tight">{item.label}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {page?.register_label && (
                <div className="mt-8 flex justify-center">
                  <a
                    href={page.register_url || "#"}
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors hover:text-foreground"
                    style={{ borderColor: `color-mix(in oklab, ${GREEN} 35%, var(--color-border))`, color: GREEN }}
                  >
                    View All Initiatives <ArrowRight size={14} />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Our Impact So Far — dark green banner */}
          {impactStats.length > 0 && (
            <div className="mb-14 overflow-hidden rounded-2xl" style={{ background: `linear-gradient(120deg, ${GREEN}, ${GREEN_2})` }}>
              <p className="pt-6 text-center text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                Our Impact So Far
              </p>
              <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-5 sm:p-8">
                {impactStats.map((s) => (
                  <div key={s.id} className="text-center">
                    <p className="font-display text-2xl font-extrabold text-white md:text-3xl">{s.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-white/70">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery with prev/next arrows */}
          {gallery.length > 0 && (
            <div className="mb-14">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GREEN }}>
                    Moments That Matter
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">Humanity in Action</h2>
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

          {/* CTA — dark green banner */}
          <div
            className="flex flex-col items-center gap-5 rounded-2xl p-8 text-center sm:flex-row sm:justify-between sm:text-left"
            style={{ background: "var(--color-surface-2)" }}
          >
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full" style={{ background: `color-mix(in oklab, ${GREEN} 15%, transparent)`, color: GREEN }}>
                <Heart size={20} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold leading-tight">
                  {page?.cta_title || "Be a Part of the Change"}
                </h3>
                {page?.cta_subtitle && <p className="mt-1 text-sm text-muted-foreground">{page.cta_subtitle}</p>}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <a
                href="/support"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: `linear-gradient(120deg, ${GREEN}, ${GREEN_2})` }}
              >
                Get Involved
              </a>
              <a
                href="/support"
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition-colors hover:bg-[var(--color-background)]"
                style={{ borderColor: `color-mix(in oklab, ${GREEN} 35%, var(--color-border))`, color: GREEN }}
              >
                Contribute Now <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
