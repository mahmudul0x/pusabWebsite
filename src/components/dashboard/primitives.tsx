import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Pencil, Trash2, Search, AlertTriangle, ChevronDown } from "lucide-react";

export const inputCls =
  "mt-1.5 w-full rounded-xl border border-border bg-[var(--color-background)] px-3.5 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[var(--color-accent-1)] focus:ring-3 focus:ring-[color-mix(in_oklab,var(--color-accent-1)_15%,transparent)]";

export function Field({
  label,
  children,
  full,
  hint,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
  hint?: string;
}) {
  return (
    <label className={"block " + (full ? "sm:col-span-2" : "")}>
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function SectionHeader({
  title,
  subtitle,
  count,
  onNew,
  newLabel = "Add new",
}: {
  title: string;
  subtitle?: string;
  count?: number;
  onNew: () => void;
  newLabel?: string;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">{title}</h2>
          {count !== undefined && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-white"
              style={{ background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))" }}
            >
              {count}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <button
        onClick={onNew}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:opacity-90 active:scale-[0.98]"
        style={{ background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))" }}
      >
        <Plus size={15} /> {newLabel}
      </button>
    </div>
  );
}

export function Toolbar({
  query,
  onQuery,
  placeholder = "Search…",
  children,
}: {
  query: string;
  onQuery: (v: string) => void;
  placeholder?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1">
        <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[var(--color-accent-1)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent-1)_15%,transparent)]"
        />
      </div>
      {children}
    </div>
  );
}

export function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-xl border border-border bg-[var(--color-surface)] py-2.5 pl-3.5 pr-8 text-sm font-medium outline-none transition-all focus:border-[var(--color-accent-1)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent-1)_15%,transparent)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export function EmptyState({ label, icon }: { label: string; icon?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border py-24 text-center">
      <div className="flex max-w-sm flex-col items-center gap-4 px-6">
        {icon && (
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-[var(--color-surface)]">
            {icon}
          </div>
        )}
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-[var(--color-surface)] p-4">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-border" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/5 animate-pulse rounded-full bg-border" style={{ animationDelay: `${i * 60}ms` }} />
            <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-border/70" style={{ animationDelay: `${i * 60 + 80}ms` }} />
          </div>
          <div className="h-8 w-16 animate-pulse rounded-xl bg-border" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ cols = 4, rows = 8 }: { cols?: number; rows?: number }) {
  const colClass = cols === 3 ? "lg:grid-cols-3" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-4";
  return (
    <div className={"grid gap-4 sm:grid-cols-2 " + colClass}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-border bg-[var(--color-surface)]" style={{ height: 180, animationDelay: `${i * 40}ms` }} />
      ))}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  sub,
  onClick,
  accent,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  sub?: ReactNode;
  onClick?: () => void;
  accent?: boolean;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={
        "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all " +
        (accent
          ? "border-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-1)_6%,var(--color-surface))]"
          : "border-border bg-[var(--color-surface)]") +
        (onClick ? " hover:border-[color-mix(in_oklab,var(--color-accent-1)_50%,transparent)] hover:shadow-lg hover:shadow-[color-mix(in_oklab,var(--color-accent-1)_8%,transparent)] cursor-pointer" : "")
      }
    >
      <div
        className="absolute right-0 top-0 h-20 w-20 rounded-bl-full opacity-[0.07]"
        style={{ background: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))" }}
      />
      <div className="flex items-start justify-between gap-3">
        <span
          className="inline-grid h-9 w-9 place-items-center rounded-xl text-white shadow-sm"
          style={{ background: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))" }}
        >
          {icon}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mt-1">{label}</span>
      </div>
      <p className="mt-4 font-display text-3xl font-black leading-none tabular-nums">{value}</p>
      {sub && <div className="mt-1.5 text-xs text-muted-foreground">{sub}</div>}
    </Tag>
  );
}

export function CardActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onEdit}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-[color-mix(in_oklab,var(--color-accent-1)_10%,transparent)] hover:text-[var(--color-accent-1)] hover:scale-110"
        aria-label="Edit"
      >
        <Pencil size={13} />
      </button>
      <button
        onClick={onDelete}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-500 hover:scale-110"
        aria-label="Delete"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  saving,
  submitLabel = "Save changes",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: () => void;
  saving?: boolean;
  submitLabel?: string;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.form
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
            className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-border bg-[var(--color-surface)] shadow-2xl sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h3 className="font-display text-lg font-extrabold tracking-tight">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="grid gap-x-5 gap-y-5 overflow-y-auto px-6 py-6 sm:grid-cols-2">
              {children}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 border-t border-border bg-[color-mix(in_oklab,var(--color-background)_60%,var(--color-surface))] px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-[var(--color-background)] hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
                style={{ background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))" }}
              >
                {saving ? "Saving…" : submitLabel}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useConfirm() {
  const [state, setState] = useState<{
    message: string;
    title: string;
    resolve: (ok: boolean) => void;
  } | null>(null);

  const confirm = (message: string, title = "Are you sure?") =>
    new Promise<boolean>((resolve) => setState({ message, title, resolve }));

  const close = (ok: boolean) => {
    state?.resolve(ok);
    setState(null);
  };

  const element = (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => close(false)}
          className="fixed inset-0 z-[210] grid place-items-center bg-slate-950/70 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] shadow-2xl"
          >
            <div className="px-6 pt-7 pb-6 text-center">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-500">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-display text-lg font-extrabold">{state.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{state.message}</p>
            </div>
            <div className="flex gap-2.5 border-t border-border bg-[color-mix(in_oklab,var(--color-background)_60%,var(--color-surface))] px-6 py-4">
              <button
                onClick={() => close(false)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--color-background)]"
              >
                Cancel
              </button>
              <button
                onClick={() => close(true)}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-600 active:scale-[0.98]"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return [confirm, element] as const;
}
