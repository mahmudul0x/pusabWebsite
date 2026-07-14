import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
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
  ZoomIn,
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

const ACCENT = "var(--color-accent-1)";
const ACCENT_2 = "var(--color-accent-2)";
const GRADIENT = `linear-gradient(120deg, ${ACCENT}, ${ACCENT_2})`;

const MISSION_ICONS = [Users, HeartHandshake, Globe2, Sparkles];

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
  const GALLERY_INITIAL = 8;
  const [galleryVisible, setGalleryVisible] = useState(GALLERY_INITIAL);
  const visibleGallery = gallery.slice(0, galleryVisible);
  const galleryAllShown = galleryVisible >= gallery.length;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const overviewParagraphs = overview.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      {/* Hero — full-cover photo header (site's standard full-photo hero pattern) */}
      <section className="relative flex h-[400px] items-end overflow-hidden pt-28 pb-10 md:h-[480px] md:pt-32 md:pb-14">
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
            <HeartHandshake size={13} style={{ color: ACCENT }} />
            Compassion in Action
          </div>

          <h1 className="max-w-2xl font-display text-3xl font-extrabold leading-[1.04] tracking-[-0.03em] text-white md:text-5xl">
            {title.split(" ").slice(0, -1).join(" ")}{" "}
            <span style={{ color: ACCENT }}>{title.split(" ").slice(-1)}</span>
          </h1>
          {tagline && <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">{tagline}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={page?.register_url || "/support"}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: GRADIENT }}
            >
              {page?.register_label || "Get Involved"} <ArrowRight size={15} />
            </a>
            <a
              href="/support"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Contribute Now
            </a>
          </div>

          {(page?.objectives ?? []).length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-white/85 md:text-sm">
              {(page?.objectives ?? []).slice(0, 3).map((o) => {
                const ObjIcon = ICONS[o.icon] ?? Sparkles;
                return (
                  <span key={o.id} className="inline-flex items-center gap-2">
                    <ObjIcon size={14} style={{ color: ACCENT }} />
                    {o.title}
                  </span>
                );
              })}
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

          {/* Our Mission — text left, elevated stat cards right */}
          <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-center">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                Our Mission
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Humanity is Our Purpose</h2>
              <div className="mt-2 h-1 w-14 rounded-full" style={{ background: GRADIENT }} />
              {overviewParagraphs.map((p, i) => (
                <p key={i} className="mt-4 text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
              {page?.register_label && (
                <a
                  href={page.register_url || "#"}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: GRADIENT }}
                >
                  {page.register_label} <ArrowRight size={15} />
                </a>
              )}
            </div>

            {missionStats.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {missionStats.map((s, i) => {
                  const StatIcon = MISSION_ICONS[i % MISSION_ICONS.length];
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
                      className="rounded-2xl border border-border bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div
                        className="grid h-10 w-10 place-items-center rounded-xl"
                        style={{ background: `color-mix(in oklab, ${ACCENT} 10%, transparent)`, color: ACCENT }}
                      >
                        <StatIcon size={17} />
                      </div>
                      <p className="mt-3 font-display text-3xl font-extrabold bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>
                        {s.value}
                      </p>
                      <p className="mt-1 text-xs leading-snug text-muted-foreground">{s.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Our Initiatives — numbered cards with reveal accent line */}
          {initiatives.length > 0 && (
            <div className="mb-16">
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                  What We Do
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">Our Initiatives</h2>
                <div className="mx-auto mt-2 h-1 w-14 rounded-full" style={{ background: GRADIENT }} />
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {initiatives.map((item, idx) => {
                  const ItemIcon = ICONS[item.icon] ?? Sparkles;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: (idx % 5) * 0.07, ease: "easeOut" }}
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
              {page?.register_label && (
                <div className="mt-8 flex justify-center">
                  <a
                    href={page.register_url || "#"}
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors hover:text-foreground"
                    style={{ borderColor: `color-mix(in oklab, ${ACCENT} 35%, var(--color-border))`, color: ACCENT }}
                  >
                    View All Initiatives <ArrowRight size={14} />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Our Impact So Far — gradient banner with decorative rings */}
          {impactStats.length > 0 && (
            <div className="relative mb-16 overflow-hidden rounded-3xl" style={{ background: GRADIENT }}>
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-white/[0.07]" />
              <div className="pointer-events-none absolute right-24 bottom-6 h-16 w-16 rounded-full border-2 border-white/15" />
              <p className="relative pt-8 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
                Our Impact So Far
              </p>
              <div className="relative grid grid-cols-2 gap-6 p-8 sm:grid-cols-5 sm:p-10">
                {impactStats.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
                    className="text-center"
                  >
                    <p className="font-display text-3xl font-extrabold text-white md:text-4xl">{s.value}</p>
                    <p className="mt-1.5 text-[11px] uppercase tracking-[0.1em] text-white/75">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery — 4-up grid, 8 photos initially, show-more below */}
          {gallery.length > 0 && (
            <div className="mb-16">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
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
                  <Heart size={20} />
                </div>
                <div className="text-white">
                  <h3 className="font-display text-xl font-bold leading-tight md:text-2xl">
                    {page?.cta_title || "Be a Part of the Change"}
                  </h3>
                  {page?.cta_subtitle && <p className="mt-1 text-sm text-white/85">{page.cta_subtitle}</p>}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <a
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold shadow-md transition-opacity hover:opacity-90"
                  style={{ color: ACCENT }}
                >
                  Get Involved
                </a>
                <a
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Contribute Now <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
