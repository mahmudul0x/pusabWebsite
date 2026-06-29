import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/honor-board")({
  component: () => <Outlet />,
});
