import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { committeeApi, optimizeImage } from "@/lib/api";
import { Crown, Gavel, Award, GraduationCap } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";
import { ecOrdinal, sessionSpan } from "@/routes/ec.$year";

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
const isGS = (m: Member) => /^general secretary$/i.test(m.role.trim()) || /^gs$/i.test(m.role.trim());

function LeaderCard({
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex gap-5 rounded-2xl border border-border bg-[var(--color-surface)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)] hover:shadow-[0_24px_56px_-36px_rgba(29,78,216,0.45)]"
    >
      <div
        className="relative aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-xl sm:w-40"
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
      >
        {m.photo_url ? (
          <img
            src={optimizeImage(m.photo_url, 320)}
            alt={m.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-4xl font-bold text-white select-none">
            {initials(m.name)}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white"
          style={{ background: `linear-gradient(120deg, ${c1}, ${c2})` }}
        >
          <Icon size={11} /> {label}
        </span>
        <p className="mt-2.5 font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
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

function MissingSlot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-dashed border-border/70 bg-[color-mix(in_oklab,var(--color-surface)_60%,transparent)] p-5">
      <div className="grid aspect-[3/4] w-32 shrink-0 place-items-center rounded-xl border border-dashed border-border/60 sm:w-40">
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

export const Route = createFileRoute("/honor-board/$year")({
  head: ({ params }) => {
    const year = Number(params.year);
    const label = Number.isFinite(year) ? `${ecOrdinal(year)} EC (${sessionSpan(year)})` : "Honor Board";
    return {
      meta: [
        { title: `${label} — Honor Board — PUSAB` },
        { name: "description", content: `PUSAB Honor Board: President & General Secretary of the ${label}.` },
        { property: "og:title", content: `${label} — Honor Board — PUSAB` },
        { property: "og:url", content: `/honor-board/${params.year}` },
      ],
    };
  },
  component: HonorBoardYearPage,
});

function HonorBoardYearPage() {
  const { year } = Route.useParams();
  const yearNum = Number(year);
  const valid = Number.isFinite(yearNum);
  const label = valid ? `${ecOrdinal(yearNum)} Executive Committee` : "Executive Committee";
  const span = valid ? sessionSpan(yearNum) : "";

  const [members, setMembers] = useState<Member[] | null>(null);

  useEffect(() => {
    if (!valid) return;
    committeeApi
      .listAll({ year: yearNum })
      .then((rows) => setMembers(rows.map((m) => ({ ...m, id: String(m.id) }))))
      .catch(() => setMembers([]));
  }, [yearNum, valid]);

  const loading = members === null;
  const list = members ?? [];
  const president = list.find(isPresident) ?? null;
  const gs = list.find(isGS) ?? null;

  return (
    <>
      <PageHero
        title={`${label} Honor Board`}
        lede={valid ? `President & General Secretary of PUSAB during the ${span} session.` : "PUSAB Honor Board."}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Leadership" },
          { label: "Honor Board", to: "/honor-board" },
          { label: valid ? `${ecOrdinal(yearNum)} EC` : "EC" },
        ]}
        image={heroLeadership}
        imageAlt="PUSAB honor board"
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-14 max-w-2xl"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "var(--color-accent-2)" }}>
              Leadership Legacy
            </p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Session{" "}
              <span
                style={{
                  background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {span}
              </span>
              .
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The President and General Secretary who led PUSAB during this session.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-56 animate-pulse rounded-2xl bg-[var(--color-surface)]" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {president ? (
                <LeaderCard m={president} label="President" Icon={Crown} accent="1" delay={0} />
              ) : (
                <MissingSlot label="President" />
              )}
              {gs ? (
                <LeaderCard m={gs} label="General Secretary" Icon={Gavel} accent="2" delay={0.12} />
              ) : (
                <MissingSlot label="General Secretary" />
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
