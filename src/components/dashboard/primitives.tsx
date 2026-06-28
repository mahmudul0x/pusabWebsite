import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Pencil, Trash2, Search, AlertTriangle } from "lucide-react";

export const inputCls =
  "mt-1.5 w-full rounded-lg border border-border bg-[var(--color-background)] px-3 py-2 text-sm text-foreground outline-none transition focus:border-[var(--color-accent-1)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent-1)_22%,transparent)]";

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
      <span className="text-[13px] font-medium text-foreground/80">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
          {count !== undefined && (
            <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
              {count}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <button
        onClick={onNew}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-1)] px-3.5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Plus size={15} /> {newLabel}
      </button>
    </div>
  );
}

/** Search box + optional right-aligned filter controls (passed as children). */
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
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--color-accent-1)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent-1)_18%,transparent)]"
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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-border bg-[var(--color-surface)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-accent-1)]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function EmptyState({ label, icon }: { label: string; icon?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border py-20 text-center text-sm text-muted-foreground">
      <div className="flex max-w-sm flex-col items-center gap-3 px-6">
        {icon}
        {label}
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl border border-border bg-[var(--color-surface)]"
        />
      ))}
    </div>
  );
}

export function SkeletonGrid({ cols = 4, rows = 8 }: { cols?: number; rows?: number }) {
  const colClass =
    cols === 3 ? "lg:grid-cols-3" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-4 xl:grid-cols-4";
  return (
    <div className={"grid gap-4 sm:grid-cols-2 " + colClass}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-2xl border border-border bg-[var(--color-surface)]"
        />
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
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  sub?: ReactNode;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={
        "rounded-xl border border-border bg-[var(--color-surface)] p-5 text-left " +
        (onClick
          ? "transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_40%,transparent)]"
          : "")
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <span className="text-muted-foreground/70">{icon}</span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold leading-none tabular-nums">{value}</p>
      {sub && <div className="mt-2 text-xs text-muted-foreground">{sub}</div>}
    </Tag>
  );
}

export function CardActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={onEdit}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent-1)_10%,transparent)] hover:text-[var(--color-accent-1)]"
        aria-label="Edit"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={onDelete}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
        aria-label="Delete"
      >
        <Trash2 size={14} />
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
  submitLabel = "Save",
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
          className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.form
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-border bg-[var(--color-surface)] shadow-[0_40px_90px_-40px_rgba(15,23,42,0.45)] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-display text-[17px] font-bold tracking-tight">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[var(--color-background)] hover:text-foreground"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid gap-x-5 gap-y-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
              {children}
            </div>
            <div className="flex items-center justify-end gap-2.5 border-t border-border bg-[color-mix(in_oklab,var(--color-background)_50%,var(--color-surface))] px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-[var(--color-background)] hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[var(--color-accent-1)] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
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

/** Promise-based confirm dialog. Returns [confirm, element]; render the element. */
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
          className="fixed inset-0 z-[210] grid place-items-center bg-slate-950/60 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl border border-border bg-[var(--color-surface)] p-6 text-center"
          >
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-red-500/12 text-red-500">
              <AlertTriangle size={22} />
            </div>
            <h3 className="font-display text-lg font-bold">{state.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{state.message}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => close(false)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-[var(--color-background)]"
              >
                Cancel
              </button>
              <button
                onClick={() => close(true)}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
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
