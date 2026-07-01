import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  GraduationCap, Stethoscope, Users,
  Copy, Check, Landmark, Smartphone,
  HeartHandshake, ChevronRight, ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { SITE } from "@/lib/site-content";
import heroAbout from "@/assets/hero-about.jpg";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Donation — PUSAB" },
      {
        name: "description",
        content:
          "Support PUSAB's scholarships, medical camps and education drives. Donate via bank transfer, bKash or Nagad.",
      },
      { property: "og:title", content: "Donation — PUSAB" },
      { property: "og:url", content: "/support" },
    ],
    links: [{ rel: "canonical", href: "/support" }],
  }),
  component: SupportPage,
});

const BANK = {
  name: "Public University Students' Association of Bishwambarpur (PUSAB)",
  account: "3707-0311169947",
  routing: "035900191",
  swift: "BKBABDDH",
  bank: "Bangladesh Krishi Bank",
  branch: "Bishwambarpur Branch, Sunamganj",
};

const MOBILE = [
  { id: "bkash", label: "bKash", number: "01521792924", coming: false },
  { id: "nagad", label: "Nagad", number: "01521792924", coming: false },
];

const IMPACT = [
  { Icon: GraduationCap, title: "Scholarships",    desc: "Fund a deserving student's university journey." },
  { Icon: Stethoscope,   title: "Medical Camps",   desc: "Free healthcare for remote village communities." },
  { Icon: Users,         title: "Education Drives",desc: "Tutoring, mentoring and admission guidance." },
];

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (key: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
  };
  return { copied, copy };
}

function CopyBtn({
  id, value, copied, onCopy,
}: { id: string; value: string; copied: string | null; onCopy: (id: string, v: string) => void }) {
  const done = copied === id;
  return (
    <button
      onClick={() => onCopy(id, value)}
      aria-label="Copy"
      className={
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all " +
        (done
          ? "border-green-500/30 bg-green-500/8 text-green-500"
          : "border-border text-muted-foreground hover:border-[var(--color-accent-1)]/50 hover:text-[var(--color-accent-1)]")
      }
    >
      {done ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function SupportPage() {
  const { copied, copy } = useCopy();

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[72vh] min-h-[520px] max-h-[820px] w-full overflow-hidden bg-background">
        <img src={heroAbout} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-32 md:top-36 left-0 right-0 z-10">
          <div className="container-page">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-foreground">Donation</span>
            </nav>
          </div>
        </div>

        {/* Text */}
        <div className="absolute inset-0 flex items-end pb-20 md:pb-24 z-10">
          <div className="container-page">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <p className="text-label mb-4" style={{ color: "var(--color-accent-1)" }}>
                Support our mission
              </p>
              <h1 className="font-display text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                Donate to PUSAB
              </h1>
              <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
                Your contribution directly funds scholarships, medical camps and education drives
                for public university students from Bishwambarpur.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Impact row ── */}
      <section className="border-y border-border bg-[var(--color-surface)]">
        <div className="container-page">
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {IMPACT.map((it, i) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="flex items-start gap-4 px-6 py-8 md:px-8"
              >
                <div
                  className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))" }}
                >
                  <it.Icon size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{it.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{it.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="mb-12">
            <p className="text-label mb-2" style={{ color: "var(--color-accent-1)" }}>
              Payment details
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
              Make a donation
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Choose any channel below. After sending, let us know and we'll confirm your donation.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-12">

            {/* ── Bank card ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-7 rounded-3xl border border-border bg-[var(--color-surface)] overflow-hidden shadow-sm"
            >
              {/* header */}
              <div className="flex items-center gap-3 border-b border-border px-6 py-5">
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))" }}
                >
                  <Landmark size={18} />
                </div>
                <div>
                  <p className="font-display font-bold">Bank Transfer</p>
                  <p className="text-xs text-muted-foreground">Direct deposit · Savings Account</p>
                </div>
              </div>

              {/* A/C name — single full row */}
              <div className="flex items-center justify-between gap-4 border-b border-border bg-[var(--color-background)] px-6 py-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Account Name</p>
                  <p className="mt-0.5 text-sm font-semibold leading-snug">{BANK.name}</p>
                </div>
                <CopyBtn id="name" value={BANK.name} copied={copied} onCopy={copy} />
              </div>

              {/* Fields — 2 per row */}
              <div className="grid grid-cols-2 divide-x divide-y divide-border border-b border-border">
                {[
                  { id: "ac",      label: "SB A/C Number", value: BANK.account },
                  { id: "routing", label: "Routing Number", value: BANK.routing },
                  { id: "swift",   label: "Swift Code",     value: BANK.swift   },
                  { id: "bank",    label: "Bank",           value: BANK.bank    },
                ].map(({ id, label, value }) => (
                  <div key={id} className="flex items-center justify-between gap-2 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                      <p className="mt-0.5 truncate font-mono text-sm font-semibold">{value}</p>
                    </div>
                    <CopyBtn id={id} value={value} copied={copied} onCopy={copy} />
                  </div>
                ))}
              </div>

              {/* Branch — full width */}
              <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Branch</p>
                  <p className="mt-0.5 text-sm font-semibold">{BANK.branch}</p>
                </div>
                <CopyBtn id="branch" value={BANK.branch} copied={copied} onCopy={copy} />
              </div>
            </motion.div>

            {/* RIGHT column */}
            <div className="md:col-span-5 flex flex-col gap-5">

              {/* ── Mobile money card ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="rounded-3xl border border-border bg-[var(--color-surface)] overflow-hidden shadow-sm"
              >
                <div className="flex items-center gap-3 border-b border-border px-6 py-5">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))" }}
                  >
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <p className="font-display font-bold">Mobile Money</p>
                    <p className="text-xs text-muted-foreground">bKash · Nagad (Personal)</p>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {MOBILE.map((ch) => (
                    <div key={ch.id} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{ch.label}</p>
                        <p className="mt-0.5 font-mono text-sm font-semibold">{ch.number}</p>
                        {ch.coming && (
                          <span className="mt-1 inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                            Coming soon
                          </span>
                        )}
                      </div>
                      <CopyBtn id={ch.id} value={ch.number} copied={copied} onCopy={copy} />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ── Sponsor CTA ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.14 }}
                className="rounded-3xl border border-border bg-[var(--color-surface)] p-7 shadow-sm"
              >
                <div
                  className="grid h-10 w-10 place-items-center rounded-xl text-white mb-4"
                  style={{ background: "linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))" }}
                >
                  <HeartHandshake size={18} />
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight">Sponsor a program</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Fund a full scholarship, a medical camp, or SAYOR magazine.
                  Reach out and we'll tailor a package for you.
                </p>
                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ color: "var(--color-accent-1)" }}
                >
                  Talk to the team <ArrowRight size={14} />
                </Link>
              </motion.div>

              {/* ── Contact ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="rounded-2xl border border-border bg-[var(--color-surface)] px-6 py-5"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  After donating, contact us
                </p>
                <div className="space-y-1.5">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="block text-sm font-medium hover:underline"
                    style={{ color: "var(--color-accent-1)" }}
                  >
                    {SITE.email}
                  </a>
                  <p className="text-sm text-muted-foreground">{SITE.phone}</p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
