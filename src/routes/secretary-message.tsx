import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { Quote } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/secretary-message")({
  head: () => ({
    meta: [
      { title: "Secretary's Message — PUSAB" },
      {
        name: "description",
        content: "A message from the General Secretary of PUSAB — coordination, commitment and community.",
      },
      { property: "og:title", content: "Secretary's Message — PUSAB" },
      {
        property: "og:description",
        content: "A message from the General Secretary of PUSAB.",
      },
      { property: "og:url", content: "/secretary-message" },
    ],
    links: [{ rel: "canonical", href: "/secretary-message" }],
  }),
  component: SecretaryMessagePage,
});

const MESSAGE_PARAGRAPHS = [
  "Assalamu Alaikum to all members, supporters, and friends of PUSAB. Serving as General Secretary of this association is both a privilege and a responsibility I carry with deep gratitude and commitment.",
  "The role of a General Secretary is, at its heart, one of coordination and care — making sure that every decision reached at the leadership level translates into meaningful action on the ground. Whether it is organising our annual felicitation programme, managing the day-to-day correspondence of the association, or ensuring every committee member feels heard, the goal remains constant: to keep PUSAB running smoothly and purposefully.",
  "What inspires me most about PUSAB is the genuine desire our members bring to every meeting, every event, and every outreach effort. These are students who are already navigating the demands of their own academic journeys, yet they choose to give their time and energy to a cause larger than themselves. That generosity of spirit is the real engine of this organisation.",
  "Looking ahead, I am focused on strengthening our internal systems — better communication channels, more structured event planning, and clearer pathways for new members to step up and take ownership. A strong organisation is one where leadership is not concentrated at the top but shared freely across all levels.",
  "To every member: your involvement matters, your ideas matter, and your contribution — no matter how small it may seem — keeps PUSAB alive and growing. I look forward to working alongside each of you in service of Bishwambarpur and the students who call it home.",
];

function SecretaryMessagePage() {
  return (
    <>
      <PageHero
        title="Secretary's Message"
        lede="A word from the General Secretary of PUSAB — on coordination, commitment and community."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Leadership" },
          { label: "Secretary's Message" },
        ]}
        image={heroLeadership}
        imageAlt="PUSAB Secretary's message"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--color-accent-2)_30%,transparent)] bg-[var(--color-surface)] shadow-[0_32px_80px_-40px_rgba(139,92,246,0.3)]"
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-[linear-gradient(90deg,var(--color-accent-2),var(--color-accent-1))]" />

              <div className="grid gap-0 md:grid-cols-[280px_1fr]">
                {/* Left — photo + identity */}
                <div className="flex flex-col items-center gap-5 border-b border-border bg-[color-mix(in_oklab,var(--color-accent-2)_5%,var(--color-surface))] p-8 md:border-b-0 md:border-r md:p-10">
                  {/* Photo placeholder — replace src with real photo */}
                  <div className="h-40 w-40 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--color-accent-2),var(--color-accent-1))] ring-4 ring-[color-mix(in_oklab,var(--color-accent-2)_25%,transparent)]">
                    <span className="grid h-full w-full place-items-center text-4xl font-bold text-white select-none">
                      S
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-2)]">
                      General Secretary
                    </p>
                    <p className="mt-2 font-display text-xl font-bold leading-tight">
                      [Secretary Name]
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">General Secretary, PUSAB</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">Session 2026</p>
                  </div>

                  <div className="mt-auto hidden md:block">
                    <Quote size={40} className="text-[color-mix(in_oklab,var(--color-accent-2)_20%,transparent)]" />
                  </div>
                </div>

                {/* Right — message */}
                <div className="p-8 md:p-12">
                  <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-1)]">
                    Message from the General Secretary
                  </p>

                  {/* Opening pull-quote */}
                  <blockquote className="mb-8 border-l-2 border-[var(--color-accent-2)] pl-5">
                    <p className="font-display text-xl font-semibold leading-snug text-foreground md:text-2xl">
                      "A strong organisation is one where leadership is not concentrated at the top but shared freely across all levels."
                    </p>
                  </blockquote>

                  <div className="space-y-5 text-[15px] leading-[1.8] text-foreground/85">
                    {MESSAGE_PARAGRAPHS.map((p, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                      >
                        {p}
                      </motion.p>
                    ))}
                  </div>

                  {/* Signature */}
                  <div className="mt-10 flex items-center gap-4 border-t border-border pt-8">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-[linear-gradient(135deg,var(--color-accent-2),var(--color-accent-1))]">
                      <span className="grid h-full w-full place-items-center text-sm font-bold text-white">
                        S
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-bold">[Secretary Name]</p>
                      <p className="text-xs text-muted-foreground">General Secretary, PUSAB — Session 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
