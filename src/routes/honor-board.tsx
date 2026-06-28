import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { committeeApi, optimizeImage } from "@/lib/api";
import { Crown, Gavel, Award, ChevronDown, GraduationCap } from "lucide-react";
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

/** Format a session year as a span, e.g. 2022 -> "2022-23". */
function sessionLabel(year: number) {
  const next = String((year + 1) % 100).padStart(2, "0");
  return `${year}-${next}`;
}

const isPresident = (m: Member) =>
  /president/i.test(m.role) && !/vice/i.test(m.role);

const isGS = (m: Member) =>
  /general secretary/i.test(m.role) || /^gs\b/i.test(m.role.trim());

function LeaderCard({
  m,
  label,
  Icon,
  accent,
  index,
}: {
  m: Member;
  label: string;
  Icon: typeof Crown;
  accent: "1" | "2";
  index: number;
}) {
  const c1 = accent === "1" ? "var(--color-accent-1)" : "var(--color-accent-2)";
  const c2 = accent === "1" ? "var(--color-accent-2)" : "var(--color-accent-1)";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex gap-5 rounded-2xl border border-border bg-[var(--color-surface)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)] hover:shadow-[0_24px_56px_-36px_rgba(29,78,216,0.45)]"
    >
      {/* Photo — fixed portrait, consistent across all members */}
      <div
        className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-xl sm:w-32"
        style={{ background: "linear-gradient(135deg, " + c1 + ", " + c2 + ")" }}
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

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white"
          style={{ background: "linear-gradient(120deg, " + c1 + ", " + c2 + ")" }}
        >
          <Icon size={11} /> {label}
        </span>
        <p className="mt-2.5 font-display text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
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

/* Subtle placeholder so a lone card never leaves the row lopsided. */
function MissingSlot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-dashed border-border/70 bg-[color-mix(in_oklab,var(--color-surface)_60%,transparent)] p-5">
      <div className="grid aspect-[3/4] w-28 shrink-0 place-items-center rounded-xl border border-dashed border-border/60 sm:w-32">
        <Award size={28} className="opacity-15" style={{ color: "var(--color-accent-1)" }} />
      </div>
      <div className="min-w-0 flex-1">
        <span className="inline-flex w-fit items-center rounded-md border border-dashed border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        <p className="mt-2.5 text-sm leading-snug text-muted-foreground">
          Record for this session is being verified.
        </p>
      </div>
    </div>
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
        <div className="flex items-center gap-4">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow"
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))",
            }}
          >
            <Award size={20} />
          </div>
          <div className="text-left">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: "var(--color-accent-1)" }}
            >
              Past Office-Bearers
            </p>
            <p className="font-display text-2xl font-extrabold leading-none tracking-tight">
              Session {sessionLabel(year)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ex President &amp; General Secretary
            </p>
          </div>
        </div>
        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors"
          style={{
            background: open
              ? "color-mix(in oklab, var(--color-accent-1) 12%, transparent)"
              : "color-mix(in oklab, var(--color-accent-1) 6%, transparent)",
          }}
        >
          <ChevronDown
            size={17}
            className={"transition-transform duration-300 " + (open ? "rotate-180" : "")}
            style={{ color: "var(--color-accent-1)" }}
          />
        </div>
      </button>

      {/* Cards */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-6 pb-7 pt-6 sm:px-8">
              {president || gs ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  {president && (
                    <LeaderCard m={president} label="President" Icon={Crown} accent="1" index={0} />
                  )}
                  {gs && (
                    <LeaderCard m={gs} label="General Secretary" Icon={Gavel} accent="2" index={1} />
                  )}
                  {/* Placeholder when one office-bearer is missing — keeps the row balanced */}
                  {(!president || !gs) && (
                    <MissingSlot label={!president ? "President" : "General Secretary"} />
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Records for this session are being verified.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
