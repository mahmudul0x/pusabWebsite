import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, GripVertical, ImageIcon } from "lucide-react";
import { pageHeroApi, type PageHero, type PageHeroImage, type PageHeroKey } from "@/lib/api";
import { Field, inputCls } from "./primitives";
import { ImageUpload } from "./ImageUpload";
import { errMessage } from "./useResource";

const PAGES: { key: PageHeroKey; label: string; multiImage?: boolean }[] = [
  { key: "home", label: "Home", multiImage: true },
  { key: "about", label: "About" },
  { key: "programs", label: "Programs" },
  { key: "leadership", label: "Leadership" },
  { key: "moments", label: "Moments" },
  { key: "publicity", label: "Publicity" },
  { key: "convening-committee", label: "Convening Committee" },
  { key: "honor-board", label: "Honor Board" },
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

export function PageHeroesSection() {
  const [page, setPage] = useState<PageHeroKey>("home");
  const [forms, setForms] = useState<Partial<Record<PageHeroKey, Form>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      })
      .catch((e) => toast.error(errMessage(e)))
      .finally(() => setLoading(false));
  }, []);

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

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const images = form.images
        .filter((img) => img.image_url)
        .map((img, i) => ({ ...img, order: i }));
      await pageHeroApi.update(page, { title: form.title, lede: form.lede, images });
      set("images", images);
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

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">Page heroes</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          The banner image and heading shown at the top of each page. Leave a field empty to keep
          the site's default.
        </p>
      </div>

      {/* Page tabs */}
      <div className="mb-5 flex flex-wrap gap-1 rounded-xl border border-border bg-[var(--color-surface)] p-1">
        {PAGES.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPage(p.key)}
            className={
              "rounded-lg px-3.5 py-2 text-sm font-semibold transition-all " +
              (page === p.key ? "text-white shadow" : "text-foreground/60 hover:text-foreground")
            }
            style={
              page === p.key
                ? { background: "linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))" }
                : undefined
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      <form
        key={page}
        onSubmit={save}
        className="grid gap-5 overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] p-6"
      >
        <Field label="Title" hint="Leave empty to use the site's default heading for this page.">
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputCls}
            placeholder="Default heading"
          />
        </Field>
        <Field
          label="Subtitle"
          hint="Leave empty to use the site's default subtitle for this page."
        >
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
              ? "Add one or more photos — they'll rotate automatically. Leave empty to use the site's default slides."
              : "Leave empty to use the site's default photo."}
          </p>

          <div className="space-y-3">
            {form.images.map((img, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border p-3"
              >
                {meta.multiImage && (
                  <GripVertical size={16} className="mt-3 shrink-0 text-muted-foreground/40" />
                )}
                <div className="flex-1 space-y-2.5">
                  <ImageUpload
                    value={img.image_url}
                    onChange={(url) => setImage(i, url)}
                    folder="page-heroes"
                  />
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
            style={{ background: "linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))" }}
          >
            <Save size={14} /> {saving ? "Saving…" : "Save hero"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Re-exported so callers only need to import the section, not the row type.
export type { PageHeroImage };
