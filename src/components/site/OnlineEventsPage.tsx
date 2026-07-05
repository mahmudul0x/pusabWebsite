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
  GraduationCap as GradCapIcon,
  Coins,
  Brain,
  BookOpen,
  X,
  type LucideIcon,
} from "lucide-react";
import { optimizeImage, type ProgramPage, type ProgramWebinar } from "@/lib/api";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  calendar: Calendar,
  target: Globe2,
  award: Award,
  sparkles: Sparkles,
  "graduation-cap": GraduationCap,
};

const BLUE = "#1D4ED8";
const BLUE_2 = "#1E3A8A";
const GRADIENT = `linear-gradient(120deg, ${BLUE}, ${BLUE_2})`;

// Each event card gets its own banner gradient + icon based on its tag, so
// the grid reads with the same visual variety as the reference (talk show =
// navy books, workshop = purple growth, seminar = teal chart, discussion =
// green brain), independent of site-wide accent tokens.
const TAG_STYLE: Record<string, { gradient: string; Icon: LucideIcon }> = {
  "Talk Show": { gradient: "linear-gradient(135deg, #1E3A8A, #1D4ED8)", Icon: BookOpen },
  Workshop: { gradient: "linear-gradient(135deg, #4C1D95, #7C3AED)", Icon: GradCapIcon },
  Seminar: { gradient: "linear-gradient(135deg, #0F3D3E, #0E7490)", Icon: Coins },
  Discussion: { gradient: "linear-gradient(135deg, #14532D, #15803D)", Icon: Brain },
};
const DEFAULT_TAG_STYLE = { gradient: GRADIENT, Icon: Sparkles };

function EventCard({ w }: { w: ProgramWebinar }) {
  const style = TAG_STYLE[w.tag] ?? DEFAULT_TAG_STYLE;
  const isLive = w.status === "live";
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1">
      <div className="relative flex aspect-[16/10] items-center justify-center p-5" style={{ background: style.gradient }}>
        <span
          className={
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white " +
            (isLive ? "bg-red-600" : "bg-white/20 backdrop-blur")
          }
        >
          {isLive && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          )}
          {isLive ? "Live" : "Upcoming"}
        </span>
        <style.Icon size={40} className="text-white/85" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: BLUE }}>
          {w.tag}
        </p>
        <h3 className="mt-2 font-display text-base font-bold leading-snug tracking-tight">{w.title}</h3>

        {w.speaker_name && (
          <div className="mt-4 flex items-center gap-2.5">
            {w.speaker_photo_url ? (
              <img src={optimizeImage(w.speaker_photo_url, 80)} alt={w.speaker_name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: style.gradient }}>
                {w.speaker_name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight">{w.speaker_name}</p>
              {w.speaker_role && <p className="text-[11px] text-muted-foreground">{w.speaker_role}</p>}
            </div>
          </div>
        )}

        {(w.event_date || w.event_time) && (
          <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
            {w.event_date}
            {w.event_date && w.event_time && <span className="mx-1.5 text-foreground/30">·</span>}
            {w.event_time}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2.5">
          <button className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-bold text-foreground/80 transition-colors hover:text-foreground">
            View Details
          </button>
          <a
            href={w.register_url || "#"}
            className="flex-1 rounded-lg px-3 py-2 text-center text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: GRADIENT }}
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
}

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
  heroImageFallback: string;
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

  const [search, setSearch] = useState("");
  const filteredWebinars = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return webinars;
    return webinars.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.speaker_name.toLowerCase().includes(q) ||
        w.tag.toLowerCase().includes(q),
    );
  }, [webinars, search]);

  const gallery = page?.gallery ?? [];
  const GALLERY_STEP = 5;
  const [galleryStart, setGalleryStart] = useState(0);
  const galleryPage = gallery.slice(galleryStart, galleryStart + GALLERY_STEP);
  const canGalleryPrev = galleryStart > 0;
  const canGalleryNext = galleryStart + GALLERY_STEP < gallery.length;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      {/* Hero — dark banner with laptop image on the right */}
      <section className="relative overflow-hidden pt-28 pb-10 md:pt-32 md:pb-14" style={{ background: `linear-gradient(120deg, ${BLUE_2}, ${BLUE})` }}>
        <div className="container-page relative z-10">
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

          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">Connect. Learn. Grow.</p>
              <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-white md:text-5xl">{title}</h1>
              {tagline && <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75 md:text-base">{tagline}</p>}
              <div className="mt-4 h-0.5 w-14 rounded-full" style={{ background: "#60A5FA" }} />

              {facts.length > 0 && (
                <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {facts.map((f) => {
                    const FactIcon = ICONS[f.icon] ?? Sparkles;
                    return (
                      <div key={f.id}>
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                          <FactIcon size={17} className="text-white" />
                        </div>
                        <p className="mt-2.5 text-xs font-bold leading-tight text-white">{f.title}</p>
                        {f.description && <p className="mt-1 text-[11px] leading-snug text-white/60">{f.description}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-auto md:h-full md:min-h-[300px]">
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
              <select className="rounded-xl border border-border bg-[var(--color-surface)] px-4 py-2.5 text-sm text-foreground/80 outline-none">
                <option>All Categories</option>
                <option>Talk Show</option>
                <option>Workshop</option>
                <option>Seminar</option>
                <option>Discussion</option>
              </select>
              <select className="rounded-xl border border-border bg-[var(--color-surface)] px-4 py-2.5 text-sm text-foreground/80 outline-none">
                <option>All Status</option>
                <option>Live</option>
                <option>Upcoming</option>
              </select>
              <button
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: GRADIENT }}
              >
                Upcoming First <ArrowUpDown size={14} />
              </button>
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

          {/* Stay Updated — blue subscribe banner */}
          <div className="flex flex-col items-stretch gap-5 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8" style={{ background: GRADIENT }}>
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                <Mail size={20} />
              </div>
              <div className="text-white">
                <h3 className="font-display text-lg font-bold leading-tight">{page?.cta_title || "Stay Updated"}</h3>
                {page?.cta_subtitle && <p className="mt-1 text-sm text-white/80">{page.cta_subtitle}</p>}
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-white/10 p-1.5 backdrop-blur"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-48 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/60 outline-none sm:w-56"
              />
              <button type="submit" className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-bold transition-opacity hover:opacity-90" style={{ color: BLUE }}>
                {subscribed ? "Subscribed" : "Subscribe"} <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
