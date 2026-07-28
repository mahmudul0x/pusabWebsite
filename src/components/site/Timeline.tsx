import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { AnimatedHeading } from "@/components/site/AnimatedHeading";
import { SITE } from "@/lib/site-content";

const MILESTONES = [
  {
    year: "2014",
    label: "Founded",
    title: "Where it started",
    desc: `Established at ${SITE.foundedAt}, bringing together the first cohort of public university students from Bishwambarpur.`,
  },
  {
    year: "Since",
    label: "Growth",
    title: "Growing together",
    desc: "Year after year, new members have joined — from freshers stepping into public universities to alumni giving back.",
  },
  {
    year: "Today",
    label: "Reach",
    title: `${SITE.members} members strong`,
    desc: "A community spanning universities, medical and engineering colleges across the country, still rooted in one upazila.",
  },
  {
    year: "Ahead",
    label: "Next",
    title: "Building what's next",
    desc: "Scholarships, mentoring, relief work and cultural programs — continuing to expand what PUSAB can do for Bishwambarpur.",
  },
];

/** Scroll-linked journey timeline. A single rail draws itself as the section
 *  scrolls through the viewport (the framer-motion equivalent of a GSAP
 *  ScrollTrigger scrub) and each milestone lights up as the rail passes it. */
export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });

  // Smooth the raw scroll value so the rail eases instead of tracking the
  // wheel 1:1 — closer to how a scrubbed GSAP tween feels.
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

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

        <div ref={ref} className="relative">
          {/* Rail — one continuous track behind every node, with a gradient
              fill that grows on scroll. Vertical on mobile, horizontal on
              desktop; inset by half a node so it starts and ends on centre. */}
          <div
            aria-hidden
            className="absolute left-[19px] top-5 bottom-5 w-px overflow-hidden bg-border md:left-5 md:right-5 md:top-5 md:bottom-auto md:h-px md:w-auto"
          >
            {/* Two fills: the vertical one scales on Y for the mobile rail,
                the horizontal one on X for the desktop rail. A single element
                can't do both, since scaleY on a 1px-tall track is a no-op. */}
            <motion.div
              className="h-full w-full origin-top bg-[linear-gradient(180deg,var(--color-accent-1),var(--color-accent-2))] md:hidden"
              style={{ scaleY: progress }}
            />
            <motion.div
              className="hidden h-full w-full origin-left bg-[linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2))] md:block"
              style={{ scaleX: progress }}
            />
          </div>

          <ol className="relative grid gap-x-8 gap-y-12 md:grid-cols-4 md:gap-y-0">
            {MILESTONES.map((m, i) => (
              <Milestone key={m.year} milestone={m} index={i} progress={progress} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Milestone({
  milestone,
  index,
  progress,
}: {
  milestone: (typeof MILESTONES)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  // The point along the rail where this node sits. The rail reaches it at
  // this fraction of total progress, so that's when it should activate.
  const at = index / (MILESTONES.length - 1);
  const span = 0.12;

  const opacity = useTransform(progress, [at - span, at], [0.45, 1]);
  const y = useTransform(progress, [at - span, at], [14, 0]);
  const nodeScale = useTransform(progress, [at - span, at, at + span], [0.85, 1.12, 1]);

  return (
    <motion.li style={{ opacity, y }} className="group relative pl-14 md:pl-0">
      {/* Node — sits on the rail and carries its step number. */}
      <motion.span
        style={{ scale: nodeScale }}
        className={
          "absolute left-0 top-0 z-10 grid h-10 w-10 place-items-center rounded-full font-display text-[13px] font-bold tabular-nums md:relative md:mb-7 " +
          "bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white " +
          "shadow-[0_10px_26px_-10px_color-mix(in_oklab,var(--color-accent-1)_85%,transparent)]"
        }
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      <p className="font-display text-3xl font-bold leading-none tracking-tight md:text-4xl">
        {milestone.year}
      </p>
      <p className="mt-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-1)]">
        {milestone.label}
      </p>
      <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">{milestone.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{milestone.desc}</p>
    </motion.li>
  );
}
