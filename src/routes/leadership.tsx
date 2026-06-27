import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { committeeApi, optimizeImage } from "@/lib/api";
import { Crown, Gavel, GraduationCap, Users } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Executive Committee — PUSAB" },
      {
        name: "description",
        content: "The current PUSAB Executive Committee — leading the association this session.",
      },
      { property: "og:title", content: "Executive Committee — PUSAB" },
      {
        property: "og:description",
        content: "The current Executive Committee of PUSAB.",
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
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

const isPresident = (m: Member) => /president/i.test(m.role) && !/vice/i.test(m.role);
const isGS = (m: Member) =>
  /general secretary/i.test(m.role) || /^gs\b/i.test(m.role.trim());

function LeadCard({ m, label, Icon }: { m: Member; label: string; Icon: typeof Crown }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--color-accent-1)_35%,transparent)] bg-[var(--color-surface)] p-8 shadow-[0_20px_60px_-30px_rgba(29,78,216,0.35)] flex flex-col items-center text-center gap-5"
    >
      {/* Glow blob */}
      <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[var(--color-accent-1)] opacity-[0.08] blur-3xl" />

      {/* Role badge */}
      <div className="flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow">
        <Icon size={12} /> {label}
      </div>

      {/* Photo */}
      <div className="h-32 w-32 overflow-hidden rounded-2xl ring-4 ring-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)] shadow-[0_12px_40px_-16px_rgba(29,78,216,0.5)]">
        {m.photo_url ? (
          <img
            src={optimizeImage(m.photo_url, 300)}
            alt={m.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))]">
            <span className="text-3xl font-bold text-white select-none">{initials(m.name)}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="font-display text-2xl font-extrabold tracking-tight leading-tight">{m.name}</p>
        <p className="mt-1 text-sm font-semibold text-[var(--color-accent-1)]">{m.role}</p>
        {m.university && (
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <GraduationCap size={12} /> {m.university}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function MemberRow({ m, index }: { m: Member; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
      className="flex items-center justify-between gap-4 py-3.5 border-b border-border/60 last:border-0"
    >
      <div className="min-w-0">
        <p className="font-semibold leading-tight truncate">{m.name}</p>
        {m.university && (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">{m.university}</p>
        )}
      </div>
      <span className="shrink-0 rounded-full border border-[color-mix(in_oklab,var(--color-accent-1)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-1)_8%,transparent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-1)]">
        {m.role}
      </span>
    </motion.li>
  );
}

function EmptyCommittee() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-[var(--color-surface)] py-24 text-center">
      <Users size={36} className="text-[var(--color-accent-1)] opacity-40" />
      <p className="text-sm text-muted-foreground max-w-xs">
        The current committee will be listed here once records are added by the admin.
      </p>
    </div>
  );
}

function ExecutiveCommitteePage() {
  const [members, setMembers] = useState<Member[] | null>(null);

  useEffect(() => {
    committeeApi
      .listAll({ current: true })
      .then((rows) => setMembers(rows.map((m) => ({ ...m, id: String(m.id) }))))
      .catch(() => setMembers([]));
  }, []);

  const loading = members === null;
  const current = members ?? [];

  // Find current session year
  const sessionYear = current.length > 0 ? Math.max(...current.map((m) => m.year)) : null;
  const sessionMembers = sessionYear ? current.filter((m) => m.year === sessionYear) : current;

  const president = sessionMembers.find(isPresident) ?? null;
  const gs = sessionMembers.find(isGS) ?? null;
  const roster = sessionMembers
    .filter((m) => !isPresident(m) && !isGS(m))
    .sort((a, b) => a.role.localeCompare(b.role));

  return (
    <>
      <PageHero
        title="Executive Committee"
        lede="The current committee leading PUSAB this session — elected to serve, committed to the community."
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
          {/* Section heading */}
          <div className="mb-12 max-w-2xl">
            <p className="text-label mb-3" style={{ color: "var(--color-accent-2)" }}>
              Governance
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              {sessionYear ? `Session ${sessionYear}.` : "Current session."}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Elected by the members of PUSAB to lead the association, drive programmes, and serve
              the community of Bishwambarpur.
            </p>
          </div>

          {loading ? (
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {[0, 1].map((i) => (
                  <div key={i} className="h-72 animate-pulse rounded-3xl bg-[var(--color-surface)]" />
                ))}
              </div>
              <div className="h-64 animate-pulse rounded-3xl bg-[var(--color-surface)]" />
            </div>
          ) : current.length === 0 ? (
            <EmptyCommittee />
          ) : (
            <div className="space-y-10">
              {/* President + GS — large photo cards */}
              {(president || gs) && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {president && (
                    <LeadCard m={president} label="President" Icon={Crown} />
                  )}
                  {gs && (
                    <LeadCard m={gs} label="General Secretary" Icon={Gavel} />
                  )}
                </div>
              )}

              {/* Remaining members — text only */}
              {roster.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-border bg-[var(--color-surface)] px-6 py-6 sm:px-8"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-1)]">
                        Committee Members
                      </p>
                      <p className="font-display text-xl font-bold tracking-tight">
                        Full Roster
                      </p>
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {roster.length} members
                    </span>
                  </div>
                  <ul className="grid gap-x-8 sm:grid-cols-2">
                    {roster.map((m, i) => (
                      <MemberRow key={m.id} m={m} index={i} />
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
