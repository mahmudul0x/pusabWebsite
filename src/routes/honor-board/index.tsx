import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { optimizeImage } from "@/lib/api";
import { useAllMembers } from "@/lib/useCommittee";
import { Crown, Gavel, Award, GraduationCap } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/honor-board/")({
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

const FOUNDING_YEAR = 2014;

const ORDINAL_WORDS = [
  "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth",
  "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth",
];

/** "2014" -> "First EC (Session 2014-15)" */
function ecSessionLabel(year: number) {
  const n = year - FOUNDING_YEAR + 1;
  const word = ORDINAL_WORDS[n - 1] ?? `${n}th`;
  return `${word} EC (Session ${sessionLabel(year)})`;
}

const isPresident = (m: Member) =>
  /president/i.test(m.role) && !/vice/i.test(m.role);

const isGS = (m: Member) =>
  /general secretary/i.test(m.role) || /^gs\b/i.test(m.role.trim());

/* One office-bearer photo + name — large, premium card treatment. */
function LeaderMini({
  m,
  label,
  Icon,
  accent,
}: {
  m: Member;
  label: string;
  Icon: typeof Crown;
  accent: "1" | "2";
}) {
  const c1 = accent === "1" ? "var(--color-accent-1)" : "var(--color-accent-2)";
  const c2 = accent === "1" ? "var(--color-accent-2)" : "var(--color-accent-1)";

  return (
    <div className="group flex min-w-0 flex-1 items-center gap-5 rounded-2xl border border-border bg-[color-mix(in_oklab,var(--color-surface)_60%,transparent)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)] hover:shadow-[0_24px_56px_-36px_rgba(29,78,216,0.45)] sm:p-5">
      <div
        className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl sm:w-32"
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
      <div className="min-w-0">
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white"
          style={{ background: "linear-gradient(120deg, " + c1 + ", " + c2 + ")" }}
        >
          <Icon size={11} /> {label}
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
    </div>
  );
}

function MissingMini({ label }: { label: string }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-5 rounded-2xl border border-dashed border-border/70 bg-[color-mix(in_oklab,var(--color-surface)_50%,transparent)] p-4 sm:p-5">
      <div className="grid aspect-[3/4] w-24 shrink-0 place-items-center rounded-xl border border-dashed border-border/60 sm:w-32">
        <Award size={26} className="opacity-15" style={{ color: "var(--color-accent-1)" }} />
      </div>
      <div className="min-w-0">
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

function SessionRow({
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(idx, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      id={`year-${year}`}
      className="rounded-3xl border border-border bg-[var(--color-surface)] p-6 scroll-mt-28 sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <span
          className="inline-flex w-fit items-center rounded-lg border-2 px-3 py-1.5 font-display text-sm font-extrabold uppercase tracking-tight sm:text-base"
          style={{
            borderColor: "var(--color-accent-1)",
            color: "var(--color-accent-1)",
          }}
        >
          {ecSessionLabel(year)}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {president || gs ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {president ? (
            <LeaderMini m={president} label="President" Icon={Crown} accent="1" />
          ) : (
            <MissingMini label="President" />
          )}
          {gs ? (
            <LeaderMini m={gs} label="General Secretary" Icon={Gavel} accent="2" />
          ) : (
            <MissingMini label="General Secretary" />
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Records for this session are being verified.
        </p>
      )}
    </motion.div>
  );
}

function HonorBoardPage() {
  const { data, isLoading } = useAllMembers();
  const members = data ?? [];

  // Only past (non-current) members
  const past = members.map((m) => ({ ...m, id: String(m.id) })).filter((m) => !m.is_current);

  // Group by year, oldest first
  const byYear: Record<number, Member[]> = {};
  past.forEach((m) => (byYear[m.year] ||= []).push(m));
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => a - b);

  const loading = isLoading;

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
            <div className="space-y-3">
              {years.map((year, idx) => {
                const list = byYear[year];
                const president = list.find(isPresident) ?? null;
                const gs = list.find(isGS) ?? null;
                return (
                  <SessionRow
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
