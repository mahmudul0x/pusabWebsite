import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { committeeApi, optimizeImage } from "@/lib/api";
import { Users, GraduationCap, Star } from "lucide-react";
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

function MemberCard({ m, index }: { m: Member; index: number }) {
  const isLead = /convenor|member secretary/i.test(m.role);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 10) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex items-center gap-4 rounded-2xl border border-border bg-[var(--color-surface)] px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)] hover:shadow-[0_16px_40px_-28px_rgba(29,78,216,0.4)]"
    >
      {/* Photo */}
      <div
        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl"
        style={{
          background: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))",
          boxShadow: "0 8px 24px -10px color-mix(in oklab, var(--color-accent-1) 50%, transparent)",
        }}
      >
        {m.photo_url ? (
          <img
            src={optimizeImage(m.photo_url, 160)}
            alt={m.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-sm font-bold text-white select-none">
            {initials(m.name)}
          </span>
        )}
        {isLead && (
          <div className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--color-accent-2)] shadow">
            <Star size={9} className="text-white fill-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-tight text-foreground truncate">{m.name}</p>
        {m.university && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground truncate">
            <GraduationCap size={11} className="shrink-0" /> {m.university}
          </p>
        )}
      </div>

      {/* Role badge */}
      <span
        className="shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{
          background: isLead
            ? "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))"
            : "color-mix(in oklab, var(--color-accent-1) 10%, transparent)",
          color: isLead ? "white" : "var(--color-accent-1)",
          border: isLead ? "none" : "1px solid color-mix(in oklab, var(--color-accent-1) 25%, transparent)",
        }}
      >
        {m.role}
      </span>
    </motion.article>
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

  // Sort: Convenor first, Member Secretary second, then rest alphabetically
  const sorted = [...list].sort((a, b) => {
    const rank = (r: string) =>
      /convenor/i.test(r) ? 0 : /member secretary/i.test(r) ? 1 : 2;
    return rank(a.role) - rank(b.role) || a.name.localeCompare(b.name);
  });

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
              Founding Legacy
            </p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              30 July –{" "}
              <span
                style={{
                  background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                27 Sep 2014.
              </span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Before any executive committee, there was a convening committee — a group of dedicated
              students who formally founded PUSAB and laid the groundwork for everything that
              followed. This page honours their contribution.
            </p>
          </motion.div>

          {loading ? (
            <div className="space-y-3 max-w-2xl">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-[var(--color-surface)]" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-[var(--color-surface)] py-24 text-center">
              <Users size={40} className="opacity-20" style={{ color: "var(--color-accent-1)" }} />
              <p className="max-w-xs text-sm text-muted-foreground">
                Convening committee members will appear here once added by the admin.
              </p>
            </div>
          ) : (
            <div className="max-w-2xl space-y-3">
              {sorted.map((m, i) => (
                <MemberCard key={m.id} m={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
