import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
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
  type EcMember,
} from "@/lib/api";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
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
  Plus,
  Star,
  Quote,
  FileText,
  MessageSquareQuote,
  GalleryHorizontal,
  TrendingUp,
} from "lucide-react";
import logoPusab from "@/assets/logo-pusab.png";
import { StatCard } from "@/components/dashboard/primitives";
import { MomentsSection } from "@/components/dashboard/MomentsSection";
import { PublicitySection } from "@/components/dashboard/PublicitySection";
import { CommitteeSection } from "@/components/dashboard/CommitteeSection";
import { ProgramsSection } from "@/components/dashboard/ProgramsSection";
import { MessagesSection } from "@/components/dashboard/MessagesSection";
import { JoinApplicationsSection } from "@/components/dashboard/JoinApplicationsSection";
import { LeadershipMessagesSection } from "@/components/dashboard/LeadershipMessagesSection";
import { UsersSection } from "@/components/dashboard/UsersSection";
import { SettingsSection } from "@/components/dashboard/SettingsSection";
import { FelicitationSection } from "@/components/dashboard/FelicitationSection";
import { ProgramPagesSection } from "@/components/dashboard/ProgramPagesSection";
import { TestimonialsSection } from "@/components/dashboard/TestimonialsSection";
import { PageHeroesSection } from "@/components/dashboard/PageHeroesSection";

const ACCENT = "var(--color-accent-1)";

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[var(--color-background)] px-6 text-center">
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}

export function DashboardGate({ section, onPick }: { section: Section; onPick: (s: Section) => void }) {
  return (
    <AuthProvider>
      <DashboardGateInner section={section} onPick={onPick} />
    </AuthProvider>
  );
}

function DashboardGateInner({ section, onPick }: { section: Section; onPick: (s: Section) => void }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading)
    return (
      <Centered>
        <Loader2 className="mx-auto mb-3 animate-spin" size={28} />
        <p className="text-sm">Loading…</p>
      </Centered>
    );
  if (!user) return <LoginScreen />;
  if (!isAdmin)
    return (
      <Centered>
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-500">
          <Lock size={24} />
        </div>
        <p className="font-semibold text-foreground">Access denied</p>
        <p className="mt-1 text-sm">
          Signed in as {user.email}. Ask a site admin to grant your account the admin role.
        </p>
      </Centered>
    );
  return <DashboardShell section={section} onPick={onPick} />;
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
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-[var(--color-accent-1)] opacity-[0.08] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[var(--color-accent-2)] opacity-[0.05] blur-[100px]" />

      <form
        onSubmit={submit}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] shadow-[0_40px_100px_-50px_rgba(15,23,42,0.5)]">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-[linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2))]" />
          <div className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <img src={logoPusab} alt="PUSAB" className="h-11 w-11 object-contain" />
              <div>
                <p className="font-display text-xl font-bold tracking-tight leading-tight">PUSAB Admin</p>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-accent-1)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent-1)_20%,transparent)]"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-accent-1)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent-1)_20%,transparent)]"
                  placeholder="••••••••"
                />
              </label>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              disabled={busy}
              className="mt-6 w-full rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-10px_rgba(29,78,216,0.7)] transition-opacity disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </div>

        <Link
          to="/"
          className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to site
        </Link>
      </form>
    </div>
  );
}

export const NAV = [
  { key: "overview", label: "Overview", Icon: LayoutDashboard, group: "main" },
  { key: "page-heroes", label: "Page Heroes", Icon: GalleryHorizontal, group: "content" },
  { key: "moments", label: "Moments", Icon: ImageIcon, group: "content" },
  { key: "publicity", label: "Publicity", Icon: Newspaper, group: "content" },
  { key: "executive-committee", label: "Executive Committee", Icon: ShieldCheck, group: "content" },
  { key: "honor-board", label: "Honor Board", Icon: Crown, group: "content" },
  { key: "convening-committee", label: "Convening Committee", Icon: Star, group: "content" },
  { key: "leadership-messages", label: "Leadership Messages", Icon: Quote, group: "content" },
  { key: "programs", label: "Programs", Icon: CalendarRange, group: "content" },
  { key: "program-pages", label: "Program Pages", Icon: FileText, group: "content" },
  { key: "felicitation", label: "Felicitation", Icon: Award, group: "content" },
  { key: "testimonials", label: "Testimonials", Icon: MessageSquareQuote, group: "content" },
  { key: "messages", label: "Messages", Icon: MessageSquare, group: "system" },
  { key: "join-applications", label: "Join Applications", Icon: Users, group: "system" },
  { key: "users", label: "Users", Icon: UserCog, group: "system" },
  { key: "settings", label: "Settings", Icon: SettingsIcon, group: "system" },
] as const;

export type Section = (typeof NAV)[number]["key"];

export const SECTION_KEYS = NAV.map((n) => n.key) as Section[];

export function isSection(value: string): value is Section {
  return (SECTION_KEYS as string[]).includes(value);
}

const GROUP_LABELS: Record<string, string> = {
  main: "",
  content: "Content",
  system: "System",
};

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
    <nav className="space-y-0.5 px-2">
      {NAV.map(({ key, label, Icon, group }) => {
        const isNewGroup = group !== lastGroup;
        const showLabel = isNewGroup && GROUP_LABELS[group];
        lastGroup = group;
        const badge = badges?.[key];
        const active = section === key;
        return (
          <div key={key}>
            {showLabel && (
              <div className="flex items-center gap-2 mb-1 mt-5 px-2">
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground/40">
                  {GROUP_LABELS[group]}
                </span>
                <div className="flex-1 h-px bg-border/50" />
              </div>
            )}
            <button
              onClick={() => onPick(key)}
              className={
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 " +
                (active
                  ? "bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white shadow-lg shadow-[color-mix(in_oklab,var(--color-accent-1)_35%,transparent)]"
                  : "text-foreground/60 hover:bg-[color-mix(in_oklab,var(--color-accent-1)_6%,var(--color-background))] hover:text-foreground")
              }
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-white/50" />
              )}
              <span className={
                "grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-all " +
                (active
                  ? "bg-white/20"
                  : "bg-[color-mix(in_oklab,var(--color-accent-1)_8%,transparent)] group-hover:bg-[color-mix(in_oklab,var(--color-accent-1)_14%,transparent)]")
              }>
                <Icon size={14} className="shrink-0" />
              </span>
              <span className="flex-1 text-left text-[13px]">{label}</span>
              {badge ? (
                <span className={
                  "rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums " +
                  (active
                    ? "bg-white/25 text-white"
                    : "bg-[var(--color-accent-1)] text-white")
                }>
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
  const initials = email.slice(0, 2).toUpperCase();
  return (
    <div className="mx-2 rounded-2xl border border-border/60 bg-[var(--color-background)] p-3">
      <div className="flex items-center gap-3">
        <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-xs font-bold text-white shadow-md">
          {initials}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-background)] bg-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold leading-tight text-foreground">{email}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Administrator</p>
        </div>
        <button
          onClick={onSignOut}
          title="Sign out"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut size={13} />
        </button>
      </div>
    </div>
  );
}

function DashboardShell({ section, onPick }: { section: Section; onPick: (s: Section) => void }) {
  const { user, signOut } = useAuth();
  const [drawer, setDrawer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unread, setUnread] = useState(0);
  const active = NAV.find((n) => n.key === section)!;
  const email = user?.email ?? "";

  useEffect(() => {
    let alive = true;
    contactApi
      .listAll({})
      .then((msgs) => alive && setUnread(msgs.filter((m) => !m.is_read).length))
      .catch(() => {});
    return () => { alive = false; };
  }, [section]);

  const pick = (s: Section) => {
    setDrawer(false);
    onPick(s);
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* ── Desktop sidebar ───────────────────────────────────── */}
      <aside
        className={
          "sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/70 bg-[var(--color-surface)] " +
          (sidebarOpen ? "lg:flex" : "lg:hidden")
        }
        style={{ background: "color-mix(in oklab, var(--color-surface) 97%, var(--color-accent-1))" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border/50">
          <div className="relative">
            <img src={logoPusab} alt="PUSAB" className="h-9 w-9 object-contain drop-shadow-sm" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[var(--color-surface)]" />
          </div>
          <div>
            <span className="font-display text-[15px] font-extrabold tracking-tight leading-tight block">PUSAB</span>
            <span className="text-[10px] text-muted-foreground/70 leading-none font-medium tracking-wide">Admin Dashboard</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3 scrollbar-thin">
          <NavList section={section} onPick={pick} badges={{ messages: unread }} />
        </div>

        <div className="border-t border-border/50 py-3">
          <UserFooter email={email} onSignOut={signOut} />
        </div>
      </aside>

      {/* ── Mobile drawer ─────────────────────────────────────── */}
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
              className="flex h-full w-72 flex-col border-r border-border/70 bg-[var(--color-surface)]"
              style={{ background: "color-mix(in oklab, var(--color-surface) 97%, var(--color-accent-1))" }}
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <img src={logoPusab} alt="PUSAB" className="h-9 w-9 object-contain" />
                  <div>
                    <span className="font-display text-[15px] font-extrabold tracking-tight leading-tight block">PUSAB</span>
                    <span className="text-[10px] text-muted-foreground/70 leading-none">Admin Dashboard</span>
                  </div>
                </div>
                <button
                  onClick={() => setDrawer(false)}
                  className="grid h-8 w-8 place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-3">
                <NavList section={section} onPick={pick} badges={{ messages: unread }} />
              </div>
              <div className="border-t border-border/50 py-3">
                <UserFooter email={email} onSignOut={signOut} />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-[color-mix(in_oklab,var(--color-background)_88%,transparent)] px-5 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawer(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-border text-foreground/70 transition-colors hover:text-foreground lg:hidden"
            >
              <Menu size={17} />
            </button>
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="hidden h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground/70 transition-colors hover:text-foreground lg:grid"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
            </button>
            <div className="flex items-center gap-2.5">
              <active.Icon size={18} className="text-[var(--color-accent-1)]" />
              <h1 className="font-display text-lg font-bold tracking-tight">{active.label}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:border-[var(--color-accent-1)] hover:text-foreground"
            >
              View site <ExternalLink size={11} />
            </Link>

          </div>
        </header>

        <main className="flex-1 p-5 sm:p-7">
          {section === "overview" && <Overview onJump={pick} />}
          {section === "page-heroes" && <PageHeroesSection />}
          {section === "moments" && <MomentsSection />}
          {section === "publicity" && <PublicitySection />}
          {section === "executive-committee" && <CommitteeSection view="executive-committee" />}
          {section === "honor-board" && <CommitteeSection view="honor-board" />}
          {section === "convening-committee" && <CommitteeSection view="convening-committee" />}
          {section === "leadership-messages" && <LeadershipMessagesSection />}
          {section === "programs" && <ProgramsSection />}
          {section === "program-pages" && <ProgramPagesSection />}
          {section === "felicitation" && <FelicitationSection />}
          {section === "testimonials" && <TestimonialsSection />}
          {section === "messages" && <MessagesSection />}
          {section === "join-applications" && <JoinApplicationsSection />}
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
  members: EcMember[];
  committee: { count: number; current: number; sessions: number };
}

const CHART_COLORS = {
  blue: "var(--color-chart-2)",
  green: "var(--color-chart-3)",
  amber: "var(--color-chart-4)",
  pink: "var(--color-chart-5)",
};

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

function Overview({ onJump }: { onJump: (s: Section) => void }) {
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      galleryApi.listAll(),
      publicityApi.listAll(),
      programsApi.listAll(),
      committeeApi.listAll(),
    ]).then(([moments, publicity, programs, c]) => {
      if (!alive) return;
      setData({
        moments,
        publicity,
        programs,
        members: c,
        committee: {
          count: c.length,
          current: c.filter((m) => m.is_current).length,
          sessions: new Set(c.map((m) => m.year)).size,
        },
      });
    });
    return () => { alive = false; };
  }, []);

  const pub = data?.publicity ?? [];
  const prog = data?.programs ?? [];
  const published = pub.filter((p) => p.published).length;
  const upcoming = prog.filter((p) => p.status === "upcoming").length;
  const ongoing = prog.filter((p) => p.status === "ongoing").length;

  const recent = data
    ? [
        ...data.publicity.map((p) => ({
          id: `p${p.id}`, kind: "Publicity", title: p.title, at: p.created_at, image: p.image_url, section: "publicity" as Section,
        })),
        ...data.programs.map((p) => ({
          id: `pr${p.id}`, kind: "Program", title: p.title, at: p.created_at, image: p.image_url, section: "programs" as Section,
        })),
        ...data.moments.map((m) => ({
          id: `m${m.id}`, kind: "Moment", title: m.title || "Untitled photo", at: m.created_at, image: m.image_url, section: "moments" as Section,
        })),
      ]
        .sort((a, b) => +new Date(b.at) - +new Date(a.at))
        .slice(0, 8)
    : [];

  const loading = data === null;
  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Content added per month, last 6 months — moments + publicity + programs.
  const activityTrend = useMemo(() => {
    if (!data) return [];
    const months: string[] = [];
    const cursor = new Date(now.getFullYear(), now.getMonth(), 1);
    for (let i = 5; i >= 0; i--) {
      const d = new Date(cursor.getFullYear(), cursor.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    const buckets = new Map(months.map((m) => [m, { moments: 0, publicity: 0, programs: 0 }]));
    for (const m of data.moments) {
      const k = monthKey(m.created_at);
      if (buckets.has(k)) buckets.get(k)!.moments++;
    }
    for (const p of data.publicity) {
      const k = monthKey(p.created_at);
      if (buckets.has(k)) buckets.get(k)!.publicity++;
    }
    for (const p of data.programs) {
      const k = monthKey(p.created_at);
      if (buckets.has(k)) buckets.get(k)!.programs++;
    }
    return months.map((m) => ({ month: monthLabel(m), ...buckets.get(m)! }));
  }, [data, now]);

  const programStatus = useMemo(() => {
    if (!data) return [];
    const counts = { upcoming: 0, ongoing: 0, completed: 0 };
    for (const p of data.programs) counts[p.status]++;
    return [
      { name: "Upcoming", value: counts.upcoming, fill: CHART_COLORS.blue },
      { name: "Ongoing", value: counts.ongoing, fill: CHART_COLORS.green },
      { name: "Completed", value: counts.completed, fill: CHART_COLORS.amber },
    ].filter((d) => d.value > 0);
  }, [data]);

  const committeeByYear = useMemo(() => {
    if (!data) return [];
    const counts = new Map<number, number>();
    for (const m of data.members) counts.set(m.year, (counts.get(m.year) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => a[0] - b[0])
      .slice(-6)
      .map(([year, count]) => ({ year: String(year), members: count }));
  }, [data]);

  const contentMixConfig: ChartConfig = {
    moments: { label: "Photos", color: CHART_COLORS.blue },
    publicity: { label: "Publicity", color: CHART_COLORS.green },
    programs: { label: "Programs", color: CHART_COLORS.amber },
  };

  const programStatusConfig: ChartConfig = {
    Upcoming: { label: "Upcoming", color: CHART_COLORS.blue },
    Ongoing: { label: "Ongoing", color: CHART_COLORS.green },
    Completed: { label: "Completed", color: CHART_COLORS.amber },
  };

  const committeeConfig: ChartConfig = {
    members: { label: "Members", color: CHART_COLORS.blue },
  };

  const quickActions = [
    { key: "moments", label: "Add a photo", Icon: ImageIcon, desc: "Upload to gallery" },
    { key: "publicity", label: "Write a post", Icon: Newspaper, desc: "Create publicity post" },
    { key: "executive-committee", label: "Add a member", Icon: Users, desc: "Update committee" },
    { key: "programs", label: "Add a program", Icon: CalendarRange, desc: "Schedule event" },
  ] as const;

  const sitePages = [
    { label: "Leadership", to: "/leadership" },
    { label: "Honor Board", to: "/honor-board" },
    { label: "Programs", to: "/programs" },
    { label: "Moments", to: "/moments" },
  ];

  return (
    <div className="space-y-6">
      {/* Slim greeting header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>{greeting}</p>
          <h2 className="font-display text-2xl font-extrabold tracking-tight mt-1 md:text-[28px]">Welcome back</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat row — 4 equal cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Photos" icon={<ImageIcon size={16} />}
          value={loading ? "—" : data!.moments.length}
          sub="In the Moments gallery" onClick={() => onJump("moments")} />
        <StatCard label="Publicity Posts" icon={<Newspaper size={16} />}
          value={loading ? "—" : pub.length}
          sub={loading ? "" : `${published} published · ${pub.length - published} drafts`}
          onClick={() => onJump("publicity")} />
        <StatCard label="Committee" icon={<Users size={16} />}
          value={loading ? "—" : data!.committee.count}
          sub={loading ? "" : `${data!.committee.sessions} sessions · ${data!.committee.current} current`}
          onClick={() => onJump("executive-committee")} accent />
        <StatCard label="Programs" icon={<CalendarRange size={16} />}
          value={loading ? "—" : prog.length}
          sub={loading ? "" : `${upcoming} upcoming · ${ongoing} ongoing`}
          onClick={() => onJump("programs")} />
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Content activity over time */}
        <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] p-5">
          <div className="mb-1 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-sm font-bold">Content activity</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">New items added, last 6 months</p>
            </div>
            <TrendingUp size={16} className="text-muted-foreground/50" />
          </div>
          {loading ? (
            <div className="mt-4 h-[220px] animate-pulse rounded-xl bg-[var(--color-background)]" />
          ) : activityTrend.every((m) => m.moments + m.publicity + m.programs === 0) ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No activity in this period yet.</p>
          ) : (
            <ChartContainer config={contentMixConfig} className="mt-2 aspect-auto h-[220px] w-full">
              <AreaChart data={activityTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fillMoments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.blue} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={CHART_COLORS.blue} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillPublicity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillPrograms" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.amber} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={CHART_COLORS.amber} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="0" stroke="var(--color-border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} allowDecimals={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area dataKey="moments" type="monotone" fill="url(#fillMoments)" stroke={CHART_COLORS.blue} strokeWidth={2} stackId="a" />
                <Area dataKey="publicity" type="monotone" fill="url(#fillPublicity)" stroke={CHART_COLORS.green} strokeWidth={2} stackId="a" />
                <Area dataKey="programs" type="monotone" fill="url(#fillPrograms)" stroke={CHART_COLORS.amber} strokeWidth={2} stackId="a" />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          )}
        </div>

        {/* Program status donut */}
        <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] p-5">
          <h3 className="font-display text-sm font-bold">Programs by status</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Current pipeline</p>
          {loading ? (
            <div className="mt-4 h-[190px] animate-pulse rounded-xl bg-[var(--color-background)]" />
          ) : programStatus.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No programs yet.</p>
          ) : (
            <ChartContainer config={programStatusConfig} className="mx-auto aspect-auto h-[190px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel indicator="dot" />} />
                <Pie data={programStatus} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} strokeWidth={2} stroke="var(--color-surface)">
                  {programStatus.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          )}
        </div>
      </div>

      {/* Committee growth */}
      {!loading && committeeByYear.length > 1 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] p-5">
          <h3 className="font-display text-sm font-bold">Committee members by session</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Headcount across the most recent sessions</p>
          <ChartContainer config={committeeConfig} className="mt-2 aspect-auto h-[180px] w-full">
            <BarChart data={committeeByYear} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="0" stroke="var(--color-border)" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} allowDecimals={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="members" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ChartContainer>
        </div>
      )}

      {/* Bottom: activity feed + sidebar */}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Recent activity */}
        <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <h3 className="font-display text-sm font-bold">Recent activity</h3>
            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground tabular-nums">{recent.length}</span>
          </div>
          {loading ? (
            <div className="space-y-1 p-3">
              {[0,1,2,3,4].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-[var(--color-background)]" style={{ animationDelay: `${i*60}ms` }} />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">Nothing yet.</p>
          ) : (
            <ul>
              {recent.map((r) => (
                <li key={r.id}
                  className="group flex cursor-pointer items-center gap-3 px-5 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent-1)_5%,transparent)] border-b border-border last:border-0"
                  onClick={() => onJump(r.section)}
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[var(--color-background)] border border-border">
                    {r.image ? <img src={r.image} alt="" className="h-full w-full object-cover" /> : (
                      <div className="grid h-full w-full place-items-center text-muted-foreground/30">
                        <ImageIcon size={14} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-tight">{r.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      <span className="font-bold" style={{ color: ACCENT }}>{r.kind}</span>
                      {" · "}
                      {new Date(r.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <ArrowUpRight size={13} className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Quick actions */}
          <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-display text-sm font-bold">Quick actions</h3>
            </div>
            <div className="p-2 space-y-0.5">
              {quickActions.map(({ key, label, Icon, desc }) => (
                <button key={key} onClick={() => onJump(key)}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-[color-mix(in_oklab,var(--color-accent-1)_6%,transparent)]"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-[var(--color-background)] text-muted-foreground transition-colors group-hover:border-[color-mix(in_oklab,var(--color-accent-1)_40%,transparent)] group-hover:text-[var(--color-accent-1)]">
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight">{label}</p>
                    <p className="text-[11px] text-muted-foreground">{desc}</p>
                  </div>
                  <Plus size={13} className="shrink-0 text-muted-foreground/40 group-hover:text-[var(--color-accent-1)] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Site links */}
          <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
            <div className="border-b border-border px-5 py-3.5">
              <h3 className="font-display text-sm font-bold">View site pages</h3>
            </div>
            <div className="divide-y divide-border">
              {sitePages.map(({ label, to }) => (
                <Link key={to} to={to} target="_blank"
                  className="flex items-center justify-between gap-2 px-5 py-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent-1)_5%,transparent)] hover:text-foreground"
                >
                  {label} <ExternalLink size={11} className="text-muted-foreground/50" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
