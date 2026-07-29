import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { galleryApi, optimizeImage } from "@/lib/api";
import { errMessage } from "./useResource";
import { Modal, inputCls } from "./primitives";
import { MultiImageUpload } from "./MultiImageUpload";

export interface BulkRow {
  /** Local key — the URL is unique per upload, but keep an explicit id. */
  key: string;
  image_url: string;
  title: string;
  caption: string;
  category: string;
  year: string;
}

let seq = 0;
const rowFor = (image_url: string, category: string, year: string): BulkRow => ({
  key: `${Date.now()}-${seq++}`,
  image_url,
  title: "",
  caption: "",
  category,
  year,
});

/**
 * Add many photos in one pass: upload a batch, then set a category (and
 * optional title/year/caption) per image. Defaults applied at the top cascade
 * to every row that hasn't been edited away from them, so the common case
 * "20 photos, all reunion 2024" stays a couple of clicks.
 */
export function MomentsBulkAdd({
  open,
  onClose,
  onSaved,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  categories: string[];
}) {
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [defaultCat, setDefaultCat] = useState("events");
  const [defaultYear, setDefaultYear] = useState(String(new Date().getFullYear()));
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  function reset() {
    setRows([]);
    setProgress(0);
  }

  function close() {
    if (saving) return;
    reset();
    onClose();
  }

  const setRow = (key: string, patch: Partial<BulkRow>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const addUrls = (urls: string[]) =>
    setRows((rs) => [...rs, ...urls.map((u) => rowFor(u, defaultCat, defaultYear))]);

  /** Push the current defaults onto every row, overwriting per-row values. */
  function applyDefaultsToAll() {
    setRows((rs) => rs.map((r) => ({ ...r, category: defaultCat, year: defaultYear })));
    toast.success("Applied to all photos");
  }

  async function save() {
    if (rows.length === 0) return toast.error("Upload at least one image");
    const missing = rows.find((r) => !r.category.trim());
    if (missing) return toast.error("Every photo needs a category");

    setSaving(true);
    setProgress(0);
    const stuck: BulkRow[] = [];
    let firstError = "";
    let done = 0;

    // Sequential so a large batch doesn't hammer the API, and so the count
    // shown to the admin is truthful as it climbs.
    for (const r of rows) {
      try {
        await galleryApi.create({
          title: r.title,
          caption: r.caption,
          category: r.category.trim().toLowerCase(),
          year: r.year ? Number(r.year) : null,
          image_url: r.image_url,
        });
      } catch (err) {
        stuck.push(r);
        firstError ||= errMessage(err);
      }
      done += 1;
      setProgress(done);
    }

    setSaving(false);
    setProgress(0);
    const added = rows.length - stuck.length;
    if (added > 0) toast.success(`${added} photo${added === 1 ? "" : "s"} added`);
    onSaved();

    if (stuck.length > 0) {
      // Keep only the ones that didn't save so the admin can retry them
      // without re-uploading the whole batch.
      setRows(stuck);
      toast.error(`${stuck.length} failed — ${firstError}`);
      return;
    }
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      onSubmit={save}
      saving={saving}
      title="Add photos"
      submitLabel={
        saving && rows.length
          ? `Saving ${progress}/${rows.length}…`
          : rows.length
            ? `Add ${rows.length} photo${rows.length === 1 ? "" : "s"}`
            : "Add photos"
      }
    >
      <div className="sm:col-span-2">
        <MultiImageUpload onAdd={addUrls} folder="moments" disabled={saving} />
      </div>

      {rows.length > 0 && (
        <>
          {/* Defaults bar — new uploads inherit these, and "Apply to all"
              pushes them onto rows already in the list. */}
          <div className="sm:col-span-2 rounded-xl border border-border bg-[var(--color-background)] p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
              Defaults for new uploads
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              <input
                list="moments-categories"
                value={defaultCat}
                onChange={(e) => setDefaultCat(e.target.value)}
                placeholder="Category"
                className="min-w-[150px] flex-1 rounded-lg border border-border bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent-1)]"
              />
              <input
                type="number"
                value={defaultYear}
                onChange={(e) => setDefaultYear(e.target.value)}
                placeholder="Year"
                className="w-24 rounded-lg border border-border bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent-1)]"
              />
              <button
                type="button"
                onClick={applyDefaultsToAll}
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_50%,transparent)] hover:text-[var(--color-accent-1)]"
              >
                Apply to all
              </button>
            </div>
          </div>

          {/* Per-image rows */}
          <div className="sm:col-span-2 space-y-2.5">
            {rows.map((r, idx) => (
              <div
                key={r.key}
                className="flex gap-3 rounded-xl border border-border bg-[var(--color-background)] p-3"
              >
                <div className="h-[62px] w-[84px] shrink-0 overflow-hidden rounded-lg border border-border">
                  <img
                    src={optimizeImage(r.image_url, 240)}
                    alt={`Photo ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                  <input
                    value={r.title}
                    onChange={(e) => setRow(r.key, { title: e.target.value })}
                    placeholder="Title (optional)"
                    className="rounded-lg border border-border bg-[var(--color-surface)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent-1)]"
                  />
                  <div className="flex gap-2">
                    <input
                      list="moments-categories"
                      value={r.category}
                      onChange={(e) => setRow(r.key, { category: e.target.value })}
                      placeholder="Category"
                      className="min-w-0 flex-1 rounded-lg border border-border bg-[var(--color-surface)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent-1)]"
                    />
                    <input
                      type="number"
                      value={r.year}
                      onChange={(e) => setRow(r.key, { year: e.target.value })}
                      placeholder="Year"
                      className="w-20 rounded-lg border border-border bg-[var(--color-surface)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-accent-1)]"
                    />
                  </div>
                  <input
                    value={r.caption}
                    onChange={(e) => setRow(r.key, { caption: e.target.value })}
                    placeholder="Caption (optional)"
                    className="rounded-lg border border-border bg-[var(--color-surface)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent-1)] sm:col-span-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}
                  className="h-7 w-7 shrink-0 rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                  aria-label="Remove from batch"
                >
                  <X size={14} className="mx-auto" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <datalist id="moments-categories">
        {categories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </Modal>
  );
}
