import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { committeeApi, optimizeImage } from "@/lib/api";
import { Users, GraduationCap, Star, Landmark } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/convening-committee")({
  head: () => ({
    meta: [
      { title: "Convening Committee — PUSAB" },
      { name: "description", content: "The founding Convening Committee of PUSAB (2014)." },
      { property: "og:title", content: "Convening Committee — PUSAB" },
      { property: "og:url", content: "/convening-committee" },
    ],
    links: [{ rel: "canonical", href: "/convening-committee" }],
  }),
  component: ConveningCommitteePage,
});

type Member = {
  id: string;
  name: string;
  role: string;
  university: string | null;
  year: number;
  is_current: boolean;
  is_convening: boolean;
  photo_url: string | null;
};

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

const isLead = (m: Member) => /convenor|member secretary/i.test(m.role);

/* ── Lead card (Convenor / Member Secretary) ── */
function LeadCard({ m, index }: { m: Member; index: number }) {
  const accent = index === 0 ? "var(--color-accent-1)" : "var(--color-accent-2)";
  const accent2 = index === 0 ? "var(--color-accent-2)" : "var(--color-accent-1)";

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[28px]"
      style={{
        background: "var(--color-surface)",
        border: `1px solid color-mix(in oklab, ${accent} 22%, transparent)`,
        boxShadow: `0 28px 72px -36px color-mix(in oklab, ${accent} 50%, transparent)`,
      }}
    >
      {/* Top gradient bar */}
      <div
        className="h-[3px] w-full shrink-0"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent2})` }}
      />

      {/* Corner ambient glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-[0.1] blur-3xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
      />

      <div className="flex flex-col items-center gap-4 px-6 pt-7 pb-6 text-center">
        {/* Role pill */}
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white"
          style={{
            background: `linear-gradient(120deg, ${accent}, ${accent2})`,
            boxShadow: `0 8px 20px -8px color-mix(in oklab, ${accent} 70%, transparent)`,
          }}
        >
          <Star size={10} className="fill-white" /> {m.role}
        </span>

        {/* Photo */}
        <div
          className="relative aspect-square w-full overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
          style={{
            borderRadius: "20px",
            background: `linear-gradient(135deg, ${accent}, ${accent2})`,
            boxShadow: `0 18px 48px -20px color-mix(in oklab, ${accent} 60%, transparent)`,
          }}
        >
          {m.photo_url ? (
            <img
              src={optimizeImage(m.photo_url, 500)}
              alt={m.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-5xl font-bold text-white select-none">
              {initials(m.name)}
            </span>
          )}
          {/* Inset ring */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              borderRadius: "20px",
              boxShadow: `inset 0 0 0 3px color-mix(in oklab, ${accent} 35%, transparent)`,
            }}
          />
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="font-display text-xl font-extrabold leading-tight tracking-tight text-foreground">
            {m.name}
          </p>
          {m.university && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <GraduationCap size={12} /> {m.university}
            </p>
          )}
        </div>
      </div>

      {/* Footer strip */}
      <div
        className="flex items-center gap-2 px-7 py-3"
        style={{
          borderTop: `1px solid color-mix(in oklab, ${accent} 14%, transparent)`,
          background: `color-mix(in oklab, ${accent} 5%, transparent)`,
        }}
      >
        <Landmark size={12} style={{ color: accent }} className="shrink-0 opacity-70" />
        <p className="text-[11px] italic text-muted-foreground">
          Founding member · PUSAB 2014
        </p>
      </div>
    </motion.article>
  );
}

/* ── Regular member card ── */
function MemberRow({ m, index }: { m: Member; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 12) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-[var(--color-background)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--color-accent-2)_30%,transparent)] hover:shadow-[0_18px_44px_-30px_rgba(29,78,216,0.4)]"
    >
      {/* Photo — square */}
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))" }}
      >
        {m.photo_url ? (
          <img
            src={optimizeImage(m.photo_url, 280)}
            alt={m.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-3xl font-bold text-white select-none">
            {initials(m.name)}
          </span>
        )}
        {/* Role badge — floating on photo */}
        <span
          className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur"
          style={{
            background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))",
          }}
        >
          {m.role}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 text-center">
        <p className="font-display text-sm font-bold leading-tight text-foreground truncate">{m.name}</p>
        {m.university && (
          <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
            <GraduationCap size={10} className="shrink-0" />
            <span className="truncate">{m.university}</span>
          </p>
        )}
      </div>
    </motion.li>
  );
}

function ConveningCommitteePage() {
  const [members, setMembers] = useState<Member[] | null>(null);

  useEffect(() => {
    committeeApi
      .listAll({ convening: true })
      .then((rows) => setMembers(rows.map((m) => ({ ...m, id: String(m.id) }))))
      .catch(() => setMembers([]));
  }, []);

  const loading = members === null;
  const list = members ?? [];

  const leads = list
    .filter(isLead)
    .sort((a, b) => {
      const rank = (r: string) => (/convenor/i.test(r) ? 0 : 1);
      return rank(a.role) - rank(b.role);
    });

  const rest = list
    .filter((m) => !isLead(m))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHero
        title="Convening Committee"
        lede="The founding committee that established PUSAB on 30 July 2014 — the pioneers who started it all."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Leadership" },
          { label: "Convening Committee" },
        ]}
        image={heroLeadership}
        imageAlt="PUSAB Convening Committee"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          {/* Section heading */}
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
              Founding Legacy
            </p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              30 July –{" "}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                27 Sep 2014.
              </span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Before any executive committee, there was a convening committee — a group of
              dedicated students who formally founded PUSAB and laid the groundwork for
              everything that followed.
            </p>
          </motion.div>

          {loading ? (
            <div className="space-y-8">
              <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
                {[0, 1].map((i) => (
                  <div key={i} className="h-72 animate-pulse rounded-[28px] bg-[var(--color-surface)]" />
                ))}
              </div>
              <div className="h-48 animate-pulse rounded-3xl bg-[var(--color-surface)]" />
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-[var(--color-surface)] py-24 text-center">
              <Users size={40} className="opacity-20" style={{ color: "var(--color-accent-1)" }} />
              <p className="max-w-xs text-sm text-muted-foreground">
                Convening committee members will appear here once added by the admin.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Lead cards — Convenor + Member Secretary */}
              {leads.length > 0 && (
                <div
                  className={
                    "grid gap-6 " +
                    (leads.length === 1
                      ? "sm:max-w-sm"
                      : leads.length === 2
                        ? "sm:grid-cols-2 lg:max-w-3xl"
                        : leads.length === 3
                          ? "sm:grid-cols-2 lg:grid-cols-3"
                          : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")
                  }
                >
                  {leads.map((m, i) => (
                    <LeadCard key={m.id} m={m} index={i} />
                  ))}
                </div>
              )}

              {/* Members roster */}
              {rest.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden rounded-3xl border border-border"
                  style={{ background: "var(--color-surface)" }}
                >
                  {/* Roster header */}
                  <div
                    className="flex items-center justify-between gap-4 border-b border-border px-7 py-5"
                    style={{
                      background:
                        "color-mix(in oklab, var(--color-accent-2) 5%, var(--color-surface))",
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
                        <Users size={16} />
                      </div>
                      <div>
                        <p
                          className="text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: "var(--color-accent-2)" }}
                        >
                          Founding Members
                        </p>
                        <p className="font-display text-lg font-bold tracking-tight text-foreground">
                          Committee Members
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {rest.length} {rest.length === 1 ? "member" : "members"}
                    </span>
                  </div>

                  {/* Member list */}
                  <div className="p-5">
                    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {rest.map((m, i) => (
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
