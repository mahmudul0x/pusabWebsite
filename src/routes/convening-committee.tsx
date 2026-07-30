import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { committeeApi, optimizeImage } from "@/lib/api";
import { usePageHero } from "@/lib/usePageHero";
import { Users, GraduationCap, Star } from "lucide-react";
import heroLeadership from "@/assets/hero-pages.webp";

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

/* ── Lead card (Convenor / Member Secretary) — wide, matches Leadership page style ── */
function LeadCard({ m, index }: { m: Member; index: number }) {
  const accent = index === 0 ? "var(--color-accent-1)" : "var(--color-accent-2)";
  const accent2 = index === 0 ? "var(--color-accent-2)" : "var(--color-accent-1)";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group flex min-w-0 flex-1 items-center gap-5 rounded-2xl border border-border bg-[color-mix(in_oklab,var(--color-surface)_60%,transparent)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)] hover:shadow-[0_24px_56px_-36px_rgba(29,78,216,0.45)] sm:p-5"
    >
      <div
        className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl sm:w-32"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}
      >
        {m.photo_url ? (
          <img
            src={optimizeImage(m.photo_url, 320)}
            alt={m.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-3xl font-bold text-white select-none">
            {initials(m.name)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white"
          style={{ background: `linear-gradient(120deg, ${accent}, ${accent2})` }}
        >
          <Star size={11} className="fill-white" /> {m.role}
        </span>
        <p className="mt-2.5 truncate font-display text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
          {m.name}
        </p>
        {m.university && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <GraduationCap size={13} className="shrink-0" />
            <span className="truncate">{m.university}</span>
          </p>
        )}
      </div>
    </motion.article>
  );
}

/* ── Regular member card — no photo, larger presence ── */
function MemberRow({ m, index }: { m: Member; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 12) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)] hover:shadow-[0_18px_44px_-30px_rgba(29,78,216,0.4)]"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
        style={{
          background: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))",
        }}
      >
        {initials(m.name)}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-bold leading-tight tracking-tight text-foreground">
          {m.name}
        </p>
        {m.university && (
          <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <GraduationCap size={12} className="shrink-0" />
            <span className="truncate">{m.university}</span>
          </p>
        )}
        <span
          className="mt-1.5 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
          style={{
            background: "color-mix(in oklab, var(--color-accent-1) 10%, transparent)",
            color: "var(--color-accent-1)",
            border: "1px solid color-mix(in oklab, var(--color-accent-1) 25%, transparent)",
          }}
        >
          {m.role}
        </span>
      </div>
    </motion.li>
  );
}

function ConveningCommitteePage() {
  const hero = usePageHero("convening-committee");
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
        title={hero.title ?? "Convening Committee"}
        lede={
          hero.lede ??
          "The founding committee that established PUSAB on 30 July 2014 — the pioneers who started it all."
        }
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Leadership" },
          { label: "Convening Committee" },
        ]}
        image={hero.image ?? heroLeadership}
        imageAlt={hero.imageAlt ?? "PUSAB Convening Committee"}
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
              30 July 2014 to{" "}
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
          </motion.div>

          {loading ? (
            <div className="space-y-8">
              <div className="grid gap-5 sm:grid-cols-2">
                {[0, 1].map((i) => (
                  <div key={i} className="h-40 animate-pulse rounded-2xl bg-[var(--color-surface)]" />
                ))}
              </div>
              <div className="h-72 animate-pulse rounded-3xl bg-[var(--color-surface)]" />
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
              {/* Convenor & Member Secretary — wide lead cards */}
              {leads.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {leads.map((m, i) => (
                    <LeadCard key={m.id} m={m} index={i} />
                  ))}
                </div>
              )}

              {/* Remaining founders — roster list, no photos */}
              {rest.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden rounded-3xl border border-border shadow-[0_32px_64px_-48px_rgba(29,78,216,0.35)]"
                  style={{ background: "var(--color-surface)" }}
                >
                  <div
                    className="flex items-center justify-between gap-4 border-b border-border px-7 py-5"
                    style={{
                      background: "color-mix(in oklab, var(--color-accent-1) 5%, var(--color-surface))",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-10 w-10 place-items-center rounded-xl text-white shadow"
                        style={{
                          background: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))",
                        }}
                      >
                        <Users size={17} />
                      </div>
                      <div>
                        <p
                          className="text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: "var(--color-accent-1)" }}
                        >
                          Founding Members
                        </p>
                        <p className="font-display text-lg font-bold tracking-tight text-foreground">
                          Full Roster
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {rest.length} {rest.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div className="p-5 sm:p-7">
                    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
