import { useState } from "react";
import { toast } from "sonner";
import { felicitationApi, type FelicitationEntry } from "@/lib/api";
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

const CAT_LABEL: Record<FelicitationEntry["category"], string> = {
  achiever: "Achiever",
  fresher: "Fresher",
};

interface Form {
  name: string;
  title: string;
  category: FelicitationEntry["category"];
  year: string;
  image_url: string;
  note: string;
}

const empty: Form = {
  name: "",
  title: "",
  category: "achiever",
  year: String(new Date().getFullYear()),
  image_url: "",
  note: "",
};

export function FelicitationSection() {
  const { items, loading, reload } = useResource(felicitationApi);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [confirm, confirmEl] = useConfirm();

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  function startNew() {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  }
  function startEdit(it: FelicitationEntry) {
    setEditId(it.id);
    setForm({
      name: it.name,
      title: it.title,
      category: it.category,
      year: String(it.year),
      image_url: it.image_url,
      note: it.note,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        title: form.title,
        category: form.category,
        year: Number(form.year),
        image_url: form.image_url,
        note: form.note,
      };
      if (editId == null) await felicitationApi.create(payload);
      else await felicitationApi.update(editId, payload);
      toast.success(editId == null ? "Entry added" : "Entry updated");
      setOpen(false);
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove(it: FelicitationEntry) {
    if (!(await confirm(`Remove ${it.name}?`))) return;
    try {
      await felicitationApi.remove(it.id);
      toast.success("Removed");
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  const filtered = items.filter((it) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q || it.name.toLowerCase().includes(q) || it.title.toLowerCase().includes(q);
    const matchesC = catFilter === "all" || it.category === catFilter;
    return matchesQ && matchesC;
  });

  return (
    <div>
      <SectionHeader
        title="Felicitation"
        subtitle="Achievers felicitated and freshers welcomed — shown on the Felicitation & Freshers page."
        count={items.length}
        onNew={startNew}
        newLabel="Add entry"
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search by name or achievement…">
        <FilterSelect
          value={catFilter}
          onChange={setCatFilter}
          options={[
            { value: "all", label: "All" },
            { value: "achiever", label: "Achievers" },
            { value: "fresher", label: "Freshers" },
          ]}
        />
      </Toolbar>

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState label={items.length === 0 ? "No entries yet." : "No matches."} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
          {filtered.map((it, idx) => (
            <div
              key={it.id}
              className={"group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent-1)_4%,transparent)] " + (idx > 0 ? "border-t border-border" : "")}
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl" style={{ background: "linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))" }}>
                {it.image_url ? (
                  <img src={it.image_url} alt={it.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-xs font-bold text-white">
                    {it.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold leading-tight">{it.name}</span>
                  <span
                    className={
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide " +
                      (it.category === "achiever"
                        ? "bg-[color-mix(in_oklab,var(--color-accent-1)_14%,transparent)] text-[var(--color-accent-1)]"
                        : "bg-[color-mix(in_oklab,var(--color-accent-3)_16%,transparent)] text-[var(--color-accent-3)]")
                    }
                  >
                    {CAT_LABEL[it.category]}
                  </span>
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  {it.year}
                  {it.title && <span> · {it.title}</span>}
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
        title={editId == null ? "Add entry" : "Edit entry"}
      >
        <Field label="Photo" full>
          <ImageUpload value={form.image_url} onChange={(u) => set("image_url", u)} folder="felicitation" />
        </Field>
        <Field label="Name">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Year">
          <input
            type="number"
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value as Form["category"])}
            className={inputCls}
          >
            <option value="achiever">Achiever (felicitated)</option>
            <option value="fresher">Fresher (welcomed)</option>
          </select>
        </Field>
        <Field label="Achievement / institution">
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Note" full>
          <textarea
            rows={3}
            value={form.note}
            onChange={(e) => set("note", e.target.value)}
            className={inputCls}
          />
        </Field>
      </Modal>
      {confirmEl}
    </div>
  );
}
