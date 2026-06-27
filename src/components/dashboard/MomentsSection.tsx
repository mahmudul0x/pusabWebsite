import { useState } from "react";
import { toast } from "sonner";
import { galleryApi, type GalleryItem } from "@/lib/api";
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

const CATEGORIES = ["events", "achievements", "community", "reunion", "other"] as const;

interface Form {
  title: string;
  caption: string;
  category: GalleryItem["category"];
  year: string;
  image_url: string;
}

const empty: Form = {
  title: "",
  caption: "",
  category: "events",
  year: String(new Date().getFullYear()),
  image_url: "",
};

export function MomentsSection() {
  const { items, loading, reload } = useResource(galleryApi);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [confirm, confirmEl] = useConfirm();

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  function startNew() {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  }
  function startEdit(it: GalleryItem) {
    setEditId(it.id);
    setForm({
      title: it.title,
      caption: it.caption,
      category: it.category,
      year: it.year ? String(it.year) : "",
      image_url: it.image_url,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.image_url) return toast.error("Please upload an image");
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        caption: form.caption,
        category: form.category,
        year: form.year ? Number(form.year) : null,
        image_url: form.image_url,
      };
      if (editId == null) await galleryApi.create(payload);
      else await galleryApi.update(editId, payload);
      toast.success(editId == null ? "Photo added" : "Photo updated");
      setOpen(false);
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove(it: GalleryItem) {
    if (!(await confirm(`Delete "${it.title || "this photo"}"? This can't be undone.`))) return;
    try {
      await galleryApi.remove(it.id);
      toast.success("Deleted");
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  const filtered = items.filter((it) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q || it.title.toLowerCase().includes(q) || it.caption.toLowerCase().includes(q);
    const matchesC = cat === "all" || it.category === cat;
    return matchesQ && matchesC;
  });

  return (
    <div>
      <SectionHeader
        title="Moments"
        subtitle="Photo gallery shown on the public Moments page."
        count={items.length}
        onNew={startNew}
        newLabel="Add photo"
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search photos…">
        <FilterSelect
          value={cat}
          onChange={setCat}
          options={[
            { value: "all", label: "All categories" },
            ...CATEGORIES.map((c) => ({ value: c, label: c })),
          ]}
        />
      </Toolbar>

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState label={items.length === 0 ? "No photos yet. Add your first one." : "No matches."} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
          {filtered.map((it, idx) => (
            <div
              key={it.id}
              className={"flex items-center gap-4 p-3 sm:px-4 " + (idx > 0 ? "border-t border-border" : "")}
            >
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--color-background)]">
                <img src={it.image_url} alt={it.title} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium leading-tight">{it.title || "Untitled"}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded bg-[var(--color-background)] px-1.5 py-0.5 uppercase tracking-wide">
                    {it.category}
                  </span>
                  <span>{it.year ?? "—"}</span>
                  {it.caption && <span className="truncate">· {it.caption}</span>}
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
        title={editId == null ? "Add photo" : "Edit photo"}
      >
        <Field label="Image" full>
          <ImageUpload value={form.image_url} onChange={(u) => set("image_url", u)} folder="moments" />
        </Field>
        <Field label="Title">
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
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
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Caption" full>
          <input value={form.caption} onChange={(e) => set("caption", e.target.value)} className={inputCls} />
        </Field>
      </Modal>
      {confirmEl}
    </div>
  );
}
