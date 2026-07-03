import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Users,
  Sprout,
  Trophy,
  Megaphone,
  GraduationCap,
  HandCoins,
  Briefcase,
  BookOpenText,
  Stethoscope,
  HandHeart,
  PartyPopper,
  ShieldCheck,
  Network,
  Scale,
  Flag,
  Quote,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { GlowCard } from "@/components/site/GlowCard";
import { OBJECTIVES, SITE } from "@/lib/site-content";
import heroAbout from "@/assets/hero-about.jpg";
import aboutMission from "@/assets/about-mission.jpg";

// One icon per aim, matched to the OBJECTIVES order in site-content.
const AIM_ICONS = [
  Users,
  Sprout,
  Trophy,
  Megaphone,
  GraduationCap,
  HandCoins,
  Briefcase,
  BookOpenText,
  Stethoscope,
  HandHeart,
  PartyPopper,
  ShieldCheck,
  Network,
  Scale,
];

const GLANCE_FACTS = [
  { value: SITE.members, label: "Active members" },
  { value: "Non-profit", label: "Structure" },
  { value: "Non-political", label: "Affiliation" },
  { value: "First in Sunamganj", label: "Of its kind" },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — PUSAB" },
      {
        name: "description",
        content:
          "PUSAB is a non-profit, non-political student association from Bishwambarpur Upazila, founded in 2014 at Digendra Barman Government College (then Digendra Barman Degree College).",
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

      {/* At a glance */}
      <section className="py-20 md:py-28">
        <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border aspect-[4/3] shadow-[0_40px_90px_-50px_rgba(15,23,42,0.55)]">
              <img
                src={aboutMission}
                alt="PUSAB students studying together"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 left-5 sm:left-8 rounded-2xl border border-border bg-[var(--color-surface)] px-6 py-4 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.4)]">
              <p className="font-display text-3xl font-extrabold leading-none gradient-text">
                {SITE.founded.slice(-4)}
              </p>
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Founded
              </p>
            </div>
          </motion.div>

          <div>
            <p className="text-label mb-3">At a glance</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              A student-led organization rooted in service.
            </h2>
            <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                PUSAB was founded on {SITE.founded} at {SITE.foundedAt}. It is the first
                organization of its kind in Sunamganj district and brings together more than{" "}
                {SITE.members} students from public universities, medical and engineering colleges
                across Bangladesh.
              </p>
              <p>
                The association is non-political and non-profit. Its work centers on education,
                cooperation, scholarship support, humanitarian relief and youth leadership for the
                development of Bishwambarpur Upazila.
              </p>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {GLANCE_FACTS.map((f) => (
                <div key={f.label} className="bg-[var(--color-surface)] p-5">
                  <dd className="font-display text-lg font-bold tracking-tight text-foreground">
                    {f.value}
                  </dd>
                  <dt className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {f.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Our mission */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-[var(--color-surface)] px-6 py-14 text-center md:px-16 md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,color-mix(in_oklab,var(--color-accent-1)_16%,transparent),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(color-mix(in_oklab,var(--color-foreground)_4%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--color-foreground)_4%,transparent)_1px,transparent_1px)] [background-size:34px_34px] opacity-60" />
            <Quote
              className="relative mx-auto mb-6 text-[var(--color-accent-1)]"
              size={40}
              strokeWidth={1.5}
            />
            <p className="relative text-label">Our mission</p>
            <p className="relative mx-auto mt-5 max-w-4xl font-display text-2xl md:text-4xl font-semibold leading-snug tracking-tight text-foreground">
              To build a stronger, more connected academic and social community for students from
              Bishwambarpur through{" "}
              <span className="gradient-text">cooperation, opportunity and service.</span>
            </p>
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
                  date: "2014",
                  title: "SAYOR- thoughts of years.",
                  desc: "SAYOR is PUSAB's flagship annual magazine, bringing together voices from education, culture, science, heritage, literature and student life across Bishwambarpur.",
                },
                {
                  date: "2016",
                  title: "First scholarship drive",
                  desc: "Launched merit & need-based stipends for HSC graduates from Bishwambarpur preparing for university admissions. PUSAB also arrenges Scholarship Exam for the student of class VIII, IX and X.",
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

      {/* Our aims */}
      <section className="py-24 md:py-28">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <p className="text-label mb-3">Our aims</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Fourteen commitments that guide our work.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every initiative we run traces back to one of these aims — from the classroom to the
              community.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OBJECTIVES.map((o, i) => {
              const Icon = AIM_ICONS[i] ?? Flag;
              return (
                <motion.div
                  key={o.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--color-accent-1)_50%,transparent)] hover:shadow-[0_28px_55px_-35px_rgba(29,78,216,0.5)]"
                >
                  <span className="pointer-events-none absolute -right-1 -top-5 select-none font-display text-7xl font-extrabold text-[color-mix(in_oklab,var(--color-foreground)_5%,transparent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--color-accent-1)_12%,transparent)] text-[var(--color-accent-1)] transition-colors duration-300 group-hover:bg-[var(--color-accent-1)] group-hover:text-white">
                      <Icon size={20} />
                    </div>
                    <span className="font-display text-sm font-bold tabular-nums text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="relative mt-5 font-display text-lg font-semibold">{o.title}</h3>
                  <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">
                    {o.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container-page">
          <GlowCard className="text-center">
            <p className="text-label mb-3">Connect with PUSAB</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold">
              <a href={`mailto:${SITE.email}`} className="block hover:text-(--color-accent-1) transition-colors">
                {SITE.email}
              </a>
              <a
                href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                className="block hover:text-(--color-accent-1) transition-colors"
              >
                {SITE.phone}
              </a>
            </h3>
          </GlowCard>
        </div>
      </section>
    </>
  );
}
