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

        <div className="grid gap-6 sm:grid-cols-2">
          {populated.map(({ role, letter, accent, roleLabel, to }, i) => {
            const msg = leaders[role]!;
            const c1 = accent === "1" ? "var(--color-accent-1)" : "var(--color-accent-2)";
            const c2 = accent === "1" ? "var(--color-accent-2)" : "var(--color-accent-1)";
            return (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={to}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1.5"
                  style={{ borderColor: `color-mix(in oklab, ${c1} 18%, var(--color-border, transparent))` }}
                >
                  {/* Large photo banner */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {msg.photo_url ? (
                      <img
                        src={optimizeImage(msg.photo_url, 800)}
                        alt={msg.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 grid place-items-center"
                        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                      >
                        <span className="text-6xl font-bold text-white select-none">{letter}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p
                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90"
                        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
                      >
                        {roleLabel}
                      </p>
                      <p className="mt-1.5 font-display text-2xl md:text-3xl font-bold leading-tight text-white">
                        {msg.name}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    {msg.quote?.trim() && (
                      <p className="flex-1 line-clamp-3 font-display text-base italic leading-relaxed text-foreground/85">
                        "{msg.quote}"
                      </p>
                    )}

                    <span
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold"
                      style={{ color: c1 }}
                    >
                      Read full message
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
