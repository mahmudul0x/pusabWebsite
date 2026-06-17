import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { GlowCard } from "@/components/site/GlowCard";
import { OBJECTIVES, SITE } from "@/lib/site-content";
import heroAbout from "@/assets/hero-about.jpg";
import aboutMission from "@/assets/about-mission.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — PUSAB" },
      {
        name: "description",
        content:
          "PUSAB is a non-profit, non-political student association from Bishwambarpur Upazila, founded in 2014 at Govt. Digendra Barman College.",
      },
      { property: "og:title", content: "About — PUSAB" },
      {
        property: "og:description",
        content:
          "Mission, aims and founding story of PUSAB — a 300+ member association of public university students.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        title="About PUSAB"
        lede="Public University Students' Association of Bishwambarpur is a non-political, non-profit student body representing students from public universities, medical and engineering colleges."
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
        image={heroAbout}
        imageAlt="PUSAB members gathered in Bishwambarpur"
      />

      <section className="py-20 md:py-24">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative overflow-hidden rounded-3xl border border-border aspect-[4/3] shadow-sm">
            <img
              src={aboutMission}
              alt="PUSAB students studying together"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/25 via-transparent to-transparent" />
          </div>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p className="text-label">At a glance</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              A student-led organization rooted in service.
            </h2>
            <p>
              PUSAB was founded on {SITE.founded} at {SITE.foundedAt}. It is the first organization
              of its kind in Sunamganj district and brings together more than {SITE.members}{" "}
              students from public universities, medical and engineering colleges across Bangladesh.
            </p>
            <p>
              The association is non-political and non-profit. Its work centers on education,
              cooperation, scholarship support, humanitarian relief and youth leadership for the
              development of Bishwambarpur Upazila.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] p-10 md:p-14">
            <div className="absolute inset-y-0 left-0 w-1 bg-[var(--color-accent-3)] shadow-[0_0_40px_var(--color-accent-3)]" />
            <p className="text-label mb-4">Our mission</p>
            <p className="font-display italic text-2xl md:text-3xl leading-snug max-w-4xl">
              To build a stronger, more connected academic and social community for students from
              Bishwambarpur through cooperation, opportunity and service.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28">
        <div className="container-page">
          <p className="text-label mb-3">Our aims</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight max-w-2xl mb-12">
            Fourteen commitments that guide our work.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OBJECTIVES.map((o, i) => (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-border bg-[var(--color-surface)] p-6 hover:border-[color-mix(in_oklab,var(--color-accent-1)_50%,transparent)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl font-bold text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[var(--color-accent-1)]" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{o.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28">
        <div className="container-page">
          <p className="text-label mb-3">Timeline</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-16">
            The journey so far.
          </h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-accent-1)] via-[var(--color-accent-2)] to-[var(--color-accent-3)]" />
            <ol className="space-y-14 md:space-y-20">
              {[
                {
                  date: SITE.founded,
                  title: "Founding of PUSAB",
                  desc: `Established at ${SITE.foundedAt} — the first organization of its kind in Sunamganj district.`,
                },
                {
                  date: "2016",
                  title: "First scholarship drive",
                  desc: "Launched merit & need-based stipends for HSC graduates from Bishwambarpur preparing for university admissions.",
                },
                {
                  date: "2018",
                  title: "SAYOR — pre-admission coaching",
                  desc: "Started the Students' Admission Yearly Orientation Round, mentoring hundreds of admission seekers each year.",
                },
                {
                  date: "2020",
                  title: "Pandemic relief operations",
                  desc: "Distributed food, medical aid and learning materials across the upazila during COVID-19 lockdowns.",
                },
                {
                  date: "2022",
                  title: "Flood response in Sunamganj",
                  desc: "Coordinated emergency relief, shelter support and rebuilding aid for flood-affected families.",
                },
                {
                  date: "2024",
                  title: "300+ active members",
                  desc: "Crossed 300 members across public universities, medical and engineering colleges nationwide.",
                },
                {
                  date: "2026",
                  title: "Digital home of PUSAB",
                  desc: "Launched the official PUSAB platform — programs, leadership, publicity and moments, all in one place.",
                },
              ].map((item, i) => {
                const left = i % 2 === 0;
                return (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12"
                  >
                    <span className="absolute left-2 md:left-1/2 top-1.5 md:-translate-x-1/2 h-3 w-3 rounded-full bg-[var(--color-accent-1)] shadow-[0_0_20px_var(--color-accent-1)]" />
                    <div className={left ? "md:text-right md:pr-12" : "md:col-start-2 md:pl-12"}>
                      <p className="text-label">{item.date}</p>
                      <h3 className="mt-2 font-display text-2xl font-semibold">{item.title}</h3>
                      <p className="mt-2 text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container-page">
          <GlowCard className="text-center">
            <p className="text-label mb-3">Connect with PUSAB</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold">
              {SITE.email} · {SITE.phone}
            </h3>
          </GlowCard>
        </div>
      </section>
    </>
  );
}
