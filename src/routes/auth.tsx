import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/PageHero";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — PUSAB" },
      { name: "description", content: "Sign in to the PUSAB admin area." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created — you can sign in now.");
        setMode("sign-in");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero
        title={mode === "sign-in" ? "Sign in" : "Create account"}
        lede="Members & admins only. Public pages remain open to everyone."
        crumbs={[{ label: "Home", to: "/" }, { label: "Sign in" }]}
      />
      <section className="pb-24">
        <div className="container-page max-w-md">
          <form onSubmit={submit} className="glass rounded-3xl p-8 space-y-5 border border-border">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl bg-[var(--color-surface)] border border-border px-4 py-3 outline-none focus:border-[var(--color-accent-1)]"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Password
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl bg-[var(--color-surface)] border border-border px-4 py-3 outline-none focus:border-[var(--color-accent-1)]"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white font-semibold py-3 disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
            </button>
            <button
              type="button"
              onClick={() => setMode((m) => (m === "sign-in" ? "sign-up" : "sign-in"))}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {mode === "sign-in"
                ? "Need an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
