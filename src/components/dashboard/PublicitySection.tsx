import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Newspaper, FileText, Calendar, PenLine } from "lucide-react";
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
  ListSkeleton,
  useConfirm,
  inputCls,
} from "./primitives";
import { ImageUpload } from "./ImageUpload";

type PostType = PublicityPost["type"];

/** Per-type copy: the picker card, and the labels/hints shown once a type is chosen. */
const TYPE_INFO: Record<
  PostType,
  {
    label: string;
    Icon: typeof Newspaper;
    description: string;
    subtitleLabel: string;
    subtitleHint: string;
    bodyHint: string;
    hasAuthor?: boolean;
  }
> = {
  press: {
    label: "Press Release",
    Icon: FileText,
    description: "An official statement written and issued by the organization.",
    subtitleLabel: "Subtitle",
    subtitleHint: "A short line under the title, shown on the card and at the top of the release.",
    bodyHint:
      "The full statement, written out in full. Shown on the site when there's no external link.",
  },
  news: {
    label: "News",
    Icon: Newspaper,
    description: "Coverage of PUSAB, often from an outside source.",
    subtitleLabel: "Excerpt",
    subtitleHint: "Short one-line summary shown on the card.",
    bodyHint: "Full text shown in the reader (when there's no external link).",
  },
  event: {
    label: "Event",
    Icon: Calendar,
    description: "An upcoming or past PUSAB event.",
    subtitleLabel: "Excerpt",
    subtitleHint: "Short one-line summary shown on the card.",
    bodyHint: "Full text shown in the reader (when there's no external link).",
  },
  blog: {
    label: "Column",
    Icon: PenLine,
    description: "A personal column or op-ed, written by an admin or member.",
    subtitleLabel: "Subtitle",
    subtitleHint: "A short line under the title, shown on the card.",
    bodyHint: "The full column — written like an op-ed.",
    hasAuthor: true,
  },
};

const TYPE_ORDER: PostType[] = ["news", "press", "event", "blog"];

interface Form {
  type: PostType;
  title: string;
  excerpt: string;
  body: string;
  link: string;
  image_url: string;
  date: string;
  author: string;
  published: boolean;
}

function emptyForm(type: PostType): Form {
  return {
    type,
    title: "",
    excerpt: "",
    body: "",
    link: "",
    image_url: "",
    date: new Date().toISOString().slice(0, 10),
    author: "",
    published: true,
  };
}

export function PublicitySection() {
  const { items, loading, reload } = useResource(publicityApi);
  // Two-step "Add post": null while picking a type, a Form once one is chosen.
  const [picking, setPicking] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [confirm, confirmEl] = useConfirm();

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  function startNew() {
    setEditId(null);
    setForm(null);
    setPicking(true);
  }
  function pickType(type: PostType) {
    setForm(emptyForm(type));
    setPicking(false);
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
      author: it.author,
      published: it.published,
    });
  }
  function closeForm() {
    setPicking(false);
    setForm(null);
    setEditId(null);
  }

  async function save() {
    if (!form) return;
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
        author: form.author,
        published: form.published,
      };
      if (editId == null) await publicityApi.create(payload);
      else await publicityApi.update(editId, payload);
      toast.success(editId == null ? "Post created" : "Post updated");
      closeForm();
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

  const info = form ? TYPE_INFO[form.type] : null;

  return (
    <div>
      <SectionHeader
        title="Publicity"
        subtitle="News, press releases, events and columns shown on the Publicity page."
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
            { value: "blog", label: "Column" },
          ]}
        />
      </Toolbar>

      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState label={items.length === 0 ? "No posts yet." : "No matches."} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
          {filtered.map((it, idx) => (
            <div
              key={it.id}
              className={
                "group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent-1)_4%,transparent)] " +
                (idx > 0 ? "border-t border-border" : "")
              }
            >
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-[var(--color-background)]">
                {it.image_url ? (
                  <img src={it.image_url} alt={it.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground/30">
                    <ExternalLink size={13} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-tight">{it.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full border border-border bg-[var(--color-background)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {it.type}
                  </span>
                  {it.date && <span className="text-[11px] text-muted-foreground">{it.date}</span>}
                  {!it.published && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                      Draft
                    </span>
                  )}
                  {it.link && <ExternalLink size={10} className="text-muted-foreground/50" />}
                </div>
              </div>
              <CardActions onEdit={() => startEdit(it)} onDelete={() => remove(it)} />
            </div>
          ))}
        </div>
      )}

      {/* Step 1: pick which kind of post to create. */}
      <Modal
        open={picking}
        onClose={closeForm}
        onSubmit={closeForm}
        title="What are you posting?"
        hideFooter
      >
        <div className="grid gap-3 sm:col-span-2 sm:grid-cols-3">
          {TYPE_ORDER.map((t) => {
            const { label, Icon, description } = TYPE_INFO[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => pickType(t)}
                className="flex flex-col items-start gap-2.5 rounded-2xl border border-border p-4 text-left transition-all hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-accent-1)_4%,transparent)]"
              >
                <span
                  className="inline-grid h-9 w-9 place-items-center rounded-xl text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))",
                  }}
                >
                  <Icon size={16} />
                </span>
                <span className="font-display text-sm font-bold">{label}</span>
                <span className="text-xs leading-relaxed text-muted-foreground">{description}</span>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Step 2: the actual form, tailored to the chosen type. */}
      <Modal
        open={form !== null}
        onClose={closeForm}
        onSubmit={save}
        saving={saving}
        title={
          editId != null
            ? `Edit ${info?.label.toLowerCase()}`
            : `New ${info?.label.toLowerCase() ?? "post"}`
        }
      >
        {form && info && (
          <>
            <Field label="Cover image" full>
              <ImageUpload
                value={form.image_url}
                onChange={(u) => set("image_url", u)}
                folder="publicity"
              />
            </Field>
            <Field label="Title" full>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className={inputCls}
              />
            </Field>
            {info.hasAuthor && (
              <Field label="Author" full hint="Shown as the byline under the title.">
                <input
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="e.g. PUSAB President"
                  className={inputCls}
                />
              </Field>
            )}
            <Field label={info.subtitleLabel} full hint={info.subtitleHint}>
              <input
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Published">
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => set("published", e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-[var(--color-accent-1)]"
                />
                Visible on the site
              </label>
            </Field>
            <Field label="Body" full hint={info.bodyHint}>
              <textarea
                rows={8}
                value={form.body}
                onChange={(e) => set("body", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field
              label="External link"
              full
              hint="If set, clicking the card opens this URL instead of showing the body above."
            >
              <input
                type="url"
                placeholder="https://…"
                value={form.link}
                onChange={(e) => set("link", e.target.value)}
                className={inputCls}
              />
            </Field>
          </>
        )}
      </Modal>
      {confirmEl}
    </div>
  );
}
