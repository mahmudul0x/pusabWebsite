import { motion } from "framer-motion";
import { optimizeImage } from "@/lib/api";
import { useCurrentMembers, useMembersByYear } from "@/lib/useCommittee";
import { Crown, Gavel, GraduationCap, Users, Building2 } from "lucide-react";

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
  /^general secretary$/i.test(m.role.trim()) || /^gs$/i.test(m.role.trim());

/* ── Lead card (President / GS) ── */
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: "var(--color-surface)",
        border: "1px solid color-mix(in oklab, " + c1 + " 30%, transparent)",
        boxShadow: "0 20px 52px -34px color-mix(in oklab, " + c1 + " 55%, transparent)",
      }}
    >
      <div
        className="h-[3px] w-full shrink-0"
        style={{ background: "linear-gradient(90deg, " + c1 + ", " + c2 + ")" }}
      />
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{ background: "linear-gradient(135deg, " + c1 + ", " + c2 + ")" }}
      >
        {m.photo_url ? (
          <img
            src={optimizeImage(m.photo_url, 320)}
            alt={m.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-4xl font-bold text-white select-none">
            {initials(m.name)}
          </span>
        )}
        <span
          className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur"
          style={{ background: "linear-gradient(120deg, " + c1 + ", " + c2 + ")" }}
        >
          <Icon size={9} /> {label}
        </span>
      </div>
      <div className="p-3 text-center">
        <p className="font-display text-sm font-bold leading-tight text-foreground truncate">
          {m.name}
        </p>
        {m.university && (
          <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
            <GraduationCap size={10} className="shrink-0" />
            <span className="truncate">{m.university}</span>
          </p>
        )}
      </div>
    </motion.article>
  );
}

/* ── Roster row ── */
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

/**
 * Renders one session's committee (President + GS cards, then roster).
 * Pass `year` for a specific session, or omit to show the current session.
 */
export function CommitteeView({
  year,
  eyebrow = "Governance",
  blurb = "Elected by the members of PUSAB to lead the association, drive programmes, and serve the community of Bishwambarpur.",
}: {
  year?: number;
  eyebrow?: string;
  blurb?: string;
}) {
  const yearQuery = useMembersByYear(year!);
  const currentQuery = useCurrentMembers();
  const { data, isLoading } = year != null ? yearQuery : currentQuery;

  const loading = isLoading;
  const list = (data ?? []).map((m) => ({ ...m, id: String(m.id) }));
  const sessionYear = year ?? (list.length > 0 ? Math.max(...list.map((m) => m.year)) : null);
  const sessionMembers = sessionYear ? list.filter((m) => m.year === sessionYear) : list;
  const president = sessionMembers.find(isPresident) ?? null;
  const gs = sessionMembers.find(isGS) ?? null;
  const roster = sessionMembers
    .filter((m) => !isPresident(m) && !isGS(m))
    .sort((a, b) => a.role.localeCompare(b.role));

  return (
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
            {eyebrow}
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
          <p className="mt-4 leading-relaxed text-muted-foreground">{blurb}</p>
        </motion.div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-[28px] bg-[var(--color-surface)]" />
            ))}
          </div>
        ) : sessionMembers.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-[var(--color-surface)] py-28 text-center">
            <Users size={44} className="opacity-20" style={{ color: "var(--color-accent-1)" }} />
            <p className="max-w-xs text-sm text-muted-foreground">
              This committee will appear here once records are added by the admin.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {(president || gs) && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {president && (
                  <LeadCard m={president} label="President" Icon={Crown} accent="1" delay={0} />
                )}
                {gs && (
                  <LeadCard m={gs} label="General Secretary" Icon={Gavel} accent="2" delay={0.12} />
                )}
              </div>
            )}

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
  );
}
