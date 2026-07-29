import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
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
    year: "2026",
    title: "One Decade & Two Years",
    desc: "Twelve years on from that first gathering, PUSAB marks the milestone by opening its official website to everyone.",
    highlight: true,
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
Twelve Years of Impact
          </AnimatedHeading>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border md:left-0 md:right-0 md:top-[15px] md:h-px md:w-auto" />

          <div className="grid gap-10 md:grid-cols-5 md:gap-5">
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
                    node's midpoint exactly on the line. The anniversary step is
                    filled in and haloed so it reads as the milestone. */}
                <div
                  className={
                    "absolute -left-px top-0 grid h-8 w-8 place-items-center rounded-full border-2 border-[var(--color-accent-1)] md:relative md:left-auto md:top-auto md:mb-6 " +
                    (m.highlight
                      ? "bg-[var(--color-accent-1)] shadow-[0_0_0_6px_color-mix(in_oklab,var(--color-accent-1)_18%,transparent)]"
                      : "bg-[var(--color-surface)]")
                  }
                >
                  {m.highlight && <Sparkles size={14} className="text-white" />}
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-1)]">
                  {m.year}
                </p>
                <h3
                  className={
                    "mt-2 font-display text-lg font-semibold " +
                    (m.highlight ? "gradient-text" : "")
                  }
                >
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
