import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { committeeApi, optimizeImage } from "@/lib/api";
import { Crown, Gavel, GraduationCap, Users, Building2, Quote } from "lucide-react";
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

/* ── Premium editorial lead card ─────────────────────────────────────────── */
function LeadCard({
  m,
  label,
  Icon,
  accent,
  delay,
}: {
  m: Member;
  label: string;
  Icon: typeof Crown;
  accent: "1" | "2";
  delay: number;
}) {
  const c1 = accent === "1" ? "var(--color-accent-1)" : "var(--color-accent-2)";
  const c2 = accent === "1" ? "var(--color-accent-2)" : "var(--color-accent-1)";

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-[28px]"
      style={{
        background: "var(--color-surface)",
        border: "1px solid color-mix(in oklab, " + c1 + " 22%, transparent)",
        boxShadow: "0 30px 80px -40px color-mix(in oklab, " + c1 + " 55%, transparent)",
      }}
    >
      {/* Decorative corner gradient wash */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-[0.12] blur-3xl transition-opacity duration-500 group-hover:opacity-25"
        style={{ background: "radial-gradient(circle, " + c1 + ", transparent 70%)" }}
      />
      {/* Big watermark icon */}
      <Icon
        className="pointer-events-none absolute right-4 top-4 opacity-[0.06]"
        size={84}
        style={{ color: c1 }}
        strokeWidth={1.2}
      />

      {/* Photo band */}
      <div className="relative px-6 pt-6">
        <div
          className="relative mx-auto h-36 w-36 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
          style={{
            borderRadius: "22px",
            boxShadow: "0 24px 60px -22px color-mix(in oklab, " + c1 + " 60%, transparent)",
          }}
        >
          {m.photo_url ? (
            <img
              src={optimizeImage(m.photo_url, 440)}
              alt={m.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="grid h-full w-full place-items-center"
              style={{ background: "linear-gradient(135deg, " + c1 + ", " + c2 + ")" }}
            >
              <span className="text-4xl font-bold text-white select-none">{initials(m.name)}</span>
            </div>
          )}
          {/* Subtle gradient ring overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              borderRadius: "22px",
              boxShadow: "inset 0 0 0 3px color-mix(in oklab, " + c1 + " 35%, transparent)",
            }}
          />
        </div>

        {/* Floating role pill overlapping photo bottom */}
        <div className="relative z-10 -mt-3.5 flex justify-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white"
            style={{
              background: "linear-gradient(120deg, " + c1 + ", " + c2 + ")",
              boxShadow: "0 8px 22px -8px color-mix(in oklab, " + c1 + " 75%, transparent)",
            }}
          >
            <Icon size={11} /> {label}
          </span>
        </div>
      </div>

      {/* Identity */}
      <div className="px-6 pb-1 pt-4 text-center">
        <h3 className="font-display text-xl font-extrabold leading-tight tracking-tight text-foreground">
          {m.name}
        </h3>
        <p className="mt-0.5 text-sm font-semibold" style={{ color: c1 }}>
          {m.role}
        </p>
        {m.university && (
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <GraduationCap size={11} /> {m.university}
          </p>
        )}
      </div>

      {/* Editorial footer strip */}
      <div
        className="mt-4 flex items-center gap-2.5 px-6 py-3"
        style={{
          borderTop: "1px solid color-mix(in oklab, " + c1 + " 14%, transparent)",
          background: "color-mix(in oklab, " + c1 + " 5%, transparent)",
        }}
      >
        <Quote size={13} style={{ color: c1 }} className="shrink-0 opacity-70" />
        <p className="text-[11px] italic leading-snug text-muted-foreground">
          Serving PUSAB and the community this session.
        </p>
      </div>
    </motion.article>
  );
}

/* ── Clean text roster row ───────────────────────────────────────────────── */
function MemberRow({ m, index }: { m: Member; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, delay: Math.min(index, 12) * 0.03 }}
      className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent-1)_6%,transparent)]"
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
        style={{
          background: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))",
        }}
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
            <p
              className="mb-3 text-xs font-bold uppercase tracking-[0.22em]"
              style={{ color: "var(--color-accent-2)" }}
            >
              Governance
            </p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              {sessionYear ? (
                <>
                  Session{" "}
                  <span
                    style={{
                      background:
                        "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {sessionYear}
                  </span>
                  .
                </>
              ) : (
                "Current session."
              )}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Elected by the members of PUSAB to lead the association, drive programmes, and serve
              the community of Bishwambarpur.
            </p>
          </motion.div>

          {loading ? (
            <div className="space-y-8">
              <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-[28px] bg-[var(--color-surface)]"
                  />
                ))}
              </div>
            </div>
          ) : current.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-[var(--color-surface)] py-28 text-center">
              <Users size={44} className="opacity-20" style={{ color: "var(--color-accent-1)" }} />
              <p className="max-w-xs text-sm text-muted-foreground">
                The current committee will appear here once records are added by the admin.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* President + GS — premium editorial cards */}
              {(president || gs) && (
                <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
                  {president && (
                    <LeadCard m={president} label="President" Icon={Crown} accent="1" delay={0} />
                  )}
                  {gs && (
                    <LeadCard
                      m={gs}
                      label="General Secretary"
                      Icon={Gavel}
                      accent="2"
                      delay={0.12}
                    />
                  )}
                </div>
              )}

              {/* Full roster — clean text rows */}
              {roster.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden rounded-3xl border border-border"
                  style={{ background: "var(--color-surface)" }}
                >
                  <div
                    className="flex items-center justify-between gap-4 border-b border-border px-7 py-5"
                    style={{
                      background:
                        "color-mix(in oklab, var(--color-accent-1) 5%, var(--color-surface))",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-10 w-10 place-items-center rounded-xl text-white shadow"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))",
                        }}
                      >
                        <Users size={17} />
                      </div>
                      <div>
                        <p
                          className="text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: "var(--color-accent-1)" }}
                        >
                          Committee Members
                        </p>
                        <p className="font-display text-lg font-bold tracking-tight text-foreground">
                          Full Roster
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {roster.length} {roster.length === 1 ? "member" : "members"}
                    </span>
                  </div>

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
