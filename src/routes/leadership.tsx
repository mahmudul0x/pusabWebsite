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
      { property: "og:description", content: "The current Executive Committee of PUSAB." },
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

function LeadCard({
  m,
  label,
  Icon,
  delay,
}: {
  m: Member;
  label: string;
  Icon: typeof Crown;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)] bg-[var(--color-surface)]"
    >
      {/* Top gradient strip */}
      <div className="h-1 w-full bg-[linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2))]" />

      <div className="flex flex-col items-center gap-6 px-8 py-10 text-center">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[var(--color-accent-1)] opacity-[0.07] blur-3xl" />

        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_-8px_rgba(29,78,216,0.6)]">
          <Icon size={12} /> {label}
        </span>

        {/* Photo */}
        <div className="relative h-36 w-36">
          <div className="h-full w-full overflow-hidden rounded-[22px] shadow-[0_16px_48px_-16px_rgba(29,78,216,0.45)] ring-4 ring-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)]">
            {m.photo_url ? (
              <img
                src={optimizeImage(m.photo_url, 320)}
                alt={m.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))]">
                <span className="text-4xl font-bold text-white select-none">{initials(m.name)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="font-display text-2xl font-extrabold tracking-tight">{m.name}</p>
          <p className="text-sm font-semibold text-[var(--color-accent-1)]">{m.role}</p>
          {m.university && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <GraduationCap size={12} />
              {m.university}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MemberRow({ m, index }: { m: Member; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, delay: Math.min(index, 10) * 0.03 }}
      className="flex items-center justify-between gap-4 py-3.5 border-b border-border/50 last:border-0"
    >
      <div className="min-w-0">
        <p className="font-semibold leading-tight truncate">{m.name}</p>
        {m.university && (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">{m.university}</p>
        )}
      </div>
      <span className="shrink-0 rounded-full border border-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-1)_7%,transparent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-accent-1)]">
        {m.role}
      </span>
    </motion.li>
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
                  <div key={i} className="h-80 animate-pulse rounded-3xl bg-[var(--color-surface)]" />
                ))}
              </div>
              <div className="h-64 animate-pulse rounded-3xl bg-[var(--color-surface)]" />
            </div>
          ) : current.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-[var(--color-surface)] py-24 text-center">
              <Users size={40} className="text-[var(--color-accent-1)] opacity-30" />
              <p className="text-sm text-muted-foreground max-w-xs">
                The current committee will appear here once records are added.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* President + GS */}
              {(president || gs) && (
                <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
                  {president && <LeadCard m={president} label="President" Icon={Crown} delay={0} />}
                  {gs && <LeadCard m={gs} label="General Secretary" Icon={Gavel} delay={0.08} />}
                </div>
              )}

              {/* Remaining members */}
              {roster.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-border bg-[var(--color-surface)] px-6 py-7 sm:px-8"
                >
                  <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white shadow">
                      <Users size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent-1)]">
                        Committee Members
                      </p>
                      <p className="font-display text-lg font-bold tracking-tight">Full Roster</p>
                    </div>
                    <span className="ml-auto rounded-full bg-[var(--color-background)] px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {roster.length} members
                    </span>
                  </div>
                  <ul className="grid gap-x-10 sm:grid-cols-2">
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
