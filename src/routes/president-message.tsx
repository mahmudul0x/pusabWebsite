import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { Quote } from "lucide-react";
import { leaderMessageApi, optimizeImage, type LeaderMessage } from "@/lib/api";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/president-message")({
  head: () => ({
    meta: [
      { title: "President's Message — PUSAB" },
      {
        name: "description",
        content: "A message from the President of PUSAB — vision, values and the road ahead.",
      },
      { property: "og:title", content: "President's Message — PUSAB" },
      { property: "og:description", content: "A message from the President of PUSAB." },
      { property: "og:url", content: "/president-message" },
    ],
    links: [{ rel: "canonical", href: "/president-message" }],
  }),
  component: PresidentMessagePage,
});

function PresidentMessagePage() {
  const [msg, setMsg] = useState<LeaderMessage | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    leaderMessageApi
      .get("president")
      .then(setMsg)
      .catch(() => setMsg(null))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <LeaderMessageView
      msg={msg}
      loaded={loaded}
      fallbackName="[President Name]"
      roleLabel="Current President"
      headerLabel="Message from the President"
      pageTitle="President's Message"
      lede="A word from the President of PUSAB — on purpose, people, and the path ahead."
      crumbLabel="President's Message"
      letter="P"
      accent="1"
    />
  );
}

/* ── Shared view, used by both President & Secretary message pages ── */
export function LeaderMessageView({
  msg,
  loaded,
  fallbackName,
  roleLabel,
  headerLabel,
  pageTitle,
  lede,
  crumbLabel,
  letter,
  accent,
}: {
  msg: LeaderMessage | null;
  loaded: boolean;
  fallbackName: string;
  roleLabel: string;
  headerLabel: string;
  pageTitle: string;
  lede: string;
  crumbLabel: string;
  letter: string;
  accent: "1" | "2";
}) {
  const c1 = accent === "1" ? "var(--color-accent-1)" : "var(--color-accent-2)";
  const c2 = accent === "1" ? "var(--color-accent-2)" : "var(--color-accent-1)";

  const name = msg?.name?.trim() || fallbackName;
  const designation = msg?.designation?.trim() || "";
  const session = msg?.session?.trim() || "";
  const quote = msg?.quote?.trim() || "";
  const paragraphs = (msg?.body || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <PageHero
        title={pageTitle}
        lede={lede}
        crumbs={[{ label: "Home", to: "/" }, { label: "Leadership" }, { label: crumbLabel }]}
        image={heroLeadership}
        imageAlt={pageTitle}
      />

      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-3xl border bg-[var(--color-surface)]"
              style={{
                borderColor: `color-mix(in oklab, ${c1} 28%, transparent)`,
                boxShadow: `0 32px 80px -42px color-mix(in oklab, ${c1} 45%, transparent)`,
              }}
            >
              {/* Top accent bar */}
              <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}
              />

              <div className="grid gap-0 md:grid-cols-[280px_1fr]">
                {/* Left — photo + identity */}
                <div
                  className="flex flex-col items-center gap-5 border-b border-border p-8 md:border-b-0 md:border-r md:p-10"
                  style={{ background: `color-mix(in oklab, ${c1} 5%, var(--color-surface))` }}
                >
                  <div
                    className="h-40 w-40 overflow-hidden rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${c1}, ${c2})`,
                      boxShadow: `0 16px 40px -16px color-mix(in oklab, ${c1} 55%, transparent)`,
                    }}
                  >
                    {msg?.photo_url ? (
                      <img
                        src={optimizeImage(msg.photo_url, 360)}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-4xl font-bold text-white select-none">
                        {letter}
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.22em]"
                      style={{ color: c1 }}
                    >
                      {roleLabel}
                    </p>
                    <p className="mt-2 font-display text-xl font-bold leading-tight">{name}</p>
                    {designation && (
                      <p className="mt-1 text-sm text-muted-foreground">{designation}</p>
                    )}
                    {session && (
                      <p className="mt-0.5 text-xs text-muted-foreground/70">{session}</p>
                    )}
                  </div>

                  <div className="mt-auto hidden md:block">
                    <Quote
                      size={40}
                      style={{ color: `color-mix(in oklab, ${c1} 20%, transparent)` }}
                    />
                  </div>
                </div>

                {/* Right — message */}
                <div className="p-8 md:p-12">
                  <p
                    className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em]"
                    style={{ color: c2 }}
                  >
                    {headerLabel}
                  </p>

                  {!loaded ? (
                    <div className="space-y-4">
                      <div className="h-8 w-3/4 animate-pulse rounded bg-[var(--color-background)]" />
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-4 w-full animate-pulse rounded bg-[var(--color-background)]"
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      {quote && (
                        <blockquote
                          className="mb-8 border-l-2 pl-5"
                          style={{ borderColor: c1 }}
                        >
                          <p className="font-display text-xl font-semibold leading-snug text-foreground md:text-2xl">
                            "{quote}"
                          </p>
                        </blockquote>
                      )}

                      <div className="space-y-5 text-[15px] leading-[1.8] text-foreground/85">
                        {paragraphs.map((p, i) => (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
                          >
                            {p}
                          </motion.p>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
