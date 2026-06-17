import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { SAYOR_SECTIONS } from "@/lib/site-content";
import { BookOpen, Globe2, FlaskConical, Landmark, Feather, Users, ArrowUpRight } from "lucide-react";
import { GradientButton } from "@/components/site/GradientButton";
import heroSayor from "@/assets/hero-sayor.jpg";

const SECTION_META = [
  { icon: BookOpen,     tag: "Feature",       blurb: "Admissions, careers, mentorship — the academic pulse of every batch." },
  { icon: Globe2,       tag: "Culture",       blurb: "Cultural memory, community stories, and the rhythm of Bishwambarpur." },
  { icon: FlaskConical, tag: "Research",      blurb: "Student research notes, lab reports, and frontier-tech essays." },
  { icon: Landmark,     tag: "Heritage",      blurb: "Historical deep-dives, archives, and the roots of our upazila." },
  { icon: Feather,      tag: "Literature",    blurb: "Poetry, short fiction, and creative essays from alumni voices." },
  { icon: Users,        tag: "Directory",     blurb: "A complete index of Bishwambarpur's brightest — past and present." },
];

const ISSUES = [
  { vol: 5, year: 2024, title: "The Kinetic Age" },
  { vol: 4, year: 2023, title: "Void & Volume" },
  { vol: 3, year: 2022, title: "Hyper-Local" },
  { vol: 2, year: 2021, title: "Foundations" },
];

export const Route = createFileRoute("/sayor")({
  head: () => ({
    meta: [
      { title: "SAYOR — The Annual Magazine of PUSAB" },
      { name: "description", content: "SAYOR is PUSAB's annual magazine spanning education, culture, science, heritage, literature and a directory of Bishwambarpur students." },
      { property: "og:title", content: "SAYOR — Annual Magazine of PUSAB" },
      { property: "og:description", content: "Six sections, one publication — the voice of Bishwambarpur's brightest." },
      { property: "og:url", content: "/sayor" },
    ],
    links: [{ rel: "canonical", href: "/sayor" }],
  }),
  component: SayorPage,
});

function SayorPage() {
  const featured = SECTION_META[0];
  const FeaturedIcon = featured.icon;
  return (
    <>
      <PageHero title="SAYOR" lede="The flagship annual magazine of PUSAB — six sections, one publication, the voice of Bishwambarpur's brightest." crumbs={[{ label: "Home", to: "/" }, { label: "SAYOR" }]} image={heroSayor} imageAlt="SAYOR magazine on a desk" />

      {/* Wordmark */}
      <section className="pb-10 overflow-hidden">
        <div className="container-page text-center">
          <h2 className="font-display font-extrabold tracking-tighter gradient-text leading-none text-[clamp(4rem,18vw,16rem)]">
            SAYOR
          </h2>
          <p className="-mt-2 text-label">Annual · Bilingual · Bishwambarpur</p>
        </div>
      </section>

      {/* Editorial bento — six sections */}
      <section className="pb-20">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-border pb-4">
            <div>
              <p className="text-label mb-2">Inside SAYOR</p>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">Six sections, one voice.</h2>
            </div>
            <span className="hidden sm:block text-xs uppercase tracking-[0.2em] text-muted-foreground">Vol · 05 / 24</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[180px] md:auto-rows-[200px]">
            {/* Featured */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-8 md:row-span-2 group relative overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)] bg-[var(--color-surface)] p-8 flex flex-col justify-end transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_55%,transparent)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,color-mix(in_oklab,var(--color-accent-1)_45%,transparent),transparent_55%),radial-gradient(circle_at_80%_80%,color-mix(in_oklab,var(--color-accent-2)_40%,transparent),transparent_55%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
              <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-[var(--color-accent-1)] text-white">
                  {featured.tag}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] border border-white/15 bg-black/30 backdrop-blur text-foreground/80">
                  01 / 06
                </span>
              </div>
              <div className="absolute top-6 left-6 z-20 grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white shadow-lg">
                <FeaturedIcon size={20} />
              </div>
              <div className="relative z-20 space-y-3">
                <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-[0.95]">
                  {SAYOR_SECTIONS[0]}
                </h3>
                <p className="text-foreground/70 max-w-md">{featured.blurb}</p>
              </div>
            </motion.article>

            {/* Sections 2 & 3 */}
            {SAYOR_SECTIONS.slice(1, 3).map((title, idx) => {
              const m = SECTION_META[idx + 1];
              const Icon = m.icon;
              const accent = idx === 0 ? "var(--color-accent-2)" : "var(--color-accent-1)";
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.08 * (idx + 1) }}
                  className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] p-6 hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <Icon size={20} style={{ color: accent }} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
                      {m.tag}
                    </span>
                  </div>
                  <h4 className="mt-6 font-display text-xl font-bold tracking-tight">{title}</h4>
                  <p className="mt-2 text-sm text-foreground/60 line-clamp-2">{m.blurb}</p>
                </motion.div>
              );
            })}

            {/* Sections 4, 5, 6 */}
            {SAYOR_SECTIONS.slice(3, 6).map((title, idx) => {
              const m = SECTION_META[idx + 3];
              const Icon = m.icon;
              const isMiddle = idx === 1;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.08 * (idx + 3) }}
                  className={
                    "md:col-span-4 group relative overflow-hidden rounded-3xl border p-6 transition-colors " +
                    (isMiddle
                      ? "border-[color-mix(in_oklab,var(--color-accent-2)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-2)_10%,var(--color-surface))] hover:border-[color-mix(in_oklab,var(--color-accent-2)_60%,transparent)]"
                      : "border-border bg-[var(--color-surface)] hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]")
                  }
                >
                  <div className="flex items-start justify-between">
                    <Icon size={20} className="text-[var(--color-accent-3)]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/60">
                      {m.tag}
                    </span>
                  </div>
                  <h4 className="mt-6 font-display text-xl font-bold tracking-tight">{title}</h4>
                  <p className="mt-2 text-sm text-foreground/60 line-clamp-2">{m.blurb}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Archive — non-scrolling grid */}
      <section className="py-16">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-6 border-b border-border pb-4">
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">Archive</h2>
            <a href="#" className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-1)] hover:opacity-80">
              View all issues
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {ISSUES.map((iss, i) => (
              <motion.a
                key={iss.vol}
                href="#"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="group block"
              >
                <div className="aspect-[3/4] rounded-2xl border border-border overflow-hidden relative transition-transform duration-500 group-hover:-translate-y-1.5">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#0F0F1A,#16162A)]" />
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        i % 2 === 0
                          ? "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--color-accent-1) 45%, transparent), transparent 55%), radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--color-accent-2) 45%, transparent), transparent 55%)"
                          : "radial-gradient(circle at 80% 20%, color-mix(in oklab, var(--color-accent-2) 45%, transparent), transparent 55%), radial-gradient(circle at 20% 80%, color-mix(in oklab, var(--color-accent-3) 35%, transparent), transparent 55%)",
                    }}
                  />
                  <div className="relative h-full flex flex-col justify-between p-5">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/60">Vol {String(iss.vol).padStart(2, "0")}</span>
                    <div>
                      <div className="font-display text-2xl md:text-3xl font-extrabold gradient-text">SAYOR</div>
                      <p className="mt-1 text-[11px] text-white/60">{iss.year}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-display font-bold tracking-tight group-hover:text-[var(--color-accent-1)] transition-colors">{iss.title}</p>
                  <p className="text-xs text-foreground/50">Issue {String(iss.vol).padStart(2, "0")} · {iss.year}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Student Directory CTA */}
      <section className="py-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2rem] p-8 md:p-12 bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))]">
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
            <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div className="max-w-xl text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">Student Directory</p>
                <h3 className="mt-3 font-display text-2xl md:text-4xl font-bold leading-tight">
                  A complete directory of Bishwambarpur's brightest — past and present.
                </h3>
                <p className="mt-3 text-white/85">
                  Connect with the creators, writers, doctors, and engineers featured across every SAYOR issue.
                </p>
              </div>
              <div className="flex md:justify-end">
                <GradientButton to="/contact">
                  <span className="inline-flex items-center gap-1.5">Explore directory <ArrowUpRight size={16} /></span>
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}