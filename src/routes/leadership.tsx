import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CommitteeView } from "@/components/site/CommitteeView";
import { usePageHero } from "@/lib/usePageHero";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Executive Committee — PUSAB" },
      { name: "description", content: "The current PUSAB Executive Committee." },
      { property: "og:title", content: "Executive Committee — PUSAB" },
      { property: "og:url", content: "/leadership" },
    ],
    links: [{ rel: "canonical", href: "/leadership" }],
  }),
  component: ExecutiveCommitteePage,
});

function ExecutiveCommitteePage() {
  const hero = usePageHero("leadership");
  return (
    <>
      <PageHero
        title={hero.title ?? "Executive Committee"}
        lede={
          hero.lede ??
          "The current committee leading PUSAB this session — elected to serve, committed to the community."
        }
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Leadership" },
          { label: "Executive Committee" },
        ]}
        image={hero.image ?? heroLeadership}
        imageAlt={hero.imageAlt ?? "PUSAB executive committee"}
      />
      <CommitteeView />
    </>
  );
}
