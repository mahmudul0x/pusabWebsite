import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { GradientButton } from "@/components/site/GradientButton";
import { felicitationApi, optimizeImage, type FelicitationEntry } from "@/lib/api";
import heroMoments from "@/assets/hero-moments.jpg";

export const Route = createFileRoute("/felicitation")({
  head: () => ({
    meta: [
      { title: "Felicitation & Freshers' Reception — PUSAB" },
      {
        name: "description",
        content:
          "PUSAB honours academic achievers and welcomes new students every year — কৃতি সংবর্ধনা ও নবীনবরণ.",
      },
      { property: "og:title", content: "Felicitation & Freshers' Reception — PUSAB" },
      {
        property: "og:description",
        content:
          "Celebrating merit and welcoming the next generation of Bishwambarpur's students.",
      },
      { property: "og:url", content: "/felicitation" },
    ],
    links: [{ rel: "canonical", href: "/felicitation" }],
  }),
  component: FelicitationPage,
});

function FelicitationPage() {
  const [entries, setEntries] = useState<FelicitationEntry[] | null>(null);
  useEffect(() => {
    felicitationApi
      .listAll()
      .then(setEntries)
      .catch(() => setEntries([]));
  }, []);

  // Group honourees by year (newest first).
  const byYear = new Map<number, FelicitationEntry[]>();
  (entries ?? []).forEach((e) => {
    const list = byYear.get(e.year) ?? [];
    list.push(e);
    byYear.set(e.year, list);
  });
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <>
      <PageHero
        title="Felicitation & Freshers'"
        lede="কৃতি সংবর্ধনা ও নবীনবরণ — every year PUSAB honours its achievers and welcomes new students into the family."
        crumbs={[{ label: "Home", to: "/" }, { label: "Felicitation & Freshers" }]}
        image={heroMoments}
        imageAlt="PUSAB felicitation and freshers' reception ceremony"
      />

      <section className="py-20 md:py-28">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <p className="text-label mb-3">One ceremony, two celebrations</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Honouring merit, welcoming the next generation.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Each year PUSAB brings achievers and new entrants onto one stage — recognising those
              who carry Bishwambarpur's name forward, and embracing those just beginning the journey.
            </p>
          </div>

          {/* Honourees — managed from the dashboard */}
          {years.length > 0 && (
            <div className="mt-16">
              <p className="text-label mb-6">Recognised over the years</p>
              <div className="space-y-10">
                {years.map((year) => (
                  <div key={year}>
                    <div className="mb-4 flex items-baseline gap-3">
                      <h3 className="font-display text-2xl font-extrabold tracking-tight">{year}</h3>
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {byYear.get(year)!.length} honoured
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {byYear.get(year)!.map((e, i) => (
                        <motion.div
                          key={e.id}
                          initial={{ opacity: 0, y: 18 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.04 }}
                          className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))]">
                            {e.image_url ? (
                              <img
                                src={optimizeImage(e.image_url, 480)}
                                alt={e.name}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            ) : (
                              <span className="absolute inset-0 grid place-items-center text-2xl font-bold text-white">
                                {e.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                            <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur">
                              {e.category === "achiever" ? "Achiever" : "Fresher"}
                            </span>
                          </div>
                          <div className="p-4">
                            <div className="truncate font-display font-bold leading-tight">{e.name}</div>
                            {e.title && (
                              <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                {e.title}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 relative overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] p-8 md:p-12">
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                  Be part of it
                </p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold leading-tight">
                  Got an achievement to share, or just joined? Reach out to take part.
                </h3>
              </div>
              <GradientButton to="/contact" variant="ghost" className="text-white! border-white/45!">
                <span className="inline-flex items-center gap-1.5">
                  Contact the team <ArrowUpRight size={16} />
                </span>
              </GradientButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
