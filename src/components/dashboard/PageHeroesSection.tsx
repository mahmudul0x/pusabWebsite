import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ImageIcon,
  Check,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { pageHeroApi, optimizeImage, type PageHero, type PageHeroImage, type PageHeroKey } from "@/lib/api";
import { Field, inputCls } from "./primitives";
import { ImageUpload } from "./ImageUpload";
import { errMessage } from "./useResource";

const PAGES: { key: PageHeroKey; label: string; path: string; multiImage?: boolean }[] = [
  { key: "home", label: "Home", path: "/", multiImage: true },
  { key: "about", label: "About", path: "/about" },
  { key: "programs", label: "Programs", path: "/programs" },
  { key: "leadership", label: "Leadership", path: "/leadership" },
  { key: "moments", label: "Moments", path: "/moments" },
  { key: "publicity", label: "Publicity", path: "/publicity" },
  { key: "convening-committee", label: "Convening Committee", path: "/convening-committee" },
  { key: "honor-board", label: "Honor Board", path: "/honor-board" },
];

type ImageRow = { image_url: string; alt_text: string; order: number };

type Form = {
  title: string;
  lede: string;
  images: ImageRow[];
};

const emptyForm: Form = { title: "", lede: "", images: [] };

function toForm(h: PageHero): Form {
  return {
    title: h.title,
    lede: h.lede,
    images: h.images
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((img) => ({ image_url: img.image_url, alt_text: img.alt_text, order: img.order })),
  };
}

function sameForm(a: Form, b: Form): boolean {
  if (a.title !== b.title || a.lede !== b.lede) return false;
  if (a.images.length !== b.images.length) return false;
  return a.images.every((img, i) => img.image_url === b.images[i].image_url && img.alt_text === b.images[i].alt_text);
}

export function PageHeroesSection() {
  const [page, setPage] = useState<PageHeroKey>("home");
  const [saved, setSaved] = useState<Partial<Record<PageHeroKey, Form>>>({});
  const [forms, setForms] = useState<Partial<Record<PageHeroKey, Form>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const meta = PAGES.find((p) => p.key === page)!;
  const form = forms[page] ?? emptyForm;
  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForms((f) => ({ ...f, [page]: { ...(f[page] ?? emptyForm), [k]: v } }));

  useEffect(() => {
    setLoading(true);
    Promise.all(PAGES.map((p) => pageHeroApi.get(p.key)))
      .then((results) => {
        const next: Partial<Record<PageHeroKey, Form>> = {};
        results.forEach((h, i) => {
          next[PAGES[i].key] = toForm(h);
        });
        setForms(next);
        setSaved(next);
      })
      .catch((e) => toast.error(errMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const dirty = !loading && !sameForm(form, saved[page] ?? emptyForm);
  const customizedPages = useMemo(
    () => new Set(PAGES.filter((p) => {
      const f = forms[p.key];
      return f && (f.title || f.lede || f.images.length > 0);
    }).map((p) => p.key)),
    [forms],
  );

  function setImage(index: number, url: string) {
    const images = form.images.slice();
    images[index] = { ...images[index], image_url: url };
    set("images", images);
  }

  function addImage() {
    set("images", [...form.images, { image_url: "", alt_text: "", order: form.images.length }]);
  }

  function removeImage(index: number) {
    set(
      "images",
      form.images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i })),
    );
  }

  function reorder(from: number, to: number) {
    if (from === to) return;
    const images = form.images.slice();
    const [moved] = images.splice(from, 1);
    images.splice(to, 0, moved);
    set("images", images.map((img, i) => ({ ...img, order: i })));
  }

  function discard() {
    setForms((f) => ({ ...f, [page]: saved[page] ?? emptyForm }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const images = form.images
        .filter((img) => img.image_url)
        .map((img, i) => ({ ...img, order: i }));
      await pageHeroApi.update(page, { title: form.title, lede: form.lede, images });
      const next = { ...form, images };
      set("images", images);
      setSaved((s) => ({ ...s, [page]: next }));
      toast.success(`${meta.label} hero saved`);
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-20 text-muted-foreground">
        <Loader2 className="animate-spin" size={18} /> Loading page heroes…
      </div>
    );
  }

  const previewImage = form.images[0]?.image_url;

  return (
    <div>
      <div className="mb-7">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">Page heroes</h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          The banner image and heading shown at the top of each page. Leave a field empty to keep
          the site's default.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Page picker */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {PAGES.map((p) => {
            const f = forms[p.key];
            const isCustom = customizedPages.has(p.key);
            const active = page === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setPage(p.key)}
                className={
                  "group flex shrink-0 items-center gap-3 rounded-xl border p-2.5 text-left transition-all lg:shrink " +
                  (active
                    ? "border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-1)_6%,var(--color-surface))] shadow-sm"
                    : "border-border bg-[var(--color-surface)] hover:border-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)]")
                }
              >
                <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-[var(--color-background)]">
                  {f?.images[0]?.image_url ? (
                    <img
                      src={optimizeImage(f.images[0].image_url, 160)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center">
                      <ImageIcon size={13} className="text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={"truncate text-[13px] font-semibold " + (active ? "text-foreground" : "text-foreground/80")}>
                    {p.label}
                  </p>
                  <span
                    className={
                      "mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium " +
                      (isCustom ? "text-[var(--color-accent-1)]" : "text-muted-foreground/60")
                    }
                  >
                    <span className={"h-1.5 w-1.5 rounded-full " + (isCustom ? "bg-[var(--color-accent-1)]" : "bg-muted-foreground/30")} />
                    {isCustom ? "Customized" : "Default"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Editor + preview */}
        <div className="min-w-0 space-y-5">
          {/* Live preview */}
          <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
                Live preview
              </span>
              <a
                href={meta.path}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-[var(--color-accent-1)]"
              >
                View {meta.label} page <ExternalLink size={10} />
              </a>
            </div>
            <div className="relative flex min-h-[180px] items-end overflow-hidden p-6">
              {previewImage ? (
                <>
                  <img src={optimizeImage(previewImage, 800)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/55 to-slate-950/85" />
                </>
              ) : (
                <div className="absolute inset-0 overflow-hidden" aria-hidden>
                  <div className="absolute -top-16 -left-10 h-40 w-40 rounded-full bg-[var(--color-accent-1)] opacity-[0.18] blur-[60px]" />
                  <div className="absolute top-1/3 -right-10 h-40 w-40 rounded-full bg-[var(--color-accent-2)] opacity-[0.14] blur-[60px]" />
                </div>
              )}
              <div className={"relative z-10 " + (previewImage ? "text-white" : "text-foreground")}>
                <div className="mb-2.5 h-1 w-10 rounded-full bg-[linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2))]" />
                <p className="font-display text-xl font-extrabold tracking-tight leading-tight sm:text-2xl">
                  {form.title || <span className="opacity-50">Using site default title</span>}
                </p>
                {(form.lede || !form.title) && (
                  <p className={"mt-2 max-w-md text-xs leading-relaxed sm:text-sm " + (previewImage ? "text-white/75" : "text-muted-foreground")}>
                    {form.lede || "Using site default subtitle"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <form key={page} onSubmit={save} className="space-y-5 rounded-2xl border border-border bg-[var(--color-surface)] p-6">
            <Field label="Title" hint="Leave empty to use the site's default heading for this page.">
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className={inputCls}
                placeholder="Default heading"
              />
            </Field>
            <Field label="Subtitle" hint="Leave empty to use the site's default subtitle for this page.">
              <textarea
                value={form.lede}
                onChange={(e) => set("lede", e.target.value)}
                className={inputCls + " min-h-[80px] resize-y"}
                placeholder="Default subtitle"
              />
            </Field>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
                {meta.multiImage ? "Slideshow images" : "Banner image"}
              </span>
              <p className="mt-1 mb-3 text-[11px] text-muted-foreground">
                {meta.multiImage
                  ? "Add one or more photos — they'll rotate automatically. Drag to reorder. Leave empty to use the site's default slides."
                  : "Leave empty to use the site's default photo."}
              </p>

              <div className="space-y-2.5">
                {form.images.map((img, i) => (
                  <div
                    key={i}
                    draggable={meta.multiImage}
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => meta.multiImage && e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragIndex !== null) reorder(dragIndex, i);
                      setDragIndex(null);
                    }}
                    onDragEnd={() => setDragIndex(null)}
                    className={
                      "flex items-start gap-3 rounded-xl border p-3 transition-all " +
                      (dragIndex === i ? "opacity-40" : "border-border")
                    }
                  >
                    {meta.multiImage && (
                      <span className="mt-3 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing">
                        <GripVertical size={16} />
                      </span>
                    )}
                    <div className="flex-1 space-y-2.5">
                      <ImageUpload value={img.image_url} onChange={(url) => setImage(i, url)} folder="page-heroes" />
                      <input
                        value={img.alt_text}
                        onChange={(e) => {
                          const images = form.images.slice();
                          images[i] = { ...images[i], alt_text: e.target.value };
                          set("images", images);
                        }}
                        className={inputCls + " mt-0"}
                        placeholder="Alt text (for accessibility)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="mt-1 shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                      aria-label="Remove image"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}

                {(meta.multiImage || form.images.length === 0) && (
                  <button
                    type="button"
                    onClick={addImage}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_50%,transparent)] hover:text-[var(--color-accent-1)]"
                  >
                    {form.images.length === 0 ? (
                      <>
                        <ImageIcon size={15} /> Add image
                      </>
                    ) : (
                      <>
                        <Plus size={15} /> Add another slide
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Sticky save bar — only surfaces once there's something to save */}
            <div
              className={
                "sticky bottom-0 -mx-6 -mb-6 flex items-center justify-between gap-3 border-t px-6 py-3.5 transition-all " +
                (dirty
                  ? "border-border bg-[color-mix(in_oklab,var(--color-surface)_92%,var(--color-accent-1))]"
                  : "border-transparent")
              }
            >
              <span className="text-xs text-muted-foreground">
                {dirty ? (
                  "You have unsaved changes"
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-emerald-600">
                    <Check size={13} /> All changes saved
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                {dirty && (
                  <button
                    type="button"
                    onClick={discard}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-[var(--color-background)] hover:text-foreground"
                  >
                    <RotateCcw size={13} /> Discard
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving || !dirty}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
                  style={{ background: "linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))" }}
                >
                  <Save size={14} /> {saving ? "Saving…" : "Save hero"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Re-exported so callers only need to import the section, not the row type.
export type { PageHeroImage };
