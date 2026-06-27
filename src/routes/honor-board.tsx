import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { committeeApi, optimizeImage } from "@/lib/api";
import { Crown, Gavel, Award, ChevronDown } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/honor-board")({
  head: () => ({
    meta: [
      { title: "Honor Board — PUSAB" },
      {
        name: "description",
        content:
          "The PUSAB Honor Board — former Presidents & General Secretaries, year by year.",
      },
      { property: "og:title", content: "Honor Board — PUSAB" },
      {
        property: "og:description",
        content: "Honouring those who led PUSAB through the years.",
      },
      { property: "og:url", content: "/honor-board" },
    ],
    links: [{ rel: "canonical", href: "/honor-board" }],
  }),
  component: HonorBoardPage,
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

const isPresident = (m: Member) =>
  /president/i.test(m.role) && !/vice/i.test(m.role);

const isGS = (m: Member) =>
  /general secretary/i.test(m.role) || /^gs\b/i.test(m.role.trim());

function LeaderCard({
  m,
  label,
  accent,
  index,
}: {
  m: Member;
  label: string;
  accent: "1" | "2";
  index: number;
}) {
  const gradFrom = accent === "1" ? "var(--color-accent-1)" : "var(--color-accent-2)";
  const gradTo = accent === "1" ? "var(--color-accent-2)" : "var(--color-accent-1)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-[var(--color-surface)] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-30px_rgba(29,78,216,0.35)]"
      style={{
        borderColor: `color-mix(in oklab, ${gradFrom} 0%, var(--color-border))`,
      }}
    >
      {/* Photo */}
      <div
        className="h-24 w-24 overflow-hidden rounded-2xl ring-4 ring-[color-mix(in_oklab,var(--color-accent-1)_22%,transparent)]"
        style={{
          background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
        }}
      >
        {m.photo_url ? (
          <img
            src={optimizeImage(m.photo_url, 200)}
            alt={m.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-2xl font-bold text-white select-none">
            {initials(m.name)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 w-full">
        <p
          className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: gradFrom }}
        >
          {label}
        </p>
        <p className="font-display text-lg font-bold leading-tight">{m.name}</p>
        {m.university && (
          <p className="mt-1 text-xs text-muted-foreground leading-snug">{m.university}</p>
        )}
      </div>
    </motion.div>
  );
}

function YearSection({
  year,
  president,
  gs,
  idx,
}: {
  year: number;
  president: Member | null;
  gs: Member | null;
  idx: number;
}) {
  const [open, setOpen] = useState(idx === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(idx, 5) * 0.05 }}
      className="overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)]"
    >
      {/* Year header — clickable to collapse */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 sm:px-8 transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent-1)_4%,transparent)]"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white">
            <Crown size={16} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-1)]">
              Past Office-Bearers
            </p>
            <p className="font-display text-xl font-extrabold tracking-tight">
              Ex President &amp; General Secretary
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="rounded-full bg-[color-mix(in_oklab,var(--color-accent-1)_12%,transparent)] px-3 py-1 text-sm font-bold text-[var(--color-accent-1)]">
            Session {year}
          </span>
          <ChevronDown
            size={18}
            className={
              "text-muted-foreground transition-transform duration-300 " +
              (open ? "rotate-180" : "")
            }
          />
        </div>
      </button>

      {/* Cards */}
      {open && (
        <div className="border-t border-border px-6 pb-8 pt-6 sm:px-8">
          {president || gs ? (
            <div className="grid gap-6 sm:grid-cols-2 max-w-xl">
              {president && (
                <LeaderCard m={president} label="President" accent="1" index={0} />
              )}
              {gs && (
                <LeaderCard m={gs} label="General Secretary" accent="2" index={1} />
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Records for this session are being verified.
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

function HonorBoardPage() {
  const [members, setMembers] = useState<Member[] | null>(null);

  useEffect(() => {
    committeeApi
      .listAll()
      .then((rows) =>
        setMembers(rows.map((m) => ({ ...m, id: String(m.id) })))
      )
      .catch(() => setMembers([]));
  }, []);

  // Only past (non-current) members
  const past = (members ?? []).filter((m) => !m.is_current);

  // Group by year, newest first
  const byYear: Record<number, Member[]> = {};
  past.forEach((m) => (byYear[m.year] ||= []).push(m));
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  const loading = members === null;

  return (
    <>
      <PageHero
        title="Honor Board"
        lede="With gratitude to those who led PUSAB — the names that shaped the journey, session by session."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Leadership" },
          { label: "Honor Board" },
        ]}
        image={heroLeadership}
        imageAlt="PUSAB honor board"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <p
              className="text-label mb-3"
              style={{ color: "var(--color-accent-2)" }}
            >
              Leadership legacy
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Past office-bearers.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every session has been shaped by a President and General Secretary
              who gave their time and energy for Bishwambarpur. This board
              honours them all.
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-3xl bg-[var(--color-surface)]"
                />
              ))}
            </div>
          ) : years.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-[var(--color-surface)] py-20 text-center">
              <Award size={36} className="text-[var(--color-accent-1)] opacity-50" />
              <p className="text-sm text-muted-foreground">
                Records are being curated — names will appear here soon.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {years.map((year, idx) => {
                const list = byYear[year];
                const president = list.find(isPresident) ?? null;
                const gs = list.find(isGS) ?? null;
                return (
                  <YearSection
                    key={year}
                    year={year}
                    president={president}
                    gs={gs}
                    idx={idx}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
