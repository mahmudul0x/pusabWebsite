import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Search,
  ArrowRight,
  ArrowUpDown,
  Users,
  Globe2,
  Target,
  Award,
  GraduationCap,
  Sparkles,
  Mail,
  Facebook,
  Image as ImageIcon,
  X,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { optimizeImage, type ProgramPage } from "@/lib/api";
import { SITE } from "@/lib/site-content";
import { GradientButton } from "./GradientButton";
import { EventCard } from "./EventCard";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  calendar: Calendar,
  target: Globe2,
  award: Award,
  sparkles: Sparkles,
  "graduation-cap": GraduationCap,
};

const BLUE = "var(--color-accent-1)";
const BLUE_2 = "var(--color-accent-2)";
const GRADIENT = `linear-gradient(120deg, ${BLUE}, ${BLUE_2})`;

export function OnlineEventsPage({
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
  const heroImage = page?.hero_image_url ? optimizeImage(page.hero_image_url, 1200) : heroImageFallback;

  const facts = page?.objectives ?? [];
  const whyJoin = page?.info_items ?? [];
  const webinars = page?.webinars ?? [];

  const categories = useMemo(
    () => Array.from(new Set(webinars.map((w) => w.tag).filter(Boolean))),
    [webinars],
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  const filteredWebinars = useMemo(() => {
    const q = search.trim().toLowerCase();
    return webinars.filter((w) => {
      if (category !== "all" && w.tag !== category) return false;
      if (upcomingOnly && w.status !== "upcoming") return false;
      if (!q) return true;
      return (
        w.title.toLowerCase().includes(q) ||
        w.speaker_name.toLowerCase().includes(q) ||
        w.tag.toLowerCase().includes(q)
      );
    });
  }, [webinars, search, category, upcomingOnly]);

  const gallery = page?.gallery ?? [];
  const GALLERY_STEP = 5;
  const [galleryStart, setGalleryStart] = useState(0);
  const galleryPage = gallery.slice(galleryStart, galleryStart + GALLERY_STEP);
  const canGalleryPrev = galleryStart > 0;
  const canGalleryNext = galleryStart + GALLERY_STEP < gallery.length;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const titleParts = title.split(" ");
  const splitAt = Math.ceil(titleParts.length / 2);

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
            <Wifi size={13} style={{ color: BLUE }} />
            Connect. Learn. Grow.
          </div>

          <h1 className="max-w-2xl font-display text-3xl font-extrabold leading-[1.04] tracking-[-0.03em] text-white md:text-5xl">
            {titleParts.slice(0, splitAt).join(" ")}{" "}
            <span style={{ color: BLUE }}>{titleParts.slice(splitAt).join(" ")}</span>
          </h1>
          {tagline && <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">{tagline}</p>}

          {facts.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-white/85 md:text-sm">
              {facts.slice(0, 4).map((f) => {
                const FactIcon = ICONS[f.icon] ?? Sparkles;
                return (
                  <span key={f.id} className="inline-flex items-center gap-2">
                    <FactIcon size={14} style={{ color: BLUE }} />
                    {f.title}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="pt-14 pb-0 md:pt-20">
        <div className="container-page">
          {/* Year switcher */}
          {years.length > 1 && page && (
            <div className="mb-10">
              <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: BLUE }}>
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
                      style={isActive ? { background: GRADIENT } : { borderColor: `color-mix(in oklab, ${BLUE} 30%, var(--color-border))` }}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search + filter bar */}
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by title, speaker or topic..."
                className="w-full rounded-xl border border-border bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-border bg-[var(--color-surface)] px-4 py-2.5 text-sm text-foreground/80 outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="inline-flex gap-1 rounded-xl border border-border bg-[var(--color-surface)] p-1">
                <button
                  onClick={() => setUpcomingOnly(false)}
                  className="rounded-lg px-3.5 py-1.5 text-sm font-bold transition-all"
                  style={
                    !upcomingOnly
                      ? { background: GRADIENT, color: "white" }
                      : { color: "var(--color-foreground)" }
                  }
                >
                  All
                </button>
                <button
                  onClick={() => setUpcomingOnly(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-bold transition-all"
                  style={
                    upcomingOnly
                      ? { background: GRADIENT, color: "white" }
                      : { color: "var(--color-foreground)" }
                  }
                >
                  Upcoming <ArrowUpDown size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Join Our Next Events */}
          {filteredWebinars.length > 0 && (
            <div className="mb-16">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: BLUE }}>
                    Upcoming Events
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">Join Our Next Events</h2>
                </div>
                <button
                  className="hidden shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground/80 transition-colors hover:text-foreground sm:inline-flex"
                >
                  View All Events <ArrowRight size={13} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {filteredWebinars.map((w) => (
                  <EventCard key={w.id} w={w} />
                ))}
              </div>
            </div>
          )}

          {/* Why Join Our Online Events */}
          {whyJoin.length > 0 && (
            <div className="mb-16 rounded-2xl p-6 sm:p-8" style={{ background: "var(--color-surface-2)" }}>
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: BLUE }}>
                Why Join Our Online Events?
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {whyJoin.map((item) => {
                  const ItemIcon = ICONS[item.icon] ?? Sparkles;
                  return (
                    <div key={item.id} className="flex items-start gap-3">
                      <div
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                        style={{ background: `color-mix(in oklab, ${BLUE} 12%, transparent)` }}
                      >
                        <ItemIcon size={18} style={{ color: BLUE }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-tight">{item.label}</p>
                        <p className="mt-1 text-xs leading-snug text-muted-foreground">{item.value}</p>
                      </div>
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
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: BLUE }}>
                    Past Events
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">Glimpses of Our Previous Events</h2>
                </div>
                <button
                  onClick={() => setLightboxIndex(0)}
                  className="hidden shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground/80 transition-colors hover:text-foreground sm:inline-flex"
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
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border"
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

          {/* Stay Updated */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] p-10 text-center md:p-14">
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, ${BLUE} 18%, transparent), transparent 50%), radial-gradient(circle at 70% 70%, color-mix(in oklab, ${BLUE_2} 16%, transparent), transparent 50%)`,
              }}
            />
            <div className="relative">
              <div
                className="mx-auto grid h-11 w-11 place-items-center rounded-full text-white"
                style={{ background: GRADIENT }}
              >
                <Mail size={18} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight md:text-4xl">
                {page?.cta_title || "Stay Updated"}
              </h3>
              {page?.cta_subtitle && (
                <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
                  {page.cta_subtitle}
                </p>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubscribed(true);
                }}
                className="mx-auto mt-8 flex w-full max-w-md items-center gap-2 rounded-xl border border-border bg-[var(--color-surface-2)] p-1.5"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: GRADIENT }}
                >
                  {subscribed ? "Subscribed" : "Subscribe"} <ArrowRight size={14} />
                </button>
              </form>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
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
