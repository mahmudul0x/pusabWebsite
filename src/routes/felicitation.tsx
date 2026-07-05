import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { programPagesApi, type ProgramPage } from "@/lib/api";
import { FelicitationPage } from "@/components/site/FelicitationPage";
import heroLeadership from "@/assets/hero-leadership.jpg";

const FALLBACK_TITLE = "Felicitation & Freshers Reception";
const FALLBACK_DESC =
  "A memorable gathering to honor the outstanding achievers and warmly welcome the newest members to the PUSAB family.";

export const Route = createFileRoute("/felicitation")({
  loader: async () => {
    try {
      const page = await programPagesApi.get("felicitation");
      return { page };
    } catch {
      return { page: null };
    }
  },
  head: ({ loaderData }) => {
    const title = loaderData?.page?.title ?? FALLBACK_TITLE;
    const desc = loaderData?.page?.tagline || FALLBACK_DESC;
    return {
      meta: [
        { title: `${title} — PUSAB` },
        { name: "description", content: desc },
        { property: "og:title", content: `${title} — PUSAB` },
        { property: "og:description", content: desc },
        { property: "og:url", content: "/felicitation" },
      ],
      links: [{ rel: "canonical", href: "/felicitation" }],
    };
  },
  component: FelicitationRoute,
});

function FelicitationRoute() {
  const { page: initialPage } = Route.useLoaderData();
  const [page, setPage] = useState<ProgramPage | null>(initialPage);
  const [loadingYear, setLoadingYear] = useState(false);
  const years = page?.years ?? [];

  async function switchYear(y: number) {
    if (!page || y === page.year) return;
    setLoadingYear(true);
    try {
      const edition = await programPagesApi.get("felicitation", y);
      setPage(edition);
    } catch {
      // Leave the current edition showing if the fetch fails.
    } finally {
      setLoadingYear(false);
    }
  }

  return (
    <FelicitationPage
      page={page}
      fallbackTitle={FALLBACK_TITLE}
      fallbackDesc={FALLBACK_DESC}
      heroImageFallback={heroLeadership}
      years={years}
      currentYear={page?.year ?? new Date().getFullYear()}
      loadingYear={loadingYear}
      onSwitchYear={switchYear}
    />
  );
}
