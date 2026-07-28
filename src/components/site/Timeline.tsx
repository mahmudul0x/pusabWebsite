import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AnimatedHeading } from "@/components/site/AnimatedHeading";
import { SITE } from "@/lib/site-content";

const FOUNDED_YEAR = Number(SITE.founded.slice(-4));
const YEARS_RUNNING = new Date().getFullYear() - FOUNDED_YEAR;

/** Only verified facts — founding year/place and member count — presented as
 *  a short "our story" statement rather than a timeline of invented
 *  milestones. Swap in a real milestone list here if dated events are ever
 *  confirmed. */
const FACTS = [
  { value: SITE.founded.slice(-4), label: "Founded" },
  { value: `${YEARS_RUNNING}+`, label: "Years running" },
  { value: SITE.members, label: "Members" },
];

export function Timeline() {
  return (
    <section className="py-28 md:py-32 bg-[var(--color-surface-2)]">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
          {/* Story */}
          <div>
            <p className="text-label mb-3">Our journey</p>
            <AnimatedHeading
              as="h2"
              className="font-display text-4xl md:text-5xl font-bold tracking-tight"
            >
              A Decade of Impact
            </AnimatedHeading>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 space-y-5 text-[15px] leading-[1.85] text-muted-foreground md:text-base"
            >
              <p>
                PUSAB began on{" "}
                <span className="font-semibold text-foreground">{SITE.founded}</span> at Digendra
                Barman Government College, when a small group of students from Bishwambarpur
                decided their upazila deserved a network of its own.
              </p>
              <p>
                {YEARS_RUNNING} years on, that group has grown into{" "}
                <span className="font-semibold text-foreground">{SITE.members} members</span> across
                public universities, medical and engineering colleges nationwide — still organised
                by students, still rooted in one upazila.
              </p>
            </motion.div>

            <Link
              to="/about"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent-1)]"
            >
              Read our full story
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Facts */}
          <div className="grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-[var(--color-surface)] py-9">
            {FACTS.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="px-3 text-center md:px-6"
              >
                <p className="font-display text-3xl font-bold tracking-tight md:text-[2.75rem] md:leading-none">
                  {f.value}
                </p>
                <p className="mt-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {f.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
