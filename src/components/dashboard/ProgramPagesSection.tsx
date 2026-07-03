import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { programPagesApi, type ProgramPage } from "@/lib/api";
import { errMessage } from "./useResource";
import { SectionHeader, Field, inputCls } from "./primitives";
import { ImageUpload } from "./ImageUpload";

type Stat = ProgramPage["stats"][number];
type GalleryImage = ProgramPage["gallery"][number];
type Testimonial = ProgramPage["testimonials"][number];

let tempId = -1;
const nextTempId = () => tempId--;
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => CURRENT_YEAR + 1 - i);

function YearSelect({ value, onChange }: { value: number | null; onChange: (y: number) => void }) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className={inputCls + " mt-0"}
    >
      <option value="" disabled>
        Year…
      </option>
      {YEAR_OPTIONS.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );
}

function RepeatingRow({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-[var(--color-background)] p-2.5">
      <div className="grid flex-1 gap-2 sm:grid-cols-2">{children}</div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
        aria-label="Remove"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

/** Requires a year to be picked before the "Add" action is available — the
 * dashboard's rule for stats/gallery/testimonials is: pick the edition year
 * first, then fill in the rest. */
function AddWithYear({ label, onAdd }: { label: string; onAdd: (year: number) => void }) {
  const [year, setYear] = useState<number | "">("");
  return (
    <div className="flex items-center gap-2">
      <select
        value={year}
        onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
        className="rounded-lg border border-border bg-[var(--color-background)] px-2.5 py-1.5 text-xs outline-none"
      >
        <option value="">Year…</option>
        {YEAR_OPTIONS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={!year}
        onClick={() => {
          if (year) onAdd(year);
          setYear("");
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_40%,transparent)] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={12} /> {label}
      </button>
    </div>
  );
}

function EditorSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-xl border border-border" open={count > 0}>
      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="rounded-full bg-[var(--color-background)] px-2 py-0.5 text-[10px] tabular-nums text-muted-foreground/80">
          {count}
        </span>
      </summary>
      <div className="space-y-2 border-t border-border p-3">{children}</div>
    </details>
  );
}

export function ProgramPagesSection() {
  const [pages, setPages] = useState<ProgramPage[] | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [form, setForm] = useState<ProgramPage | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    programPagesApi
      .listAll()
      .then((rows) => {
        setPages(rows);
        if (rows.length > 0) setActiveSlug((prev) => prev ?? rows[0].slug);
      })
      .catch((e) => toast.error(errMessage(e)));
  }

  useEffect(load, []);

  useEffect(() => {
    const page = pages?.find((p) => p.slug === activeSlug) ?? null;
    setForm(page ? { ...page } : null);
  }, [activeSlug, pages]);

  const set = <K extends keyof ProgramPage>(k: K, v: ProgramPage[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  function validate(f: ProgramPage): string | null {
    if (f.stats.some((s) => !s.year)) return "Pick a year for every stat.";
    if (f.stats.some((s) => !s.label.trim() || !s.value.trim())) return "Every stat needs a label and a value.";
    if (f.gallery.some((g) => !g.year)) return "Pick a year for every gallery photo.";
    if (f.gallery.some((g) => !g.image_url.trim())) return "Remove empty gallery rows, or add a photo to them.";
    if (f.testimonials.some((t) => !t.year)) return "Pick a year for every testimonial.";
    if (f.testimonials.some((t) => !t.name.trim() || !t.quote.trim())) return "Every testimonial needs a name and a quote.";
    return null;
  }

  async function save() {
    if (!form) return;
    const problem = validate(form);
    if (problem) {
      toast.error(problem);
      return;
    }
    setSaving(true);
    try {
      const updated = await programPagesApi.update(form.slug, {
        title: form.title,
        tagline: form.tagline,
        hero_image_url: form.hero_image_url,
        overview: form.overview,
        eligibility: form.eligibility,
        process: form.process,
        schedule_note: form.schedule_note,
        stats: form.stats.map(({ year, label, value, order }) => ({ year, label, value, order })),
        gallery: form.gallery.map(({ year, image_url, caption, order }) => ({ year, image_url, caption, order })),
        testimonials: form.testimonials.map(({ year, name, role, quote, photo_url, order }) => ({
          year, name, role, quote, photo_url, order,
        })),
      } as never);
      setPages((prev) => prev?.map((p) => (p.slug === updated.slug ? updated : p)) ?? prev);
      toast.success("Saved");
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (!pages) {
    return (
      <div>
        <SectionHeader title="Program Pages" subtitle="Loading…" onNew={() => {}} newLabel="" />
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Program Pages"
        subtitle="Content shown on each /programs/<slug> detail page."
        count={pages.length}
        onNew={load}
        newLabel="Refresh"
      />

      {/* Slug tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {pages.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className={
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors " +
              (activeSlug === p.slug
                ? "text-white"
                : "border border-border bg-[var(--color-surface)] text-foreground/75 hover:text-foreground")
            }
            style={
              activeSlug === p.slug
                ? { background: "linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))" }
                : undefined
            }
          >
            {p.title}
          </button>
        ))}
      </div>

      {form && (
        <div className="space-y-4 rounded-2xl border border-border bg-[var(--color-surface)] p-4 md:p-5">
          {/* Basics */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="sm:w-32">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
                Hero image
              </span>
              <div className="mt-1">
                <ImageUpload value={form.hero_image_url} onChange={(u) => set("hero_image_url", u)} folder="programs" />
              </div>
            </div>
            <div className="grid flex-1 gap-2.5 sm:grid-cols-2">
              <Field label="Title">
                <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Tagline" hint="Line under the title in the hero">
                <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Schedule note" hint='e.g. "Held once a year, in December"' full>
                <input
                  value={form.schedule_note}
                  onChange={(e) => set("schedule_note", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          <Field label="Overview" full>
            <textarea
              rows={3}
              value={form.overview}
              onChange={(e) => set("overview", e.target.value)}
              className={inputCls}
            />
          </Field>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label="Who can join (eligibility)">
              <textarea
                rows={2}
                value={form.eligibility}
                onChange={(e) => set("eligibility", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="How it works (process)">
              <textarea
                rows={2}
                value={form.process}
                onChange={(e) => set("process", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          {/* Collapsible repeatable lists */}
          <div className="space-y-2.5">
            <EditorSection title="Stat tiles" count={form.stats.length}>
              {form.stats.map((s) => (
                <RepeatingRow key={s.id} onRemove={() => set("stats", form.stats.filter((x) => x.id !== s.id) as Stat[])}>
                  <YearSelect
                    value={s.year}
                    onChange={(y) => set("stats", form.stats.map((x) => (x.id === s.id ? { ...x, year: y } : x)) as Stat[])}
                  />
                  <input
                    value={s.value}
                    placeholder="Value, e.g. 500+"
                    onChange={(e) => set("stats", form.stats.map((x) => (x.id === s.id ? { ...x, value: e.target.value } : x)) as Stat[])}
                    className={inputCls + " mt-0"}
                  />
                  <input
                    value={s.label}
                    placeholder="Label, e.g. Members reached"
                    onChange={(e) => set("stats", form.stats.map((x) => (x.id === s.id ? { ...x, label: e.target.value } : x)) as Stat[])}
                    className={inputCls + " mt-0 sm:col-span-2"}
                  />
                </RepeatingRow>
              ))}
              <AddWithYear
                label="Add stat"
                onAdd={(year) => set("stats", [...form.stats, { id: nextTempId(), year, label: "", value: "", order: form.stats.length }] as Stat[])}
              />
            </EditorSection>

            <EditorSection title="Gallery" count={form.gallery.length}>
              {form.gallery.map((g) => (
                <RepeatingRow key={g.id} onRemove={() => set("gallery", form.gallery.filter((x) => x.id !== g.id) as GalleryImage[])}>
                  <div className="sm:col-span-2">
                    <ImageUpload
                      value={g.image_url}
                      onChange={(u) => set("gallery", form.gallery.map((x) => (x.id === g.id ? { ...x, image_url: u } : x)) as GalleryImage[])}
                      folder="programs"
                    />
                  </div>
                  <YearSelect
                    value={g.year}
                    onChange={(y) => set("gallery", form.gallery.map((x) => (x.id === g.id ? { ...x, year: y } : x)) as GalleryImage[])}
                  />
                  <input
                    value={g.caption}
                    placeholder="Caption (optional)"
                    onChange={(e) => set("gallery", form.gallery.map((x) => (x.id === g.id ? { ...x, caption: e.target.value } : x)) as GalleryImage[])}
                    className={inputCls + " mt-0"}
                  />
                </RepeatingRow>
              ))}
              <AddWithYear
                label="Add photo"
                onAdd={(year) => set("gallery", [...form.gallery, { id: nextTempId(), year, image_url: "", caption: "", order: form.gallery.length }] as GalleryImage[])}
              />
            </EditorSection>

            <EditorSection title="Testimonials" count={form.testimonials.length}>
              {form.testimonials.map((t) => (
                <RepeatingRow key={t.id} onRemove={() => set("testimonials", form.testimonials.filter((x) => x.id !== t.id) as Testimonial[])}>
                  <input
                    value={t.name}
                    placeholder="Name"
                    onChange={(e) => set("testimonials", form.testimonials.map((x) => (x.id === t.id ? { ...x, name: e.target.value } : x)) as Testimonial[])}
                    className={inputCls + " mt-0"}
                  />
                  <YearSelect
                    value={t.year}
                    onChange={(y) => set("testimonials", form.testimonials.map((x) => (x.id === t.id ? { ...x, year: y } : x)) as Testimonial[])}
                  />
                  <input
                    value={t.role}
                    placeholder="Role / context (optional)"
                    onChange={(e) => set("testimonials", form.testimonials.map((x) => (x.id === t.id ? { ...x, role: e.target.value } : x)) as Testimonial[])}
                    className={inputCls + " mt-0 sm:col-span-2"}
                  />
                  <textarea
                    rows={2}
                    value={t.quote}
                    placeholder="Quote"
                    onChange={(e) => set("testimonials", form.testimonials.map((x) => (x.id === t.id ? { ...x, quote: e.target.value } : x)) as Testimonial[])}
                    className={inputCls + " mt-0 sm:col-span-2"}
                  />
                  <div className="sm:col-span-2">
                    <ImageUpload
                      value={t.photo_url}
                      onChange={(u) => set("testimonials", form.testimonials.map((x) => (x.id === t.id ? { ...x, photo_url: u } : x)) as Testimonial[])}
                      folder="programs"
                    />
                  </div>
                </RepeatingRow>
              ))}
              <AddWithYear
                label="Add testimonial"
                onAdd={(year) =>
                  set("testimonials", [
                    ...form.testimonials,
                    { id: nextTempId(), year, name: "", role: "", quote: "", photo_url: "", order: form.testimonials.length },
                  ] as Testimonial[])
                }
              />
            </EditorSection>
          </div>

          <div className="flex justify-end border-t border-border pt-3.5">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
              style={{ background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))" }}
            >
              <Save size={14} /> {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
