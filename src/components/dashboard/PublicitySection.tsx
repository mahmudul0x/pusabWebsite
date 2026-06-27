import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { publicityApi, type PublicityPost } from "@/lib/api";
import { useResource, errMessage } from "./useResource";
import {
  Field,
  Modal,
  SectionHeader,
  EmptyState,
  CardActions,
  Toolbar,
  FilterSelect,
  useConfirm,
  inputCls,
} from "./primitives";
import { ImageUpload } from "./ImageUpload";

const TYPES = ["news", "press", "event"] as const;

interface Form {
  type: PublicityPost["type"];
  title: string;
  excerpt: string;
  body: string;
  link: string;
  image_url: string;
  date: string;
  published: boolean;
}

const empty: Form = {
  type: "news",
  title: "",
  excerpt: "",
  body: "",
  link: "",
  image_url: "",
  date: new Date().toISOString().slice(0, 10),
  published: true,
};

export function PublicitySection() {
  const { items, loading, reload } = useResource(publicityApi);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [confirm, confirmEl] = useConfirm();

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  function startNew() {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  }
  function startEdit(it: PublicityPost) {
    setEditId(it.id);
    setForm({
      type: it.type,
      title: it.title,
      excerpt: it.excerpt,
      body: it.body,
      link: it.link,
      image_url: it.image_url,
      date: it.date ?? "",
      published: it.published,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);
    try {
      const payload = {
        type: form.type,
        title: form.title,
        excerpt: form.excerpt,
        body: form.body,
        link: form.link,
        image_url: form.image_url,
        date: form.date || null,
        published: form.published,
      };
      if (editId == null) await publicityApi.create(payload);
      else await publicityApi.update(editId, payload);
      toast.success(editId == null ? "Post created" : "Post updated");
      setOpen(false);
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove(it: PublicityPost) {
    if (!(await confirm(`Delete "${it.title}"? This can't be undone.`))) return;
    try {
      await publicityApi.remove(it.id);
      toast.success("Deleted");
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  const filtered = items.filter((it) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q || it.title.toLowerCase().includes(q) || it.excerpt.toLowerCase().includes(q);
    const matchesType = typeFilter === "all" || it.type === typeFilter;
    return matchesQ && matchesType;
  });

  return (
    <div>
      <SectionHeader
        title="Publicity"
        subtitle="News, press releases and events shown on the Publicity page."
        count={items.length}
        onNew={startNew}
        newLabel="Add post"
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search posts…">
        <FilterSelect
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: "all", label: "All types" },
            { value: "news", label: "News" },
            { value: "press", label: "Press" },
            { value: "event", label: "Event" },
          ]}
        />
      </Toolbar>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-[var(--color-surface)]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState label={items.length === 0 ? "No posts yet." : "No matches."} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
          {filtered.map((it, idx) => (
            <div
              key={it.id}
              className={
                "flex items-center gap-4 p-3 sm:px-4 " +
                (idx > 0 ? "border-t border-border" : "")
              }
            >
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--color-background)]">
                {it.image_url ? (
                  <img src={it.image_url} alt={it.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground">
                    <ExternalLink size={14} className="opacity-40" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium leading-tight">{it.title}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded bg-[var(--color-background)] px-1.5 py-0.5 uppercase tracking-wide">
                    {it.type}
                  </span>
                  {it.date && <span>{it.date}</span>}
                  {!it.published && <span className="text-amber-500">· draft</span>}
                  {it.link && <ExternalLink size={11} className="opacity-70" />}
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
        title={editId == null ? "Add post" : "Edit post"}
      >
        <Field label="Cover image" full>
          <ImageUpload value={form.image_url} onChange={(u) => set("image_url", u)} folder="publicity" />
        </Field>
        <Field label="Title" full>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Type">
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value as Form["type"])}
            className={inputCls}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Date">
          <input
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Excerpt" full hint="Short one-line summary shown on the card.">
          <input value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Body" full hint="Full text shown in the reader (when there's no external link).">
          <textarea
            rows={5}
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="External link" full hint="If set, clicking the card opens this URL.">
          <input
            type="url"
            placeholder="https://…"
            value={form.link}
            onChange={(e) => set("link", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Published">
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            Visible on the site
          </label>
        </Field>
      </Modal>
      {confirmEl}
    </div>
  );
}
