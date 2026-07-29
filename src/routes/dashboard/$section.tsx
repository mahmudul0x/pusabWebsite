import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { DashboardGate, isSection, type Section } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/dashboard/$section")({
  head: () => ({
    meta: [{ title: "Dashboard — PUSAB" }, { name: "robots", content: "noindex" }],
  }),
  beforeLoad: ({ params }) => {
    if (!isSection(params.section)) throw notFound();
  },
  component: DashboardSectionRoute,
});

function DashboardSectionRoute() {
  const { section } = Route.useParams();
  const navigate = useNavigate();

  const onPick = (s: Section) => {
    navigate({ to: "/dashboard/$section", params: { section: s } });
  };

  return <DashboardGate section={section as Section} onPick={onPick} />;
}
