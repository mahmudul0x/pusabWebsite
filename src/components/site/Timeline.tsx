import { motion } from "framer-motion";
import { AnimatedHeading } from "@/components/site/AnimatedHeading";
import { SITE } from "@/lib/site-content";

// Descriptions are kept to a similar length so the four columns line up
// instead of leaving a ragged bottom edge.
const MILESTONES = [
  {
    year: "2014",
    title: "Founded",
    desc: "Established at Digendra Barman Government College, bringing together the first cohort of public university students.",
  },
  {
    year: "Since",
    title: "Growing Together",
    desc: "Year after year new members have joined — from freshers stepping into public universities to alumni giving back.",
  },
  {
    year: "Today",
    title: `${SITE.members} Members Strong`,
    desc: "A community spanning universities, medical and engineering colleges nationwide, still rooted in one upazila.",
  },
  {
    year: "Ahead",
    title: "Building What's Next",
    desc: "Scholarships, mentoring, relief work and cultural programs — expanding what PUSAB can do for Bishwambarpur.",
  },
];

export function Timeline() {
  return (
    <section className="py-28 md:py-32 bg-[var(--color-surface-2)]">
      <div className="container-page">
        <div className="mb-16 max-w-xl">
          <p className="text-label mb-3">Our journey</p>
          <AnimatedHeading
            as="h2"
            className="font-display text-4xl md:text-5xl font-bold tracking-tight"
          >
            A Decade of Impact
          </AnimatedHeading>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border md:left-0 md:right-0 md:top-[15px] md:h-px md:w-auto" />

          <div className="grid gap-10 md:grid-cols-4 md:gap-6">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-10 md:pl-0"
              >
                {/* Node */}
                {/* Centred on the 1px rule at x=15px, so -1px puts the 32px
                    node's midpoint exactly on the line. */}
                <div className="absolute -left-px top-0 h-8 w-8 rounded-full border-2 border-[var(--color-accent-1)] bg-[var(--color-surface)] md:relative md:left-auto md:top-auto md:mb-6" />

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-1)]">
                  {m.year}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
