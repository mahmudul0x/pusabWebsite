import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Sparkles, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { GradientButton } from "@/components/site/GradientButton";
import heroMoments from "@/assets/hero-moments.jpg";

export const Route = createFileRoute("/felicitation")({
  head: () => ({
    meta: [
      { title: "Felicitation & Freshers' Reception — PUSAB" },
      {
        name: "description",
        content:
          "PUSAB honours academic achievers and welcomes new students every year — কৃতি সংবর্ধনা ও নবীনবরণ.",
      },
      { property: "og:title", content: "Felicitation & Freshers' Reception — PUSAB" },
      {
        property: "og:description",
        content:
          "Celebrating merit and welcoming the next generation of Bishwambarpur's students.",
      },
      { property: "og:url", content: "/felicitation" },
    ],
    links: [{ rel: "canonical", href: "/felicitation" }],
  }),
  component: FelicitationPage,
});

const SECTIONS = [
  {
    Icon: Award,
    tag: "কৃতি সংবর্ধনা",
    title: "Felicitation of Achievers",
    desc: "We honour students from Bishwambarpur who earn places in public universities, medical and engineering colleges — celebrating merit publicly to inspire the next batch.",
    points: ["Public university admits", "Board & olympiad toppers", "Crests, certificates & gifts"],
  },
  {
    Icon: Sparkles,
    tag: "নবীনবরণ",
    title: "Freshers' Reception",
    desc: "Newly admitted members are welcomed into the PUSAB family with an orientation that connects them to seniors, mentors and the association's mission.",
    points: ["Warm orientation", "Senior–junior bonding", "Mentor & guidance pairing"],
  },
];

function FelicitationPage() {
  return (
    <>
      <PageHero
        title="Felicitation & Freshers'"
        lede="কৃতি সংবর্ধনা ও নবীনবরণ — every year PUSAB honours its achievers and welcomes new students into the family."
        crumbs={[{ label: "Home", to: "/" }, { label: "Felicitation & Freshers" }]}
        image={heroMoments}
        imageAlt="PUSAB felicitation and freshers' reception ceremony"
      />

      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <p className="text-label mb-3">One ceremony, two celebrations</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Honouring merit, welcoming the next generation.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Each year PUSAB brings achievers and new entrants onto one stage — recognising those
              who carry Bishwambarpur's name forward, and embracing those just beginning the journey.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {SECTIONS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:shadow-[0_28px_55px_-35px_rgba(29,78,216,0.5)]"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white shadow-lg">
                  <s.Icon size={24} />
                </div>
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-1)]">
                  {s.tag}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
                <ul className="mt-6 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm text-foreground/85">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-1)] shadow-[0_0_10px_var(--color-accent-1)]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 relative overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] p-8 md:p-12">
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                  Be part of it
                </p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold leading-tight">
                  Got an achievement to share, or just joined? Reach out to take part.
                </h3>
              </div>
              <GradientButton to="/contact" variant="ghost" className="text-white! border-white/45!">
                <span className="inline-flex items-center gap-1.5">
                  Contact the team <ArrowUpRight size={16} />
                </span>
              </GradientButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
