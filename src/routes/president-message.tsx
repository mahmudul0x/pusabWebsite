import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { Quote } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/president-message")({
  head: () => ({
    meta: [
      { title: "President's Message — PUSAB" },
      {
        name: "description",
        content: "A message from the President of PUSAB — vision, values and the road ahead.",
      },
      { property: "og:title", content: "President's Message — PUSAB" },
      {
        property: "og:description",
        content: "A message from the President of PUSAB.",
      },
      { property: "og:url", content: "/president-message" },
    ],
    links: [{ rel: "canonical", href: "/president-message" }],
  }),
  component: PresidentMessagePage,
});

const MESSAGE_PARAGRAPHS = [
  "Assalamu Alaikum and warm greetings to every member, well-wisher, and friend of PUSAB. It is a profound honour to serve as President of this remarkable association — a family built not on convenience, but on a shared love for Bishwambarpur and a collective belief in the transformative power of education.",
  "When PUSAB was founded in 2014, it was born out of a simple but powerful idea: that students from public universities, medical colleges, and engineering institutions who hail from the same upazila can — and should — stand together, support one another, and give back to the community that shaped them. Over a decade later, that idea has grown into a movement of more than 300 dedicated young minds.",
  "Our journey has never been about prestige or personal gain. It has always been about service — tutoring the next generation of students, organising programmes that celebrate academic achievement, building bridges between villages and universities, and ensuring that no talented student from Bishwambarpur feels alone on the long road ahead.",
  "As we move forward, my commitment is to deepen our roots in the community, broaden our reach across institutions, and create more structured pathways for students who need guidance, mentorship, and a sense of belonging. Every initiative we undertake — from felicitation ceremonies to community outreach — is a step toward a more connected and empowered Bishwambarpur.",
  "I invite every member to carry the spirit of PUSAB with them: in their classrooms, in their communities, and in their character. Together, we are stronger than the sum of our parts. Together, we are PUSAB.",
];

function PresidentMessagePage() {
  return (
    <>
      <PageHero
        title="President's Message"
        lede="A word from the President of PUSAB — on purpose, people, and the path ahead."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Leadership" },
          { label: "President's Message" },
        ]}
        image={heroLeadership}
        imageAlt="PUSAB President's message"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-4xl">
            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)] bg-[var(--color-surface)] shadow-[0_32px_80px_-40px_rgba(29,78,216,0.35)]"
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-[linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2))]" />

              <div className="grid gap-0 md:grid-cols-[280px_1fr]">
                {/* Left — photo + identity */}
                <div className="flex flex-col items-center gap-5 border-b border-border bg-[color-mix(in_oklab,var(--color-accent-1)_5%,var(--color-surface))] p-8 md:border-b-0 md:border-r md:p-10">
                  {/* Photo placeholder — replace src with real photo */}
                  <div className="h-40 w-40 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] ring-4 ring-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)]">
                    <span className="grid h-full w-full place-items-center text-4xl font-bold text-white select-none">
                      P
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-1)]">
                      Current President
                    </p>
                    <p className="mt-2 font-display text-xl font-bold leading-tight">
                      [President Name]
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">President, PUSAB</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">Session 2026</p>
                  </div>

                  {/* Decorative quote icon */}
                  <div className="mt-auto hidden md:block">
                    <Quote size={40} className="text-[color-mix(in_oklab,var(--color-accent-1)_20%,transparent)]" />
                  </div>
                </div>

                {/* Right — message */}
                <div className="p-8 md:p-12">
                  <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-2)]">
                    Message from the President
                  </p>

                  {/* Opening pull-quote */}
                  <blockquote className="mb-8 border-l-2 border-[var(--color-accent-1)] pl-5">
                    <p className="font-display text-xl font-semibold leading-snug text-foreground md:text-2xl">
                      "Together, we are stronger than the sum of our parts. Together, we are PUSAB."
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
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))]">
                      <span className="grid h-full w-full place-items-center text-sm font-bold text-white">
                        P
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-bold">[President Name]</p>
                      <p className="text-xs text-muted-foreground">President, PUSAB — Session 2026</p>
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
