import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Gavel, Sparkles } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Executive Committee — PUSAB" },
      {
        name: "description",
        content:
          "The PUSAB Executive Committee — the present session and the full history of past committees.",
      },
      { property: "og:title", content: "Executive Committee — PUSAB" },
      {
        property: "og:description",
        content: "Present and past Executive Committees of PUSAB, session by session.",
      },
      { property: "og:url", content: "/leadership" },
    ],
    links: [{ rel: "canonical", href: "/leadership" }],
  }),
  component: ExecutiveCommitteePage,
});

type Member = {
  id: string;
  name: string;
  role: string;
  university: string | null;
  year: number;
  is_current: boolean;
  photo_url: string | null;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const isPresident = (m: Member) => /president/i.test(m.role) && !/vice/i.test(m.role);
const isGS = (m: Member) => /general secretary/i.test(m.role) || /^gs\b/i.test(m.role.trim());

function LeadPortrait({ m, label }: { m: Member; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] ring-2 ring-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)]">
        {m.photo_url ? (
          <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center text-xl font-semibold text-white">
            {initials(m.name)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-1)]">
          {label}
        </p>
        <p className="mt-1 font-display text-lg font-bold leading-tight">{m.name}</p>
        <p className="text-sm text-muted-foreground">{m.role}</p>
        {m.university && <p className="text-xs text-muted-foreground/80">{m.university}</p>}
      </div>
    </div>
  );
}

function ExecutiveCommitteePage() {
  const [members, setMembers] = useState<Member[] | null>(null);
  useEffect(() => {
    supabase
      .from("ec_members")
      .select("id,name,role,university,year,is_current,photo_url")
      .order("year", { ascending: false })
      .then(({ data }) => setMembers((data as Member[] | null) ?? []));
  }, []);

  // Group into committees by session year (newest first).
  const byYear: Record<number, Member[]> = {};
  (members ?? []).forEach((m) => (byYear[m.year] ||= []).push(m));
  const sessions = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <>
      <PageHero
        title="Executive Committee"
        lede="The present committee and the full line of those who served before — session by session."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Leadership" },
          { label: "Executive Committee" },
        ]}
        image={heroLeadership}
        imageAlt="PUSAB executive committee"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <p className="text-label mb-3" style={{ color: "var(--color-accent-2)" }}>
              Governance
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Committee history.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Each session is led by a President and General Secretary, supported by the full
              committee below.
            </p>
          </div>

          {members === null ? (
            <div className="space-y-6">
              {[0, 1].map((i) => (
                <div key={i} className="h-64 rounded-3xl border border-border shimmer" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-[var(--color-surface)] p-12 text-center">
              <Sparkles size={28} className="mx-auto mb-4 text-[var(--color-accent-1)]" />
              <p className="text-muted-foreground">
                Committee records are being curated. Past and present committees will appear here
                soon.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {sessions.map((year, idx) => {
                const list = byYear[year];
                const current = list.some((m) => m.is_current);
                const president = list.find(isPresident);
                const gs = list.find(isGS);
                const roster = [...list].sort((a, b) => a.role.localeCompare(b.role));
                return (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: Math.min(idx, 4) * 0.05 }}
                    className={
                      "overflow-hidden rounded-3xl border bg-[var(--color-surface)] " +
                      (current
                        ? "border-[color-mix(in_oklab,var(--color-accent-1)_40%,transparent)] shadow-[0_28px_60px_-40px_rgba(29,78,216,0.55)]"
                        : "border-border")
                    }
                  >
                    {/* Session header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-5 sm:px-8">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
                          Session {year}
                        </span>
                        {current && (
                          <span className="rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {list.length} members
                      </span>
                    </div>

                    {/* President + GS with photos */}
                    <div className="grid gap-6 border-b border-border px-6 py-7 sm:grid-cols-2 sm:px-8">
                      {president ? (
                        <LeadPortrait m={president} label="President" />
                      ) : (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Crown size={18} className="text-[var(--color-accent-1)]" /> President — on
                          record soon
                        </div>
                      )}
                      {gs ? (
                        <LeadPortrait m={gs} label="General Secretary" />
                      ) : (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Gavel size={18} className="text-[var(--color-accent-1)]" /> General
                          Secretary — on record soon
                        </div>
                      )}
                    </div>

                    {/* Full roster: name + designation */}
                    <div className="px-6 py-6 sm:px-8">
                      <p className="text-label mb-4">Committee members</p>
                      <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                        {roster.map((m) => (
                          <li
                            key={m.id}
                            className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2"
                          >
                            <span className="font-medium">{m.name}</span>
                            <span className="shrink-0 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                              {m.role}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
