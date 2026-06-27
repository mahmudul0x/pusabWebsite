import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { committeeApi, optimizeImage } from "@/lib/api";
import { Crown, Gavel, GraduationCap, Users, Building2 } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Executive Committee — PUSAB" },
      { name: "description", content: "The current PUSAB Executive Committee." },
      { property: "og:title", content: "Executive Committee — PUSAB" },
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

function LeadCard({ m, label, Icon, delay }: {
  m: Member; label: string; Icon: typeof Crown; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-3xl"
      style={{
        background: "linear-gradient(145deg, color-mix(in oklab, var(--color-accent-1) 12%, var(--color-surface)), var(--color-surface))",
        border: "1px solid color-mix(in oklab, var(--color-accent-1) 28%, transparent)",
        boxShadow: "0 24px 64px -32px color-mix(in oklab, var(--color-accent-1) 40%, transparent)",
      }}
    >
      {/* Accent top bar */}
      <div
        className="h-[3px] w-full shrink-0"
        style={{ background: "linear-gradient(90deg, var(--color-accent-1), var(--color-accent-2))" }}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--color-accent-1) 10%, transparent) 0%, transparent 70%)" }}
      />

      <div className="flex flex-col items-center gap-5 px-8 py-10 text-center">
        {/* Role pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white"
          style={{ background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))", boxShadow: "0 6px 20px -6px color-mix(in oklab, var(--color-accent-1) 70%, transparent)" }}
        >
          <Icon size={11} /> {label}
        </div>

        {/* Photo */}
        <div
          className="relative h-40 w-40 overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]"
          style={{
            borderRadius: "24px",
            boxShadow: "0 20px 56px -20px color-mix(in oklab, var(--color-accent-1) 55%, transparent)",
            outline: "3px solid color-mix(in oklab, var(--color-accent-1) 30%, transparent)",
            outlineOffset: "3px",
          }}
        >
          {m.photo_url ? (
            <img
              src={optimizeImage(m.photo_url, 360)}
              alt={m.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="grid h-full w-full place-items-center"
              style={{ background: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))" }}
            >
              <span className="text-4xl font-bold text-white select-none">{initials(m.name)}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <p className="font-display text-2xl font-extrabold tracking-tight text-foreground">{m.name}</p>
          <p className="text-sm font-semibold" style={{ color: "var(--color-accent-1)" }}>{m.role}</p>
          {m.university && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <GraduationCap size={11} /> {m.university}
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
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, delay: Math.min(index, 12) * 0.03 }}
      className="group flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3.5 transition-all hover:border-[color-mix(in_oklab,var(--color-accent-1)_20%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-accent-1)_5%,transparent)]"
    >
      {/* Index dot */}
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
        style={{ background: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))", opacity: 0.75 }}
      >
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-tight text-foreground truncate">{m.name}</p>
        {m.university && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground truncate">
            <Building2 size={10} /> {m.university}
          </p>
        )}
      </div>

      <span
        className="shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{
          background: "color-mix(in oklab, var(--color-accent-1) 10%, transparent)",
          color: "var(--color-accent-1)",
          border: "1px solid color-mix(in oklab, var(--color-accent-1) 25%, transparent)",
        }}
      >
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
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-14 max-w-2xl"
          >
            <p className="text-label mb-3 font-bold uppercase tracking-[0.2em] text-xs" style={{ color: "var(--color-accent-2)" }}>
              Governance
            </p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              {sessionYear ? `Session ${sessionYear}.` : "Current session."}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Elected by the members of PUSAB to lead the association, drive programmes, and serve
              the community of Bishwambarpur.
            </p>
          </motion.div>

          {loading ? (
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
                {[0, 1].map((i) => (
                  <div key={i} className="h-96 animate-pulse rounded-3xl bg-[var(--color-surface)]" />
                ))}
              </div>
              <div className="h-72 animate-pulse rounded-3xl bg-[var(--color-surface)]" />
            </div>
          ) : current.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-[var(--color-surface)] py-28 text-center">
              <Users size={44} className="opacity-20" style={{ color: "var(--color-accent-1)" }} />
              <p className="text-sm text-muted-foreground max-w-xs">
                The current committee will appear here once records are added by the admin.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* President + GS cards */}
              {(president || gs) && (
                <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
                  {president && <LeadCard m={president} label="President" Icon={Crown} delay={0} />}
                  {gs && <LeadCard m={gs} label="General Secretary" Icon={Gavel} delay={0.1} />}
                </div>
              )}

              {/* Full roster */}
              {roster.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden rounded-3xl border border-border"
                  style={{ background: "var(--color-surface)" }}
                >
                  {/* Roster header */}
                  <div
                    className="flex items-center justify-between gap-4 border-b border-border px-7 py-5"
                    style={{ background: "color-mix(in oklab, var(--color-accent-1) 5%, var(--color-surface))" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-10 w-10 place-items-center rounded-xl text-white shadow"
                        style={{ background: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))" }}
                      >
                        <Users size={17} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--color-accent-1)" }}>
                          Committee Members
                        </p>
                        <p className="font-display text-lg font-bold tracking-tight text-foreground">
                          Full Roster
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {roster.length} members
                    </span>
                  </div>

                  {/* Member list */}
                  <div className="px-3 py-3">
                    <ul className="grid gap-1 sm:grid-cols-2">
                      {roster.map((m, i) => (
                        <MemberRow key={m.id} m={m} index={i} />
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
