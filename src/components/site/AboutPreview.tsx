import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AnimatedHeading } from "@/components/site/AnimatedHeading";
import { GradientButton } from "@/components/site/GradientButton";
import { SITE } from "@/lib/site-content";
import aboutMission from "@/assets/aboutCommitte.webp";

const QUICK_FACTS = [
  { value: SITE.members, label: "Active members" },
  { value: "Non-profit", label: "Structure" },
  { value: "Non-political", label: "Affiliation" },
];

export function AboutPreview() {
  return (
    <section className="py-28 md:py-32">
      <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-last lg:order-first"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border aspect-4/3 shadow-[0_40px_90px_-50px_rgba(15,23,42,0.55)]">
            <img
              src={aboutMission}
              alt="PUSAB members gathered for a group photograph"
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
          <p className="text-label mb-3">Who we are</p>
          <AnimatedHeading
            as="h2"
            className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            A student-led organization rooted in service.
          </AnimatedHeading>
          <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg">
            PUSAB brings together {SITE.members} students from public universities, medical and
            engineering colleges — the first organization of its kind in Sunamganj district. We're
            a non-political, non-profit association focused on education, scholarship support,
            humanitarian relief and youth leadership for Bishwambarpur Upazila.
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {QUICK_FACTS.map((f) => (
              <div key={f.label} className="bg-[var(--color-surface)] p-4 sm:p-5">
                <dd className="font-display text-base sm:text-lg font-bold tracking-tight text-foreground">
                  {f.value}
                </dd>
                <dt className="mt-1 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {f.label}
                </dt>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <GradientButton to="/about" variant="ghost">
              Learn more about us <ArrowRight size={16} />
            </GradientButton>
          </div>
        </div>
      </div>
    </section>
  );
}
