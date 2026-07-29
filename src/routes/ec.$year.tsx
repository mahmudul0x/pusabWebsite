import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CommitteeView } from "@/components/site/CommitteeView";
import heroLeadership from "@/assets/hero-pages.jpeg";

import { ecOrdinal, sessionSpan } from "@/lib/session";

// Re-exported for the pages that already import these from this route module.
export { ecOrdinal, sessionSpan };

export const Route = createFileRoute("/ec/$year")({
  head: ({ params }) => {
    const year = Number(params.year);
    const label = Number.isFinite(year) ? `${ecOrdinal(year)} EC (${sessionSpan(year)})` : "Executive Committee";
    return {
      meta: [
        { title: `${label} — PUSAB` },
        { name: "description", content: `PUSAB ${label} executive committee members.` },
        { property: "og:title", content: `${label} — PUSAB` },
        { property: "og:url", content: `/ec/${params.year}` },
      ],
    };
  },
  component: EcYearPage,
});

function EcYearPage() {
  const { year } = Route.useParams();
  const yearNum = Number(year);
  const valid = Number.isFinite(yearNum);
  const label = valid ? `${ecOrdinal(yearNum)} Executive Committee` : "Executive Committee";

  return (
    <>
      <PageHero
        title={label}
        lede={
          valid
            ? `The PUSAB executive committee of session ${sessionSpan(yearNum)} — those who led and served.`
            : "PUSAB executive committee."
        }
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Leadership" },
          { label: "Executive Committee" },
          { label: valid ? `${ecOrdinal(yearNum)} EC` : "EC" },
        ]}
        image={heroLeadership}
        imageAlt="PUSAB executive committee"
      />
      {valid && (
        <CommitteeView
          year={yearNum}
          eyebrow={`${ecOrdinal(yearNum)} Executive Committee`}
          blurb={`The members who led PUSAB during the ${sessionSpan(yearNum)} session.`}
        />
      )}
    </>
  );
}
