import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { committeeApi, optimizeImage, type EcMember } from "@/lib/api";
import { useResource, errMessage } from "./useResource";
import {
  Field,
  Modal,
  SectionHeader,
  EmptyState,
  CardActions,
  Toolbar,
  FilterSelect,
  ListSkeleton,
  useConfirm,
  inputCls,
} from "./primitives";
import { ImageUpload } from "./ImageUpload";
import { Check, ChevronDown, Crown, Gavel, ShieldCheck, X } from "lucide-react";

const ROLES = [
  "President",
  "Vice President",
  "General Secretary",
  "Joint Secretary",
  "Organizing Secretary",
  "Treasurer",
  "Office Secretary",
  "Convenor",
  "Member Secretary",
  "Executive Member",
];

interface Form {
  name: string;
  role: string;
  university: string;
  year: string;
  is_current: boolean;
  photo_url: string;
}

const empty: Form = {
  name: "",
  role: "President",
  university: "",
  year: String(new Date().getFullYear()),
  is_current: true,
  photo_url: "",
};

// ── Role Combobox ────────────────────────────────────────────────────────────
function RoleCombobox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setInput(value); }, [value]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const filtered = ROLES.filter((r) =>
    r.toLowerCase().includes(input.toLowerCase())
  );

  function select(role: string) {
    onChange(role);
    setInput(role);
    setOpen(false);
  }

  function handleInput(v: string) {
    setInput(v);
    onChange(v);
    setOpen(true);
  }

  return (
    <div ref={ref} className="relative mt-1.5">
      <div className="flex items-center rounded-lg border border-border bg-[var(--color-background)] focus-within:border-[var(--color-accent-1)] focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--color-accent-1)_22%,transparent)]">
        <input
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Select or type a role…"
          className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none"
        />
        {input && (
          <button
            type="button"
            onClick={() => { setInput(""); onChange(""); setOpen(true); }}
            className="px-2 text-muted-foreground hover:text-foreground"
          >
            <X size={13} />
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="px-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronDown size={14} className={"transition-transform " + (open ? "rotate-180" : "")} />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-border bg-[var(--color-surface)] shadow-[0_16px_40px_-20px_rgba(15,23,42,0.4)]">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">Use "{input}"</span>
              <button
                type="button"
                onClick={() => select(input)}
                className="rounded-lg bg-[var(--color-accent-1)] px-2.5 py-1 text-xs font-semibold text-white"
              >
                Add
              </button>
            </div>
          ) : (
            filtered.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => select(r)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent-1)_8%,transparent)]"
              >
                <span>{r}</span>
                {value === r && <Check size={13} className="text-[var(--color-accent-1)]" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const isPresident = (m: EcMember) => /president/i.test(m.role) && !/vice/i.test(m.role);
const isGS = (m: EcMember) =>
  /general secretary/i.test(m.role) || /^gs\b/i.test(m.role.trim());

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function Avatar({ m, size = "sm" }: { m: EcMember; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "h-16 w-16 rounded-xl text-sm" : "h-10 w-10 rounded-lg text-xs";
  return (
    <div className={`${cls} shrink-0 overflow-hidden bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))]`}>
      {m.photo_url ? (
        <img src={optimizeImage(m.photo_url, size === "lg" ? 128 : 80)} alt={m.name} className="h-full w-full object-cover" />
      ) : (
        <span className="grid h-full w-full place-items-center font-semibold text-white">
          {initials(m.name)}
        </span>
      )}
    </div>
  );
}

// ── Executive Committee view ─────────────────────────────────────────────────
function ExecutiveCommitteeView({
  items,
  loading,
  query,
  setQuery,
  yearFilter,
  setYearFilter,
  onEdit,
  onDelete,
}: {
  items: EcMember[];
  loading: boolean;
  query: string;
  setQuery: (v: string) => void;
  yearFilter: string;
  setYearFilter: (v: string) => void;
  onEdit: (m: EcMember) => void;
  onDelete: (m: EcMember) => void;
}) {
  const allYears = [...new Set(items.map((m) => m.year))].sort((a, b) => b - a);
  const filtered = items.filter((m) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.university.toLowerCase().includes(q);
    const matchesYear = yearFilter === "all" || String(m.year) === yearFilter;
    return matchesQ && matchesYear;
  });

  const byYear = new Map<number, EcMember[]>();
  for (const m of filtered) {
    const list = byYear.get(m.year) ?? [];
    list.push(m);
    byYear.set(m.year, list);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  if (loading) return <ListSkeleton />;
  return (
    <>
      <Toolbar query={query} onQuery={setQuery} placeholder="Search by name, role, university…">
        <FilterSelect
          value={yearFilter}
          onChange={setYearFilter}
          options={[
            { value: "all", label: "All sessions" },
            ...allYears.map((y) => ({ value: String(y), label: `Session ${y}` })),
          ]}
        />
      </Toolbar>
      {filtered.length === 0 ? (
        <EmptyState label={items.length === 0 ? "No members yet." : "No matches."} />
      ) : (
        <div className="space-y-8">
          {years.map((year) => (
            <div key={year}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="font-display text-lg font-bold">Session {year}</h3>
                {byYear.get(year)!.some((m) => m.is_current) && (
                  <span className="rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Current
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {byYear.get(year)!.length} members
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-(--color-surface)">
                {byYear.get(year)!.map((it, idx) => (
                  <div
                    key={it.id}
                    className={"flex items-center gap-3 p-3 " + (idx > 0 ? "border-t border-border" : "")}
                  >
                    <Avatar m={it} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium leading-tight">{it.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        <span className="text-(--color-accent-1)">{it.role}</span>
                        {it.university && <span> · {it.university}</span>}
                      </div>
                    </div>
                    <CardActions onEdit={() => onEdit(it)} onDelete={() => onDelete(it)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Honor Board view ─────────────────────────────────────────────────────────
function HonorBoardView({
  items,
  loading,
  onEdit,
  onDelete,
}: {
  items: EcMember[];
  loading: boolean;
  onEdit: (m: EcMember) => void;
  onDelete: (m: EcMember) => void;
}) {
  if (loading) return <ListSkeleton />;

  const past = items.filter((m) => !m.is_current);
  const byYear = new Map<number, EcMember[]>();
  for (const m of past) {
    const list = byYear.get(m.year) ?? [];
    list.push(m);
    byYear.set(m.year, list);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  if (years.length === 0) {
    return (
      <EmptyState label='No past office-bearers yet. Uncheck "Current session" on past members to list them here.' />
    );
  }

  return (
    <div className="space-y-5">
      {years.map((year) => {
        const list = byYear.get(year)!;
        const president = list.find(isPresident);
        const gs = list.find(isGS);
        if (!president && !gs) return null;
        return (
          <div key={year} className="overflow-hidden rounded-2xl border border-border bg-(--color-surface)">
            {/* Year header */}
            <div className="flex items-center gap-3 border-b border-border bg-[color-mix(in_oklab,var(--color-accent-1)_5%,transparent)] px-4 py-3">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white">
                <Crown size={13} />
              </div>
              <span className="font-display font-bold">Session {year}</span>
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Ex President &amp; General Secretary
              </span>
            </div>

            {/* President + GS */}
            {[
              { member: president, label: "President", Icon: Crown },
              { member: gs, label: "General Secretary", Icon: Gavel },
            ]
              .filter((row) => row.member)
              .map(({ member, label, Icon }, idx) => (
                <div
                  key={label}
                  className={"flex items-center gap-3 p-3 " + (idx > 0 ? "border-t border-border" : "")}
                >
                  <Avatar m={member!} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Icon size={12} className="text-(--color-accent-1) shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-accent-1)">
                        {label}
                      </span>
                    </div>
                    <div className="font-semibold leading-tight">{member!.name}</div>
                    {member!.university && (
                      <div className="truncate text-xs text-muted-foreground">{member!.university}</div>
                    )}
                  </div>
                  <CardActions onEdit={() => onEdit(member!)} onDelete={() => onDelete(member!)} />
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export function CommitteeSection({ view }: { view: "executive-committee" | "honor-board" }) {
  const { items, loading, reload } = useResource(committeeApi);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [confirm, confirmEl] = useConfirm();

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  function startNew() {
    setEditId(null);
    setForm({ ...empty, is_current: view === "executive-committee" });
    setOpen(true);
  }
  function startEdit(it: EcMember) {
    setEditId(it.id);
    setForm({
      name: it.name,
      role: it.role,
      university: it.university,
      year: String(it.year),
      is_current: it.is_current,
      photo_url: it.photo_url,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        role: form.role,
        university: form.university,
        year: Number(form.year),
        is_current: form.is_current,
        photo_url: form.photo_url,
      };
      if (editId == null) await committeeApi.create(payload);
      else await committeeApi.update(editId, payload);
      toast.success(editId == null ? "Member added" : "Member updated");
      setOpen(false);
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove(it: EcMember) {
    if (!(await confirm(`Remove ${it.name}?`))) return;
    try {
      await committeeApi.remove(it.id);
      toast.success("Removed");
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  const isEC = view === "executive-committee";
  const Icon = isEC ? ShieldCheck : Crown;
  const title = isEC ? "Executive Committee" : "Honor Board";
  const subtitle = isEC
    ? "Current session members — drives the Leadership page."
    : "Past Presidents & General Secretaries — drives the Honor Board page.";
  const newLabel = isEC ? "Add member" : "Add past leader";

  return (
    <div>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        count={items.length}
        onNew={startNew}
        newLabel={newLabel}
      />

      {isEC ? (
        <ExecutiveCommitteeView
          items={items}
          loading={loading}
          query={query}
          setQuery={setQuery}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          onEdit={startEdit}
          onDelete={remove}
        />
      ) : (
        <HonorBoardView
          items={items}
          loading={loading}
          onEdit={startEdit}
          onDelete={remove}
        />
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={save}
        saving={saving}
        title={editId == null ? `Add ${isEC ? "member" : "past leader"}` : "Edit"}
      >
        <Field label="Photo" full>
          <ImageUpload value={form.photo_url} onChange={(u) => set("photo_url", u)} folder="committee" />
        </Field>
        <Field label="Name">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Full name" />
        </Field>
        <Field label="Role / designation">
          <RoleCombobox value={form.role} onChange={(v) => set("role", v)} />
        </Field>
        <Field label="University">
          <input value={form.university} onChange={(e) => set("university", e.target.value)} className={inputCls} placeholder="University or college" />
        </Field>
        <Field label="Session year">
          <input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Current session?">
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_current}
              onChange={(e) => set("is_current", e.target.checked)}
            />
            This is the current session
          </label>
        </Field>
      </Modal>
      {confirmEl}
    </div>
  );
}
