import { useState } from "react";
import { toast } from "sonner";
import { programsApi, type Program } from "@/lib/api";
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

const STATUS_STYLE: Record<Program["status"], string> = {
  upcoming: "bg-[color-mix(in_oklab,var(--color-accent-1)_16%,transparent)] text-[var(--color-accent-1)]",
  ongoing: "bg-[color-mix(in_oklab,var(--color-accent-3)_18%,transparent)] text-[var(--color-accent-3)]",
  completed: "bg-[var(--color-background)] text-muted-foreground",
};

interface Form {
  title: string;
  category: string;
  description: string;
  location: string;
  image_url: string;
  date: string;
  ongoing: boolean;
  recurrence: string;
}

const empty: Form = {
  title: "",
  category: "",
  description: "",
  location: "",
  image_url: "",
  date: "",
  ongoing: false,
  recurrence: "",
};

export function ProgramsSection() {
  const { items, loading, reload } = useResource(programsApi);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirm, confirmEl] = useConfirm();

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  function startNew() {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  }
  function startEdit(it: Program) {
    setEditId(it.id);
    setForm({
      title: it.title,
      category: it.category,
      description: it.description,
      location: it.location,
      image_url: it.image_url,
      date: it.date ?? "",
      ongoing: it.ongoing,
      recurrence: it.recurrence,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.ongoing && !form.date) return toast.error("Set a date, or mark it ongoing");
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        location: form.location,
        image_url: form.image_url,
        date: form.ongoing ? null : form.date || null,
        ongoing: form.ongoing,
        recurrence: form.recurrence,
      };
      if (editId == null) await programsApi.create(payload);
      else await programsApi.update(editId, payload);
      toast.success(editId == null ? "Program added" : "Program updated");
      setOpen(false);
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove(it: Program) {
    if (!(await confirm(`Delete "${it.title}"? This can't be undone.`))) return;
    try {
      await programsApi.remove(it.id);
      toast.success("Deleted");
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  const filtered = items.filter((it) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q || it.title.toLowerCase().includes(q) || it.category.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || it.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  return (
    <div>
      <SectionHeader
        title="Programs"
        subtitle="Programs & events. Status is computed automatically from the date."
        count={items.length}
        onNew={startNew}
        newLabel="Add program"
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search programs…">
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All statuses" },
            { value: "upcoming", label: "Upcoming" },
            { value: "ongoing", label: "Ongoing" },
            { value: "completed", label: "Completed" },
          ]}
        />
      </Toolbar>

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState label={items.length === 0 ? "No programs yet." : "No matches."} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
          {filtered.map((it, idx) => (
            <div
              key={it.id}
              className={"group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent-1)_4%,transparent)] " + (idx > 0 ? "border-t border-border" : "")}
            >
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-[var(--color-background)]">
                {it.image_url ? (
                  <img src={it.image_url} alt={it.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full" style={{ background: "linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))", opacity: 0.15 }} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={"rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide " + STATUS_STYLE[it.status]}>
                    {it.status}
                  </span>
                  <span className="truncate text-sm font-semibold leading-tight">{it.title}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  {it.category && (
                    <span className="rounded-full border border-border bg-[var(--color-background)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                      {it.category}
                    </span>
                  )}
                  <span>{it.ongoing ? it.recurrence || "Ongoing" : it.date}</span>
                  {it.location && <span className="truncate">· {it.location}</span>}
                </div>
              </div>
              <CardActions onEdit={() => startEdit(it)} onDelete={() => remove(it)} />
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={save}
        saving={saving}
        title={editId == null ? "Add program" : "Edit program"}
      >
        <Field label="Cover image" full>
          <ImageUpload value={form.image_url} onChange={(u) => set("image_url", u)} folder="programs" />
        </Field>
        <Field label="Title">
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Category" hint="e.g. Flagship, Aid, Education">
          <input
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Ongoing?">
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.ongoing}
              onChange={(e) => set("ongoing", e.target.checked)}
            />
            Always-on / recurring
          </label>
        </Field>
        {form.ongoing ? (
          <Field label="Recurrence" hint="e.g. Weekly sessions, Monthly">
            <input
              value={form.recurrence}
              onChange={(e) => set("recurrence", e.target.value)}
              className={inputCls}
            />
          </Field>
        ) : (
          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className={inputCls}
            />
          </Field>
        )}
        <Field label="Location" full>
          <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Description" full>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputCls}
          />
        </Field>
      </Modal>
      {confirmEl}
    </div>
  );
}
