import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { leaderMessageApi, type LeaderMessage } from "@/lib/api";
import { LeaderMessageView } from "./president-message";

export const Route = createFileRoute("/secretary-message")({
  head: () => ({
    meta: [
      { title: "Secretary's Message — PUSAB" },
      {
        name: "description",
        content:
          "A message from the General Secretary of PUSAB — on service, unity and the road ahead.",
      },
      { property: "og:title", content: "Secretary's Message — PUSAB" },
      { property: "og:description", content: "A message from the General Secretary of PUSAB." },
      { property: "og:url", content: "/secretary-message" },
    ],
    links: [{ rel: "canonical", href: "/secretary-message" }],
  }),
  component: SecretaryMessagePage,
});

function SecretaryMessagePage() {
  const [msg, setMsg] = useState<LeaderMessage | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    leaderMessageApi
      .get("secretary")
      .then(setMsg)
      .catch(() => setMsg(null))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <LeaderMessageView
      msg={msg}
      loaded={loaded}
      fallbackName="[Secretary Name]"
      roleLabel="General Secretary"
      headerLabel="Message from the General Secretary"
      pageTitle="Secretary's Message"
      lede="A word from the General Secretary of PUSAB — on service, unity, and the road ahead."
      crumbLabel="Secretary's Message"
      letter="S"
      accent="2"
    />
  );
}
