import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HeartHandshake, GraduationCap, Stethoscope, Users, Copy, Check } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { GradientButton } from "@/components/site/GradientButton";
import { SITE } from "@/lib/site-content";
import heroAbout from "@/assets/hero-about.jpg";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support PUSAB — Donate & Sponsor" },
      {
        name: "description",
        content:
          "Support PUSAB's scholarships, medical camps and education drives. Donate or sponsor a program for Bishwambarpur's students.",
      },
      { property: "og:title", content: "Support PUSAB" },
      { property: "og:description", content: "Donate or sponsor to power student education in Bishwambarpur." },
      { property: "og:url", content: "/support" },
    ],
    links: [{ rel: "canonical", href: "/support" }],
  }),
  component: SupportPage,
});

const IMPACT = [
  { Icon: GraduationCap, title: "Scholarships", desc: "Fund a deserving student's university journey." },
  { Icon: Stethoscope, title: "Medical camps", desc: "Bring free healthcare to remote villages." },
  { Icon: Users, title: "Education drives", desc: "Tutoring, mentoring and admission support." },
];

// Replace with the organisation's real payment details.
const CHANNELS = [
  { label: "bKash (Personal)", value: SITE.phone },
  { label: "Bank", value: "PUSAB · A/C 0000000000 · (Bank, Branch)" },
];

function SupportPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (key: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
  };

  return (
    <>
      <PageHero
        title="Support PUSAB"
        lede="Every contribution powers scholarships, medical camps and education for Bishwambarpur's students."
        crumbs={[{ label: "Home", to: "/" }, { label: "Support" }]}
        image={heroAbout}
        imageAlt="PUSAB community work"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          {/* Impact */}
          <div className="mb-12 grid gap-4 sm:grid-cols-3">
            {IMPACT.map((it, i) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-[var(--color-surface)] p-6"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white">
                  <it.Icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{it.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Ways to give */}
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl border border-border bg-[var(--color-surface)] p-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white">
                <HeartHandshake size={24} />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">Ways to give</h2>
              <p className="mt-2 text-muted-foreground">
                Send your contribution through any channel below, then let us know — we'll send a
                confirmation and keep you posted on the impact.
              </p>
              <div className="mt-6 space-y-3">
                {CHANNELS.map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-[var(--color-background)] p-4"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {c.label}
                      </p>
                      <p className="mt-0.5 truncate font-medium">{c.value}</p>
                    </div>
                    <button
                      onClick={() => copy(c.label, c.value)}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
                      aria-label="Copy"
                    >
                      {copied === c.label ? <Check size={15} className="text-[var(--color-accent-3)]" /> : <Copy size={15} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-3xl border border-border bg-[linear-gradient(135deg,var(--color-surface-2),var(--color-surface))] p-8">
              <h3 className="font-display text-xl font-bold">Prefer to sponsor a program?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Sponsor a scholarship, a medical camp, or SAYOR magazine — reach out and we'll tailor it.
              </p>
              <div className="mt-6">
                <GradientButton to="/contact">Talk to the team</GradientButton>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {SITE.email} · {SITE.phone}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
