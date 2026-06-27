import { useState } from "react";
import { toast } from "sonner";
import { committeeApi, type EcMember } from "@/lib/api";
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

export function CommitteeSection() {
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
    setForm(empty);
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
    if (!(await confirm(`Remove ${it.name} from the committee?`))) return;
    try {
      await committeeApi.remove(it.id);
      toast.success("Removed");
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  // Filter, then group by session year for a clear overview.
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

  return (
    <div>
      <SectionHeader
        title="Committee"
        subtitle="Executive Committee members by session — drives the Leadership & Honor Board pages."
        count={items.length}
        onNew={startNew}
        newLabel="Add member"
      />

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

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
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
              <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
                {byYear.get(year)!.map((it, idx) => (
                  <div
                    key={it.id}
                    className={"flex items-center gap-3 p-3 " + (idx > 0 ? "border-t border-border" : "")}
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))]">
                      {it.photo_url ? (
                        <img src={it.photo_url} alt={it.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="grid h-full w-full place-items-center text-xs font-semibold text-white">
                          {it.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium leading-tight">{it.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        <span className="text-[var(--color-accent-1)]">{it.role}</span>
                        {it.university && <span> · {it.university}</span>}
                      </div>
                    </div>
                    <CardActions onEdit={() => startEdit(it)} onDelete={() => remove(it)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={save}
        saving={saving}
        title={editId == null ? "Add member" : "Edit member"}
      >
        <Field label="Photo" full>
          <ImageUpload value={form.photo_url} onChange={(u) => set("photo_url", u)} folder="committee" />
        </Field>
        <Field label="Name">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Role / designation">
          <input
            list="ec-roles"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            className={inputCls}
          />
          <datalist id="ec-roles">
            {ROLES.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </Field>
        <Field label="University">
          <input
            value={form.university}
            onChange={(e) => set("university", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Session year">
          <input
            type="number"
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Current committee?">
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
