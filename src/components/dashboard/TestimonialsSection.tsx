import { useState } from "react";
import { toast } from "sonner";
import { testimonialsApi, type Testimonial } from "@/lib/api";
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

interface Form {
  name: string;
  role: string;
  quote: string;
  photo_url: string;
  program: string;
  is_featured: boolean;
  order: string;
}

const empty: Form = {
  name: "",
  role: "",
  quote: "",
  photo_url: "",
  program: "",
  is_featured: true,
  order: "0",
};

export function TestimonialsSection() {
  const { items, loading, reload } = useResource(testimonialsApi);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [confirm, confirmEl] = useConfirm();

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  function startNew() {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  }
  function startEdit(it: Testimonial) {
    setEditId(it.id);
    setForm({
      name: it.name,
      role: it.role,
      quote: it.quote,
      photo_url: it.photo_url,
      program: it.program,
      is_featured: it.is_featured,
      order: String(it.order),
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.quote.trim()) return toast.error("Quote is required");
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        role: form.role,
        quote: form.quote,
        photo_url: form.photo_url,
        program: form.program,
        is_featured: form.is_featured,
        order: Number(form.order) || 0,
      };
      if (editId == null) await testimonialsApi.create(payload);
      else await testimonialsApi.update(editId, payload);
      toast.success(editId == null ? "Testimonial added" : "Testimonial updated");
      setOpen(false);
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove(it: Testimonial) {
    if (!(await confirm(`Remove ${it.name}'s testimonial?`))) return;
    try {
      await testimonialsApi.remove(it.id);
      toast.success("Removed");
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  const filtered = items.filter((it) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q ||
      it.name.toLowerCase().includes(q) ||
      it.role.toLowerCase().includes(q) ||
      it.quote.toLowerCase().includes(q);
    const matchesF =
      featuredFilter === "all" ||
      (featuredFilter === "featured" ? it.is_featured : !it.is_featured);
    return matchesQ && matchesF;
  });

  return (
    <div>
      <SectionHeader
        title="Testimonials"
        subtitle="Community voices shown in the homepage testimonials carousel."
        count={items.length}
        onNew={startNew}
        newLabel="Add testimonial"
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search by name, role or quote…">
        <FilterSelect
          value={featuredFilter}
          onChange={setFeaturedFilter}
          options={[
            { value: "all", label: "All" },
            { value: "featured", label: "Featured" },
            { value: "hidden", label: "Hidden" },
          ]}
        />
      </Toolbar>

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState label={items.length === 0 ? "No testimonials yet." : "No matches."} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
          {filtered.map((it, idx) => (
            <div
              key={it.id}
              className={"group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent-1)_4%,transparent)] " + (idx > 0 ? "border-t border-border" : "")}
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full" style={{ background: "linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))" }}>
                {it.photo_url ? (
                  <img src={it.photo_url} alt={it.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-xs font-bold text-white">
                    {it.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold leading-tight">{it.name}</span>
                  {it.is_featured && (
                    <span className="shrink-0 rounded-full bg-[color-mix(in_oklab,var(--color-accent-1)_14%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent-1)]">
                      Featured
                    </span>
                  )}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  {it.role || "—"} · order {it.order}
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
        title={editId == null ? "Add testimonial" : "Edit testimonial"}
      >
        <Field label="Photo" full>
          <ImageUpload value={form.photo_url} onChange={(u) => set("photo_url", u)} folder="testimonials" />
        </Field>
        <Field label="Name">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Role / context" hint='e.g. "Scholarship Recipient 2023"'>
          <input value={form.role} onChange={(e) => set("role", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Program">
          <input value={form.program} onChange={(e) => set("program", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Display order">
          <input
            type="number"
            value={form.order}
            onChange={(e) => set("order", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Featured on homepage" full>
          <label className="mt-1.5 flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set("is_featured", e.target.checked)}
              className="h-4 w-4 rounded border-border accent-[var(--color-accent-1)]"
            />
            Show in the homepage carousel
          </label>
        </Field>
        <Field label="Quote" full>
          <textarea
            rows={4}
            value={form.quote}
            onChange={(e) => set("quote", e.target.value)}
            className={inputCls}
          />
        </Field>
      </Modal>
      {confirmEl}
    </div>
  );
}
