import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MapPin, CalendarClock, Clock, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { GradientButton } from "@/components/site/GradientButton";
import { PROGRAMS } from "@/lib/site-content";
import { useProgramEvents, statusOf, type Status } from "@/lib/usePrograms";
import heroPrograms from "@/assets/hero-programs.jpg";

const STATUS_META: Record<Status, { label: string; Icon: typeof CalendarClock; chip: string }> = {
  upcoming: {
    label: "Upcoming",
    Icon: CalendarClock,
    chip: "border-transparent bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white",
  },
  ongoing: {
    label: "Ongoing",
    Icon: Clock,
    chip: "border-[color-mix(in_oklab,var(--color-accent-3)_45%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-3)_14%,transparent)] text-[var(--color-accent-3)]",
  },
  completed: {
    label: "Completed",
    Icon: CheckCircle2,
    chip: "border-border bg-background/50 text-muted-foreground",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const program = PROGRAMS.find((p) => p.key === params.slug);
    if (!program) throw notFound();
    return program;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — PUSAB` },
          { name: "description", content: loaderData.desc },
          { property: "og:title", content: `${loaderData.title} — PUSAB` },
          { property: "og:description", content: loaderData.desc },
          { property: "og:url", content: `/programs/${loaderData.key}` },
        ]
      : [],
    links: [{ rel: "canonical", href: `/programs/${loaderData?.key ?? ""}` }],
  }),
  component: ProgramDetailPage,
});

function ProgramDetailPage() {
  const program = Route.useLoaderData();
  const { events, now } = useProgramEvents();

  const related = program.category
    ? events.filter((e) => e.category.toLowerCase() === program.category.toLowerCase())
    : [];

  return (
    <>
      <PageHero
        title={program.title}
        lede={program.desc}
        crumbs={[{ label: "Home", to: "/" }, { label: "Programs", to: "/programs" }, { label: program.title }]}
        image={heroPrograms}
        imageAlt={program.title}
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="mb-12 max-w-2xl">
            <p className="text-label mb-3">About this program</p>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
              {program.title}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{program.desc}</p>
          </div>

          {related.length > 0 && (
            <div className="mb-16">
              <p className="text-label mb-6">Related activity</p>
              <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {related.map((e) => {
                    const status = statusOf(e, now);
                    const sm = STATUS_META[status];
                    const Icon = e.Icon;
                    return (
                      <motion.li
                        key={e.id}
                        layout
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--color-accent-1)_35%,transparent)]"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          {e.image ? (
                            <img
                              src={e.image}
                              alt={e.title}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))]">
                              <Icon size={32} className="text-white/85" />
                            </div>
                          )}
                          <span
                            className={
                              "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur " +
                              sm.chip
                            }
                          >
                            <sm.Icon size={11} /> {sm.label}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="font-display text-lg font-semibold leading-tight">{e.title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                            {e.desc}
                          </p>
                          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={11} /> {e.location}
                            </span>
                            {e.date && <span>{formatDate(e.date)}</span>}
                            {e.recurrence && <span>{e.recurrence}</span>}
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            </div>
          )}

          {/* CTA */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] p-8 md:p-12">
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                  Get involved
                </p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold leading-tight">
                  Want to take part in {program.title}? Reach out to the team.
                </h3>
              </div>
              <GradientButton to="/contact" variant="ghost" className="text-white! border-white/45!">
                <span className="inline-flex items-center gap-1.5">
                  Contact the team <ArrowUpRight size={16} />
                </span>
              </GradientButton>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/programs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to all programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
