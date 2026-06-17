import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Sparkles } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — PUSAB" },
      { name: "description", content: "Meet the present Executive Committee and explore past ECs and the PUSAB Honor Board." },
      { property: "og:title", content: "Leadership — PUSAB" },
      { property: "og:description", content: "Present and past Executive Committees and PUSAB Honor Board." },
      { property: "og:url", content: "/leadership" },
    ],
    links: [{ rel: "canonical", href: "/leadership" }],
  }),
  component: LeadershipPage,
});

type Member = { id: string; name: string; role: string; university: string | null; year: number; is_current: boolean; photo_url: string | null };

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

const PLACEHOLDER_ROLES = ["Vice President", "General Secretary", "Treasurer", "Organizing Secretary"];

function MemberPortrait({ m, size = "md" }: { m: Member; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-20 w-20 text-xl" : size === "sm" ? "h-10 w-10 text-xs" : "h-14 w-14 text-base";
  return (
    <div
      className={
        "shrink-0 rounded-full grid place-items-center text-white font-semibold overflow-hidden " +
        "bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] " +
        "ring-2 ring-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)] " +
        dim
      }
    >
      {m.photo_url ? (
        <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(m.name)}</span>
      )}
    </div>
  );
}

function LeadershipPage() {
  const [members, setMembers] = useState<Member[] | null>(null);
  useEffect(() => {
    supabase
      .from("ec_members")
      .select("id,name,role,university,year,is_current,photo_url")
      .order("year", { ascending: false })
      .then(({ data }) => setMembers((data as Member[] | null) ?? []));
  }, []);

  const current = members?.filter((m) => m.is_current) ?? [];
  const past = members?.filter((m) => !m.is_current) ?? [];
  const byYear: Record<number, Member[]> = {};
  past.forEach((m) => { (byYear[m.year] ||= []).push(m); });
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  const featured = current.find((m) => /president/i.test(m.role) && !/vice/i.test(m.role)) ?? current[0];
  const rest = current.filter((m) => m !== featured);

  return (
    <>
      <PageHero title="Leadership" lede="Meet the present Executive Committee and look back at the leaders who built PUSAB." crumbs={[{ label: "Home", to: "/" }, { label: "Leadership" }]} image={heroLeadership} imageAlt="PUSAB executive committee" />

      {/* Current EC — bento */}
      <section className="pb-16">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-6 border-b border-border pb-4">
            <div>
              <p className="text-label mb-2" style={{ color: "var(--color-accent-2)" }}>Governance</p>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">Current Executive Committee</h2>
            </div>
            <span className="hidden sm:block text-xs uppercase tracking-[0.2em] text-muted-foreground">Session · {new Date().getFullYear()}</span>
          </div>

          {members === null ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[160px]">
              <div className="md:col-span-2 md:row-span-2 rounded-3xl border border-border shimmer" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[160px]">
              {/* Featured leader / president */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)] bg-[linear-gradient(135deg,var(--color-surface-2),var(--color-surface))] p-8 flex flex-col justify-end min-h-[400px] hover:border-[color-mix(in_oklab,var(--color-accent-1)_55%,transparent)] transition-colors"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,color-mix(in_oklab,var(--color-accent-1)_40%,transparent),transparent_55%),radial-gradient(circle_at_80%_80%,color-mix(in_oklab,var(--color-accent-2)_35%,transparent),transparent_55%)]" />
                <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
                <div className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 backdrop-blur px-3 py-1">
                  <Crown size={12} className="text-[var(--color-accent-1)]" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/85">{featured ? "President" : "Presidential Office"}</span>
                </div>

                {featured ? (
                  <div className="relative z-20 space-y-4">
                    <MemberPortrait m={featured} size="lg" />
                    <div className="w-12 h-1 rounded-full bg-[var(--color-accent-1)]" />
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">{featured.name}</h3>
                      <p className="mt-1 text-[var(--color-accent-1)] text-sm font-semibold uppercase tracking-[0.18em]">{featured.role}</p>
                      {featured.university && <p className="mt-2 text-foreground/60 text-sm">{featured.university}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="relative z-20 space-y-3">
                    <div className="w-12 h-1 rounded-full bg-[var(--color-accent-1)]" />
                    <h3 className="font-display text-3xl font-bold text-foreground/30">Presidential Office</h3>
                    <p className="text-foreground/45 italic max-w-md">No current members on record yet. Nominations for the upcoming term will be announced shortly.</p>
                  </div>
                )}
              </motion.div>

              {/* Rest of EC or placeholder roles */}
              {(rest.length > 0
                ? rest.slice(0, 4).map((m, i) => ({ kind: "member" as const, m, i }))
                : PLACEHOLDER_ROLES.map((role, i) => ({ kind: "placeholder" as const, role, i }))
              ).map((slot) => (
                <motion.div
                  key={slot.kind === "member" ? slot.m.id : slot.role}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: 0.06 * (slot.i + 1) }}
                  className="rounded-2xl border border-border bg-[color-mix(in_oklab,var(--color-surface)_92%,transparent)] backdrop-blur-sm p-6 flex flex-col justify-between gap-3 hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] transition-colors"
                >
                  {slot.kind === "member" ? (
                    <>
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-1)]">{slot.m.role}</span>
                      <div className="flex items-center gap-3">
                        <MemberPortrait m={slot.m} size="sm" />
                        <div className="min-w-0">
                          <p className="font-display font-semibold truncate">{slot.m.name}</p>
                          {slot.m.university && <p className="text-xs text-muted-foreground truncate">{slot.m.university}</p>}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-1)]">{slot.role}</span>
                      <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-white/5 rounded" />
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Through the years — timeline */}
      <section className="py-16">
        <div className="container-page">
          <div className="mb-10">
            <p className="text-label mb-2" style={{ color: "var(--color-accent-2)" }}>Legacy</p>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">Through the years</h2>
          </div>

          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--color-accent-1)] via-border to-transparent" />

            {years.length === 0 ? (
              <div className="relative pl-10">
                <div className="absolute -left-[1px] top-1.5 w-4 h-4 rounded-full border-4 border-background bg-[var(--color-accent-1)] shadow-[0_0_15px_color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]" />
                <div className="space-y-4">
                  <span className="font-display text-xl md:text-2xl font-bold block">Archive being curated</span>
                  <div className="p-6 md:p-8 rounded-2xl bg-[color-mix(in_oklab,var(--color-surface)_60%,transparent)] border border-dashed border-border flex items-center gap-3">
                    <Sparkles size={16} className="text-[var(--color-accent-1)] shrink-0" />
                    <p className="text-sm text-foreground/60">
                      Past EC archives will appear here as historical records are digitized and verified.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12 pl-10">
                {years.map((year, yi) => (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: yi * 0.05 }}
                    className="relative group"
                  >
                    <div className="absolute -left-[37px] top-2 w-4 h-4 rounded-full border-4 border-background bg-[var(--color-accent-1)] shadow-[0_0_15px_color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] transition-transform group-hover:scale-125" />
                    <div className="space-y-4">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">{year}</span>
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{byYear[Number(year)].length} members</span>
                      </div>
                      <div className="rounded-2xl border border-border bg-[var(--color-surface)] p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {byYear[Number(year)].map((m) => (
                            <div key={m.id} className="flex items-center gap-3 min-w-0">
                              <MemberPortrait m={m} size="sm" />
                              <div className="min-w-0 text-sm">
                                <div className="font-medium truncate">{m.name}</div>
                                <div className="text-muted-foreground text-xs truncate">{m.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}