import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { DEMO_EC_MEMBERS } from "@/lib/site-content";
import { committeeApi } from "@/lib/api";
import { Gavel, Crown, Award } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/honor-board")({
  head: () => ({
    meta: [
      { title: "Honor Board — PUSAB" },
      {
        name: "description",
        content:
          "The PUSAB Honor Board — former Convenors & Member Secretaries, and former Presidents & General Secretaries.",
      },
      { property: "og:title", content: "Honor Board — PUSAB" },
      {
        property: "og:description",
        content: "Honouring those who founded and led PUSAB through the years.",
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

const isConvenorOrMemberSecretary = (m: Member) =>
  /convenor|convener/i.test(m.role) || /member secretary/i.test(m.role);
const isPresidentOrGS = (m: Member) =>
  (/president/i.test(m.role) && !/vice/i.test(m.role)) ||
  /general secretary/i.test(m.role) ||
  /^gs\b/i.test(m.role.trim());

function HonorCard({ m, index }: { m: Member; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.05 }}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-[var(--color-surface)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] ring-2 ring-[color-mix(in_oklab,var(--color-accent-1)_22%,transparent)]">
        {m.photo_url ? (
          <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center font-semibold text-white">
            {initials(m.name)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-display text-lg font-bold leading-tight">{m.name}</p>
        <p className="text-sm text-[var(--color-accent-1)]">{m.role}</p>
        <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Session {m.year}
          {m.university ? ` · ${m.university}` : ""}
        </p>
      </div>
    </motion.div>
  );
}

function Section({
  Icon,
  kicker,
  title,
  members,
}: {
  Icon: typeof Crown;
  kicker: string;
  title: string;
  members: Member[];
}) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white shadow-lg">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-1)]">
            {kicker}
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        </div>
      </div>
      {members.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-[var(--color-surface)] p-8 text-center text-sm text-muted-foreground">
          Records are being curated — names will be added here soon.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <HonorCard key={m.id} m={m} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function HonorBoardPage() {
  const [apiMembers, setApiMembers] = useState<Member[] | null>(null);
  useEffect(() => {
    committeeApi
      .listAll()
      .then((rows) => setApiMembers(rows.map((m) => ({ ...m, id: String(m.id) }))))
      .catch(() => setApiMembers([]));
  }, []);
  const members: Member[] = apiMembers && apiMembers.length > 0 ? apiMembers : DEMO_EC_MEMBERS;

  // The honor board lists former office-bearers.
  const past = members.filter((m) => !m.is_current);
  const convenors = past.filter(isConvenorOrMemberSecretary);
  const presidents = past.filter(isPresidentOrGS);

  return (
    <>
      <PageHero
        title="Honor Board"
        lede="With gratitude to those who founded and led PUSAB — the names that shaped the journey."
        crumbs={[{ label: "Home", to: "/" }, { label: "Leadership" }, { label: "Honor Board" }]}
        image={heroLeadership}
        imageAlt="PUSAB honor board"
      />

      <section className="py-16 md:py-24">
        <div className="container-page space-y-16">
          <Section
            Icon={Gavel}
            kicker="Founding leadership"
            title="Ex Convenor & Member Secretary"
            members={convenors}
          />
          <Section
            Icon={Crown}
            kicker="Past office-bearers"
            title="Ex President & General Secretary"
            members={presidents}
          />

          {convenors.length === 0 && presidents.length === 0 && (
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Award size={16} className="text-[var(--color-accent-1)]" />
              The honor board will fill in as historical records are verified.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
