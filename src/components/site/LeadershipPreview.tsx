import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Quote } from "lucide-react";
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

        <div className="space-y-6">
          {populated.map(({ role, letter, accent, roleLabel, to }, i) => {
            const msg = leaders[role]!;
            const c1 = accent === "1" ? "var(--color-accent-1)" : "var(--color-accent-2)";
            const c2 = accent === "1" ? "var(--color-accent-2)" : "var(--color-accent-1)";
            const imageOnRight = i % 2 === 1;

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
                  className="group grid overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1 md:grid-cols-2"
                  style={{ borderColor: `color-mix(in oklab, ${c1} 18%, var(--color-border, transparent))` }}
                >
                  {/* Photo */}
                  <div
                    className={
                      "relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:min-h-[320px] " +
                      (imageOnRight ? "md:order-2" : "")
                    }
                  >
                    {msg.photo_url ? (
                      <img
                        src={optimizeImage(msg.photo_url, 900)}
                        alt={msg.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 grid place-items-center"
                        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                      >
                        <span className="text-7xl font-bold text-white select-none">{letter}</span>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div
                    className={
                      "relative flex flex-col justify-center p-8 md:p-12 " +
                      (imageOnRight ? "md:order-1" : "")
                    }
                    style={{ background: `color-mix(in oklab, ${c1} 5%, var(--color-surface))` }}
                  >
                    <Quote
                      className="absolute right-6 top-6 opacity-[0.06] md:right-8 md:top-8"
                      size={90}
                      strokeWidth={1}
                      style={{ color: c1 }}
                    />
                    <p className="relative text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: c1 }}>
                      {roleLabel}
                    </p>
                    <p className="relative mt-2 font-display text-2xl md:text-3xl font-bold leading-tight">
                      {msg.name}
                    </p>

                    {msg.quote?.trim() && (
                      <p className="relative mt-5 line-clamp-3 font-display text-lg italic leading-relaxed text-foreground/85">
                        "{msg.quote}"
                      </p>
                    )}

                    <span
                      className="relative mt-7 inline-flex w-fit items-center gap-1.5 text-sm font-semibold"
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
