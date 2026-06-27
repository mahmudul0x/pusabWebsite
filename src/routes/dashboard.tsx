import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AuthProvider,
  useAuth,
  galleryApi,
  publicityApi,
  committeeApi,
  programsApi,
  contactApi,
  ApiError,
  type GalleryItem,
  type PublicityPost,
  type Program,
} from "@/lib/api";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Newspaper,
  Users,
  CalendarRange,
  LogOut,
  Loader2,
  Lock,
  Menu,
  X,
  ExternalLink,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  UserCog,
  Settings as SettingsIcon,
  Award,
  Crown,
  ShieldCheck,
} from "lucide-react";
import logoPusab from "@/assets/logo-pusab.png";
import { StatCard } from "@/components/dashboard/primitives";
import { MomentsSection } from "@/components/dashboard/MomentsSection";
import { PublicitySection } from "@/components/dashboard/PublicitySection";
import { CommitteeSection } from "@/components/dashboard/CommitteeSection";
import { ProgramsSection } from "@/components/dashboard/ProgramsSection";
import { MessagesSection } from "@/components/dashboard/MessagesSection";
import { UsersSection } from "@/components/dashboard/UsersSection";
import { SettingsSection } from "@/components/dashboard/SettingsSection";
import { FelicitationSection } from "@/components/dashboard/FelicitationSection";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — PUSAB" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AuthProvider>
      <DashboardGate />
    </AuthProvider>
  ),
});

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[var(--color-background)] px-6 text-center">
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}

function DashboardGate() {
  const { user, loading, isAdmin } = useAuth();
  if (loading)
    return (
      <Centered>
        <Loader2 className="mx-auto mb-3 animate-spin" />
        Loading…
      </Centered>
    );
  if (!user) return <LoginScreen />;
  if (!isAdmin)
    return (
      <Centered>
        <Lock className="mx-auto mb-3" />
        <p className="font-medium text-foreground">No admin access yet</p>
        <p className="mt-1 text-sm">
          Signed in as {user.email}. Ask a site admin to grant your account the admin role.
        </p>
      </Centered>
    );
  return <DashboardShell />;
}

function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed — is the backend running?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--color-background)] px-6">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-[var(--color-accent-1)] opacity-10 blur-[120px]" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-3xl border border-border bg-[var(--color-surface)] p-8 shadow-[0_40px_90px_-50px_rgba(15,23,42,0.5)]"
      >
        <img src={logoPusab} alt="PUSAB" className="mb-4 h-12 w-12 object-contain" />
        <p className="font-display text-2xl font-bold tracking-tight">PUSAB Dashboard</p>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to manage the site.</p>

        <label className="mt-6 block">
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-accent-1)]"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-accent-1)]"
          />
        </label>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        <button
          disabled={busy}
          className="mt-6 w-full rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] py-3 font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <Link
          to="/"
          className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to site
        </Link>
      </form>
    </div>
  );
}

const NAV = [
  { key: "overview", label: "Overview", Icon: LayoutDashboard, group: "main" },
  { key: "moments", label: "Moments", Icon: ImageIcon, group: "content" },
  { key: "publicity", label: "Publicity", Icon: Newspaper, group: "content" },
  { key: "executive-committee", label: "Executive Committee", Icon: ShieldCheck, group: "content" },
  { key: "honor-board", label: "Honor Board", Icon: Crown, group: "content" },
  { key: "programs", label: "Programs", Icon: CalendarRange, group: "content" },
  { key: "felicitation", label: "Felicitation", Icon: Award, group: "content" },
  { key: "messages", label: "Messages", Icon: MessageSquare, group: "system" },
  { key: "users", label: "Users", Icon: UserCog, group: "system" },
  { key: "settings", label: "Settings", Icon: SettingsIcon, group: "system" },
] as const;

type Section = (typeof NAV)[number]["key"];

function NavList({
  section,
  onPick,
  badges,
}: {
  section: Section;
  onPick: (s: Section) => void;
  badges?: Partial<Record<Section, number>>;
}) {
  let lastGroup = "";
  return (
    <nav className="space-y-1">
      {NAV.map(({ key, label, Icon, group }) => {
        const showDivider = group !== lastGroup && group === "system";
        lastGroup = group;
        const badge = badges?.[key];
        return (
          <div key={key}>
            {showDivider && <div className="my-2 border-t border-border" />}
            <button
              onClick={() => onPick(key)}
              className={
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors " +
                (section === key
                  ? "bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white shadow-[0_10px_24px_-14px_rgba(29,78,216,0.8)]"
                  : "text-foreground/75 hover:bg-[var(--color-surface)] hover:text-foreground")
              }
            >
              <Icon size={17} /> <span className="flex-1 text-left">{label}</span>
              {badge ? (
                <span
                  className={
                    "rounded-full px-1.5 text-[11px] font-bold tabular-nums " +
                    (section === key ? "bg-white/20 text-white" : "bg-[var(--color-accent-1)] text-white")
                  }
                >
                  {badge}
                </span>
              ) : null}
            </button>
          </div>
        );
      })}
    </nav>
  );
}

function UserFooter({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="border-t border-border pt-4">
      <div className="mb-2 flex items-center gap-3 px-1">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-xs font-bold text-white">
          {email.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{email}</p>
          <p className="text-[11px] text-muted-foreground">Administrator</p>
        </div>
      </div>
      <button
        onClick={onSignOut}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-foreground/70 hover:bg-[var(--color-surface)] hover:text-foreground"
      >
        <LogOut size={16} /> Sign out
      </button>
    </div>
  );
}

function DashboardShell() {
  const { user, signOut } = useAuth();
  const [section, setSection] = useState<Section>("overview");
  const [drawer, setDrawer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unread, setUnread] = useState(0);
  const active = NAV.find((n) => n.key === section)!;
  const email = user?.email ?? "";

  // Unread message badge (refreshes when returning to the Messages tab).
  useEffect(() => {
    let alive = true;
    contactApi
      .listAll({ })
      .then((msgs) => alive && setUnread(msgs.filter((m) => !m.is_read).length))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [section]);

  const pick = (s: Section) => {
    setSection(s);
    setDrawer(false);
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Desktop sidebar (collapsible) */}
      <aside
        className={
          "sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-[var(--color-surface)] p-4 " +
          (sidebarOpen ? "lg:flex" : "lg:hidden")
        }
      >
        <Link to="/" className="mb-4 flex items-center gap-2.5 px-2">
          <img src={logoPusab} alt="PUSAB" className="h-9 w-9 object-contain" />
          <span className="font-display text-lg font-bold tracking-tight">PUSAB Admin</span>
        </Link>
        <div className="flex-1">
          <NavList section={section} onPick={pick} badges={{ messages: unread }} />
        </div>
        <UserFooter email={email} onSignOut={signOut} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawer(false)}
            className="fixed inset-0 z-[120] bg-slate-950/50 backdrop-blur-sm lg:hidden"
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-72 flex-col border-r border-border bg-[var(--color-surface)] p-4"
            >
              <div className="mb-4 flex items-center justify-between px-1">
                <span className="font-display text-lg font-bold tracking-tight">PUSAB Admin</span>
                <button onClick={() => setDrawer(false)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1">
                <NavList section={section} onPick={pick} badges={{ messages: unread }} />
              </div>
              <UserFooter email={email} onSignOut={signOut} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-[color-mix(in_oklab,var(--color-background)_85%,transparent)] px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile: open drawer */}
            <button
              onClick={() => setDrawer(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground/70 hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            {/* Desktop: collapse / expand sidebar */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground/70 hover:text-foreground lg:inline-flex"
              aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
            <h1 className="font-display text-xl font-bold tracking-tight">{active.label}</h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/75 hover:text-foreground"
          >
            View site <ExternalLink size={12} />
          </Link>
        </header>

        <main className="flex-1 p-5 sm:p-7">
          {section === "overview" && <Overview onJump={pick} />}
          {section === "moments" && <MomentsSection />}
          {section === "publicity" && <PublicitySection />}
          {section === "executive-committee" && <CommitteeSection view="executive-committee" />}
          {section === "honor-board" && <CommitteeSection view="honor-board" />}
          {section === "programs" && <ProgramsSection />}
          {section === "felicitation" && <FelicitationSection />}
          {section === "messages" && <MessagesSection />}
          {section === "users" && <UsersSection />}
          {section === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

interface OverviewData {
  moments: GalleryItem[];
  publicity: PublicityPost[];
  programs: Program[];
  committee: { count: number; current: number; sessions: number };
}

function Overview({ onJump }: { onJump: (s: Section) => void }) {
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      galleryApi.list(),
      publicityApi.list(),
      programsApi.list(),
      committeeApi.listAll(),
    ]).then(([g, p, pr, c]) => {
      if (!alive) return;
      setData({
        moments: g.results,
        publicity: p.results,
        programs: pr.results,
        committee: {
          count: c.length,
          current: c.filter((m) => m.is_current).length,
          sessions: new Set(c.map((m) => m.year)).size,
        },
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  const pub = data?.publicity ?? [];
  const prog = data?.programs ?? [];
  const published = pub.filter((p) => p.published).length;
  const upcoming = prog.filter((p) => p.status === "upcoming").length;
  const ongoing = prog.filter((p) => p.status === "ongoing").length;

  // Recent activity across resources that carry created_at.
  const recent = data
    ? [
        ...data.publicity.map((p) => ({
          id: `p${p.id}`,
          kind: "Publicity",
          title: p.title,
          at: p.created_at,
          image: p.image_url,
        })),
        ...data.programs.map((p) => ({
          id: `pr${p.id}`,
          kind: "Program",
          title: p.title,
          at: p.created_at,
          image: p.image_url,
        })),
        ...data.moments.map((m) => ({
          id: `m${m.id}`,
          kind: "Moment",
          title: m.title || "Untitled photo",
          at: m.created_at,
          image: m.image_url,
        })),
      ]
        .sort((a, b) => +new Date(b.at) - +new Date(a.at))
        .slice(0, 6)
    : [];

  const loading = data === null;

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        Welcome back. Here's everything live on the site — click a card to manage it.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Photos"
          icon={<ImageIcon size={18} />}
          value={loading ? "—" : data!.moments.length}
          sub="In the Moments gallery"
          onClick={() => onJump("moments")}
        />
        <StatCard
          label="Publicity posts"
          icon={<Newspaper size={18} />}
          value={loading ? "—" : pub.length}
          sub={loading ? "" : `${published} published · ${pub.length - published} drafts`}
          onClick={() => onJump("publicity")}
        />
        <StatCard
          label="Committee"
          icon={<Users size={18} />}
          value={loading ? "—" : data!.committee.count}
          sub={
            loading
              ? ""
              : `${data!.committee.sessions} sessions · ${data!.committee.current} current`
          }
          onClick={() => onJump("executive-committee")}
        />
        <StatCard
          label="Programs"
          icon={<CalendarRange size={18} />}
          value={loading ? "—" : prog.length}
          sub={loading ? "" : `${upcoming} upcoming · ${ongoing} ongoing`}
          onClick={() => onJump("programs")}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent activity */}
        <div className="rounded-2xl border border-border bg-[var(--color-surface)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Recent activity</h3>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-[var(--color-background)]" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Nothing yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-2.5">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--color-background)]">
                    {r.image && (
                      <img src={r.image} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {r.kind} · {new Date(r.at).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-border bg-[var(--color-surface)] p-5">
          <h3 className="mb-4 font-display text-lg font-bold">Quick actions</h3>
          <div className="space-y-2">
            {(
              [
                { key: "moments", label: "Add a photo", Icon: ImageIcon },
                { key: "publicity", label: "Write a post", Icon: Newspaper },
                { key: "executive-committee", label: "Add a member", Icon: Users },
                { key: "programs", label: "Add a program", Icon: CalendarRange },
              ] as const
            ).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => onJump(key)}
                className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Icon size={16} className="text-[var(--color-accent-1)]" /> {label}
                </span>
                <ArrowUpRight size={15} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
