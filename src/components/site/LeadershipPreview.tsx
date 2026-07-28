import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { leaderMessageApi, optimizeImage, type LeaderMessage } from "@/lib/api";
import { AnimatedHeading } from "@/components/site/AnimatedHeading";
import { useEffect, useState } from "react";

type Leaders = { president: LeaderMessage | null; secretary: LeaderMessage | null };

const CARDS: {
  role: "president" | "secretary";
  letter: string;
  accent: "1" | "2";
  roleLabel: string;
  to: string;
}[] = [
  { role: "president", letter: "P", accent: "1", roleLabel: "President", to: "/president-message" },
  { role: "secretary", letter: "S", accent: "2", roleLabel: "General Secretary", to: "/secretary-message" },
];

export function LeadershipPreview() {
  const [leaders, setLeaders] = useState<Leaders | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      leaderMessageApi.get("president").catch(() => null),
      leaderMessageApi.get("secretary").catch(() => null),
    ]).then(([president, secretary]) => {
      if (active) setLeaders({ president, secretary });
    });
    return () => {
      active = false;
    };
  }, []);

  if (leaders === null) return null;

  const populated = CARDS.filter((c) => leaders[c.role]?.name?.trim());
  if (populated.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="py-28 md:py-32"
    >
      <div className="container-page">
        <div className="mb-16 max-w-xl">
          <p className="text-label mb-3">Meet the people</p>
          <AnimatedHeading
            as="h2"
            className="font-display text-4xl md:text-5xl font-bold tracking-tight"
          >
            Our Leadership
          </AnimatedHeading>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
          {populated.map(({ role, letter, accent, roleLabel, to }) => {
            const msg = leaders[role]!;
            const c1 = accent === "1" ? "var(--color-accent-1)" : "var(--color-accent-2)";
            const c2 = accent === "1" ? "var(--color-accent-2)" : "var(--color-accent-1)";
            return (
              <Link
                key={role}
                to={to}
                className="group rounded-2xl border border-border bg-[var(--color-surface)] p-7 transition-all duration-300 hover:-translate-y-1"
                style={{ borderColor: `color-mix(in oklab, ${c1} 18%, var(--color-border, transparent))` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-16 w-16 shrink-0 overflow-hidden rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                  >
                    {msg.photo_url ? (
                      <img
                        src={optimizeImage(msg.photo_url, 200)}
                        alt={msg.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-xl font-bold text-white select-none">
                        {letter}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: c1 }}>
                      {roleLabel}
                    </p>
                    <p className="mt-1 font-display text-lg font-bold leading-tight truncate">
                      {msg.name}
                    </p>
                  </div>
                </div>

                {msg.quote?.trim() && (
                  <p className="mt-5 line-clamp-2 text-sm italic leading-relaxed text-muted-foreground">
                    "{msg.quote}"
                  </p>
                )}

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-1)]">
                  Read full message
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
