import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type ComponentType } from "react";
import { PageHero } from "@/components/site/PageHero";
import { GradientButton } from "@/components/site/GradientButton";
import { PROGRAMS } from "@/lib/site-content";
import {
  Users,
  GraduationCap,
  HeartHandshake,
  Trees,
  Stethoscope,
  Radio,
  BookOpen,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import heroPrograms from "@/assets/hero-programs.jpg";

const ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  reunion: Users,
  schooling: GraduationCap,
  scholarship: HeartHandshake,
  picnic: Trees,
  humanity: Stethoscope,
  online: Radio,
  sayor: BookOpen,
  others: Sparkles,
};

const META: Record<string, { tag: string; cadence: string; impact: string; highlights: string[] }> =
  {
    reunion: {
      tag: "Flagship",
      cadence: "Annual · December",
      impact: "500+ attendees",
      highlights: ["Cross-batch networking", "Awards & recognition", "Cultural evening"],
    },
    schooling: {
      tag: "Education",
      cadence: "Weekly sessions",
      impact: "12 schools",
      highlights: ["Free tutoring", "Career mentoring", "Olympiad prep"],
    },
    scholarship: {
      tag: "Aid",
      cadence: "Yearly intake",
      impact: "Need-based",
      highlights: ["Merit + need based", "Direct disbursal", "Mentor pairing"],
    },
    picnic: {
      tag: "Community",
      cadence: "Annual · Winter",
      impact: "All members",
      highlights: ["Outdoor venue", "Games & cuisine", "Family welcome"],
    },
    humanity: {
      tag: "Relief",
      cadence: "On-demand drives",
      impact: "Upazila-wide",
      highlights: ["Flood response", "Blanket drive", "Free medical camps"],
    },
    online: {
      tag: "Digital",
      cadence: "Monthly",
      impact: "Reach anywhere",
      highlights: ["Admission AMAs", "Career webinars", "Live Q&A"],
    },
    sayor: {
      tag: "Publication",
      cadence: "Yearly issue",
      impact: "6 sections",
      highlights: ["Literature & essays", "Alumni voices", "Print + digital"],
    },
    others: {
      tag: "Culture",
      cadence: "Year round",
      impact: "Mixed formats",
      highlights: ["Cultural nights", "Sports tournaments", "Partnerships"],
    },
  };

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs & Activities — PUSAB" },
      {
        name: "description",
        content:
          "PUSAB programs: annual reunion, schooling, scholarships, picnic, humanity initiatives, online events, SAYOR magazine, and more.",
      },
      { property: "og:title", content: "Programs & Activities — PUSAB" },
      {
        property: "og:description",
        content: "Explore the programs powering PUSAB's mission across Bishwambarpur.",
      },
      { property: "og:url", content: "/programs" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const [active, setActive] = useState(PROGRAMS[0].key);
  const current = PROGRAMS.find((p) => p.key === active)!;
  const activeIdx = PROGRAMS.findIndex((p) => p.key === active);
  const CurrentIcon = ICONS[current.key] ?? Sparkles;
  const currentMeta = META[current.key];

  return (
    <>
      <PageHero
        title="Programs & Activities"
        lede="From annual reunions to scholarship support, education drives to humanitarian response, PUSAB programs continue to serve students and the wider community."
        crumbs={[{ label: "Home", to: "/" }, { label: "Programs" }]}
        image={heroPrograms}
        imageAlt="PUSAB scholarship handover ceremony"
      />
      <section className="pb-24 md:pb-28">
        <div className="container-page">
          {/* Program chips — compact, wraps, never scrolls */}
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="text-label mb-4">Eight focus areas</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {PROGRAMS.map((p, i) => {
                const Icon = ICONS[p.key] ?? Sparkles;
                const isActive = active === p.key;
                return (
                  <li key={p.key}>
                    <button
                      onClick={() => setActive(p.key)}
                      className={
                        "group relative inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold tracking-[0.02em] transition-colors " +
                        (isActive
                          ? "border-transparent text-white"
                          : "border-border bg-[var(--color-surface)] text-foreground/75 hover:text-foreground hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]")
                      }
                    >
                      {isActive && (
                        <motion.span
                          layoutId="prog-chip"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] shadow-[0_8px_24px_-10px_color-mix(in_oklab,var(--color-accent-1)_70%,transparent)]"
                        />
                      )}
                      <span
                        className={
                          "relative z-10 font-display text-[10px] tabular-nums " +
                          (isActive ? "text-white/80" : "text-muted-foreground")
                        }
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon size={14} className="relative z-10" />
                      <span className="relative z-10">{p.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail panel — full-width, 2-col on desktop */}
          <AnimatePresence mode="wait">
            <motion.article
              key={current.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] shadow-sm lg:grid-cols-[1fr_1.25fr]"
            >
              {/* Visual column */}
              <div className="relative min-h-[260px] overflow-hidden border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r lg:border-border">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,color-mix(in_oklab,var(--color-accent-1)_55%,transparent),transparent_55%),radial-gradient(circle_at_80%_80%,color-mix(in_oklab,var(--color-accent-2)_45%,transparent),transparent_55%),radial-gradient(circle_at_60%_40%,color-mix(in_oklab,var(--color-accent-3)_35%,transparent),transparent_60%)]" />
                <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full border border-white/15 bg-black/30 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/90">
                      {currentMeta.tag}
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/30 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/80">
                      {String(activeIdx + 1).padStart(2, "0")} /{" "}
                      {String(PROGRAMS.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-8">
                    <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white shadow-lg shadow-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)]">
                      <CurrentIcon size={24} />
                    </div>
                    <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                      <span className="gradient-text">{current.title}</span>
                    </h2>
                    <p className="mt-2 text-sm text-foreground/70">{currentMeta.cadence}</p>
                  </div>
                </div>
              </div>

              {/* Content column */}
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-base leading-relaxed text-foreground/85 sm:text-lg">
                  {current.desc}
                </p>

                {/* Meta strip */}
                <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Cadence
                    </dt>
                    <dd className="mt-1.5 font-display font-semibold">{currentMeta.cadence}</dd>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Reach
                    </dt>
                    <dd className="mt-1.5 font-display font-semibold">{currentMeta.impact}</dd>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Format
                    </dt>
                    <dd className="mt-1.5 font-display font-semibold">{currentMeta.tag}</dd>
                  </div>
                </dl>

                {/* Highlights */}
                <div className="mt-8">
                  <p className="text-label mb-3">Highlights</p>
                  <ul className="grid gap-2 sm:grid-cols-3">
                    {currentMeta.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2 rounded-xl border border-border bg-background/40 p-3 text-sm"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-1)] shadow-[0_0_10px_var(--color-accent-1)]" />
                        <span className="text-foreground/85">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {current.key === "scholarship" ? (
                    <GradientButton to="/contact">Apply for Scholarship</GradientButton>
                  ) : (
                    <GradientButton to="/contact">
                      <span className="inline-flex items-center gap-1.5">
                        Get Involved <ArrowUpRight size={16} />
                      </span>
                    </GradientButton>
                  )}
                  <button
                    onClick={() => setActive(PROGRAMS[(activeIdx + 1) % PROGRAMS.length].key)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]"
                  >
                    Next Program <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
