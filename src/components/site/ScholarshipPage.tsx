import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  ArrowRight,
  Quote,
  Users,
  Target,
  GraduationCap,
  Sparkles,
  Award,
  ClipboardCheck,
  ListChecks,
  FileCheck2,
  BadgeCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { optimizeImage, type ProgramPage } from "@/lib/api";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  users: Users,
  target: Target,
  "map-pin": MapPin,
  "graduation-cap": GraduationCap,
  calendar: Calendar,
  sparkles: Sparkles,
  award: Award,
};

// This page's palette matches its reference design 1:1 — deep navy + gold —
// rather than the site's usual blue accent tokens, by deliberate request.
const NAVY = "#0B1B3F";
const NAVY_2 = "#132a5e";
const GOLD = "#F5A623";
const GOLD_GRADIENT = `linear-gradient(120deg, ${GOLD}, #E08E1D)`;

const PROCESS_STEPS = [
  { icon: ListChecks, title: "Check Eligibility", desc: "Review the eligibility criteria carefully." },
  { icon: ClipboardCheck, title: "Submit Application", desc: "Fill out the application form with required documents." },
  { icon: FileCheck2, title: "Evaluation", desc: "Our team will review your application." },
  { icon: BadgeCheck, title: "Selection & Award", desc: "Successful candidates will be notified and awarded." },
];

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
          <div key={t.id} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <Quote size={20} style={{ color: GOLD }} className="opacity-80" />
            <p className="mt-3 text-sm leading-relaxed italic text-foreground/90">{t.quote}</p>
            <div className="mt-4 flex items-center gap-3">
              {t.photo_url ? (
                <img src={optimizeImage(t.photo_url, 80)} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div
                  className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_2})` }}
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
            className="absolute left-0 top-1/2 hidden -translate-x-14 -translate-y-1/2 h-9 w-9 place-items-center rounded-full border border-border bg-white text-foreground transition-colors hover:border-[color-mix(in_oklab,#F5A623_40%,transparent)] disabled:opacity-30 sm:grid"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setStart((s) => (s + perPage < testimonials.length ? s + perPage : s))}
            disabled={!canNext}
            aria-label="Next testimonials"
            className="absolute right-0 top-1/2 hidden translate-x-14 -translate-y-1/2 h-9 w-9 place-items-center rounded-full border border-border bg-white text-foreground transition-colors hover:border-[color-mix(in_oklab,#F5A623_40%,transparent)] disabled:opacity-30 sm:grid"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}

export function ScholarshipPage({
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
  const GALLERY_STEP = 5;
  const [galleryStart, setGalleryStart] = useState(0);
  const galleryPage = gallery.slice(galleryStart, galleryStart + GALLERY_STEP);
  const canGalleryPrev = galleryStart > 0;
  const canGalleryNext = galleryStart + GALLERY_STEP < gallery.length;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const overviewParagraphs = overview.split(/\n{2,}/).filter(Boolean);
  const features = page?.objectives ?? [];
  const infoCards = page?.info_items ?? [];

  return (
    <>
      {/* Hero — boxed navy card, not full-bleed */}
      <section className="pt-28 pb-10 md:pt-32 md:pb-14" style={{ background: NAVY }}>
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

          <div
            className="relative overflow-hidden rounded-3xl border"
            style={{ borderColor: "color-mix(in oklab, #F5A623 35%, transparent)" }}
          >
            <div className="grid gap-8 p-6 md:grid-cols-2 md:items-center md:p-10 lg:p-12">
              <div>
                <p
                  className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: GOLD }}
                >
                  Investing in Potential
                </p>
                <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-white md:text-5xl">
                  {title.split(" ").slice(0, -1).join(" ")}{" "}
                  <span style={{ color: GOLD }}>{title.split(" ").slice(-1)}</span>
                </h1>
                {tagline && (
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75 md:text-base">
                    {tagline}
                  </p>
                )}

                {features.length > 0 && (
                  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {features.slice(0, 3).map((f) => {
                      const FeatureIcon = FEATURE_ICONS[f.icon] ?? Sparkles;
                      return (
                        <div key={f.id} className="flex items-start gap-2.5">
                          <div
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border"
                            style={{ borderColor: "color-mix(in oklab, #F5A623 45%, transparent)" }}
                          >
                            <FeatureIcon size={14} style={{ color: GOLD }} />
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-tight text-white">{f.title}</p>
                            {f.description && (
                              <p className="mt-1 text-[11px] leading-snug text-white/60">{f.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-auto md:h-full md:min-h-[280px]">
                <img src={heroImage} alt={title} className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </div>
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
                          : { borderColor: "color-mix(in oklab, #F5A623 30%, var(--color-border))" }
                      }
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* About + info grid */}
          <div className="mb-14 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                About the Scholarship
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                Creating Opportunities, Changing Lives
              </h2>
              {overviewParagraphs.map((p, i) => (
                <p key={i} className="mt-4 text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
              {page?.register_label && (
                <a
                  href={page.register_url || "#"}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))" }}
                >
                  {page.register_label} <ArrowRight size={15} />
                </a>
              )}
            </div>

            {infoCards.length > 0 && (
              <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
                {infoCards.map((item) => {
                  const ItemIcon = FEATURE_ICONS[item.icon] ?? Sparkles;
                  return (
                    <div key={item.id} className="bg-white p-5 text-center">
                      <div
                        className="mx-auto grid h-12 w-12 place-items-center rounded-full"
                        style={{ background: "color-mix(in oklab, var(--color-accent-1) 10%, transparent)" }}
                      >
                        <ItemIcon size={20} style={{ color: "var(--color-accent-1)" }} />
                      </div>
                      <p className="mt-3 text-sm font-bold leading-tight">{item.label}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Impact stats — dark banner */}
          {page && page.stats.length > 0 && (
            <div
              className="mb-14 overflow-hidden rounded-2xl"
              style={{ background: `linear-gradient(120deg, ${NAVY}, ${NAVY_2})` }}
            >
              <p
                className="pt-6 text-center text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                Our Impact So Far
              </p>
              <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-5 sm:p-8">
                {page.stats.map((s) => (
                  <div key={s.id} className="text-center">
                    <p className="font-display text-2xl font-extrabold text-white md:text-3xl">{s.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-white/60">{s.label}</p>
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
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                    Scholarship Gallery
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">
                    Moments of Impact
                  </h2>
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
                  className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-white text-foreground transition-colors disabled:opacity-30 sm:grid"
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
                  className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-white text-foreground transition-colors disabled:opacity-30 sm:grid"
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

          {/* Application process — light panel, numbered steps */}
          {page?.process && (
            <div className="mb-14 rounded-2xl bg-[var(--color-surface-2)] p-6 md:p-10">
              <div className="grid gap-8 md:grid-cols-[1fr_1.6fr] md:items-center">
                <div>
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--color-accent-1)" }}>
                    Application Process
                  </p>
                  <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                    Be a Part of the Change
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    If you are a deserving student who is passionate about learning and need
                    financial support, we encourage you to apply for the PUSAB Scholarship.
                  </p>
                  {page?.register_label && (
                    <a
                      href={page.register_url || "#"}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                      style={{ background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))" }}
                    >
                      {page.register_label} <ArrowRight size={15} />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
                  {PROCESS_STEPS.map((step, i) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.title} className="relative text-center">
                        {i < PROCESS_STEPS.length - 1 && (
                          <div className="absolute left-1/2 top-6 hidden h-px w-full bg-[repeating-linear-gradient(90deg,var(--color-border)_0,var(--color-border)_4px,transparent_4px,transparent_8px)] sm:block" />
                        )}
                        <div
                          className="relative z-10 mx-auto grid h-12 w-12 place-items-center rounded-full text-white shadow-md"
                          style={{ background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))" }}
                        >
                          <StepIcon size={18} />
                        </div>
                        <p className="mt-3 text-xs font-bold leading-tight">{step.title}</p>
                        <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Testimonials */}
          {page && page.testimonials.length > 0 && (
            <div className="mb-14 text-center">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                In their words
              </p>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Voices of Our Scholars</h2>
              <div className="mt-10 text-left">
                <TestimonialCarousel testimonials={page.testimonials} />
              </div>
            </div>
          )}

          {/* CTA — dark banner */}
          <div
            className="flex flex-col items-center gap-5 rounded-2xl p-8 text-center sm:flex-row sm:justify-between sm:text-left"
            style={{ background: `linear-gradient(120deg, ${NAVY}, ${NAVY_2})` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                style={{ background: "color-mix(in oklab, #F5A623 20%, transparent)", color: GOLD }}
              >
                <BadgeCheck size={20} />
              </div>
              <div className="text-white">
                <h3 className="font-display text-lg font-bold leading-tight">
                  {page?.cta_title || "Your support can empower a student's future."}
                </h3>
                {page?.cta_subtitle && <p className="mt-1 text-sm text-white/75">{page.cta_subtitle}</p>}
              </div>
            </div>
            <a
              href="/support"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-[#1a1a1a] transition-opacity hover:opacity-90"
              style={{ background: GOLD_GRADIENT }}
            >
              Contribute Now <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
