import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";
import { programPagesApi, type ProgramPage } from "@/lib/api";
import { errMessage } from "./useResource";
import { SectionHeader, Field, inputCls } from "./primitives";
import { ImageUpload } from "./ImageUpload";

type Objective = ProgramPage["objectives"][number];
type Stat = ProgramPage["stats"][number];
type GalleryImage = ProgramPage["gallery"][number];
type Testimonial = ProgramPage["testimonials"][number];

let tempId = -1;
const nextTempId = () => tempId--;

function RepeatingRow({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-border bg-[var(--color-background)] p-3">
      <GripVertical size={14} className="mt-2.5 shrink-0 text-muted-foreground/40" />
      <div className="grid flex-1 gap-2.5 sm:grid-cols-2">{children}</div>
      <button
        type="button"
        onClick={onRemove}
        className="mt-1.5 shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
        aria-label="Remove"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_40%,transparent)] hover:text-foreground"
    >
      <Plus size={13} /> {label}
    </button>
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

  async function save() {
    if (!form) return;
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
        objectives: form.objectives.map(({ title, description, order }) => ({ title, description, order })),
        stats: form.stats.map(({ label, value, order }) => ({ label, value, order })),
        gallery: form.gallery.map(({ image_url, caption, order }) => ({ image_url, caption, order })),
        testimonials: form.testimonials.map(({ name, role, quote, photo_url, order }) => ({
          name, role, quote, photo_url, order,
        })),
      } as never);
      setPages((prev) => prev?.map((p) => (p.slug === updated.slug ? updated : p)) ?? prev);
      toast.success("Program page saved");
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
      <div className="mb-6 flex flex-wrap gap-2">
        {pages.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className={
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
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
        <div className="space-y-8 rounded-2xl border border-border bg-[var(--color-surface)] p-5 md:p-7">
          {/* Basics */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hero image" full>
              <ImageUpload
                value={form.hero_image_url}
                onChange={(u) => set("hero_image_url", u)}
                folder="programs"
              />
            </Field>
            <Field label="Title">
              <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Tagline" hint="Short line shown under the title in the hero">
              <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Schedule note" hint='e.g. "Held once a year, in December"'>
              <input
                value={form.schedule_note}
                onChange={(e) => set("schedule_note", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Overview" full>
            <textarea
              rows={4}
              value={form.overview}
              onChange={(e) => set("overview", e.target.value)}
              className={inputCls}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Who can join (eligibility)">
              <textarea
                rows={3}
                value={form.eligibility}
                onChange={(e) => set("eligibility", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="How it works (process)">
              <textarea
                rows={3}
                value={form.process}
                onChange={(e) => set("process", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          {/* Objectives */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Objectives
            </p>
            <div className="space-y-2.5">
              {form.objectives.map((o, i) => (
                <RepeatingRow
                  key={o.id}
                  onRemove={() =>
                    set("objectives", form.objectives.filter((x) => x.id !== o.id) as Objective[])
                  }
                >
                  <input
                    value={o.title}
                    placeholder="Title"
                    onChange={(e) =>
                      set(
                        "objectives",
                        form.objectives.map((x) => (x.id === o.id ? { ...x, title: e.target.value } : x)) as Objective[],
                      )
                    }
                    className={inputCls + " mt-0"}
                  />
                  <input
                    value={o.description}
                    placeholder="Description (optional)"
                    onChange={(e) =>
                      set(
                        "objectives",
                        form.objectives.map((x) => (x.id === o.id ? { ...x, description: e.target.value } : x)) as Objective[],
                      )
                    }
                    className={inputCls + " mt-0"}
                  />
                </RepeatingRow>
              ))}
            </div>
            <div className="mt-3">
              <AddRowButton
                label="Add objective"
                onClick={() =>
                  set("objectives", [
                    ...form.objectives,
                    { id: nextTempId(), title: "", description: "", order: form.objectives.length },
                  ] as Objective[])
                }
              />
            </div>
          </div>

          {/* Stats */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Stat tiles
            </p>
            <div className="space-y-2.5">
              {form.stats.map((s) => (
                <RepeatingRow
                  key={s.id}
                  onRemove={() => set("stats", form.stats.filter((x) => x.id !== s.id) as Stat[])}
                >
                  <input
                    value={s.label}
                    placeholder="Label, e.g. Members reached"
                    onChange={(e) =>
                      set("stats", form.stats.map((x) => (x.id === s.id ? { ...x, label: e.target.value } : x)) as Stat[])
                    }
                    className={inputCls + " mt-0"}
                  />
                  <input
                    value={s.value}
                    placeholder="Value, e.g. 500+"
                    onChange={(e) =>
                      set("stats", form.stats.map((x) => (x.id === s.id ? { ...x, value: e.target.value } : x)) as Stat[])
                    }
                    className={inputCls + " mt-0"}
                  />
                </RepeatingRow>
              ))}
            </div>
            <div className="mt-3">
              <AddRowButton
                label="Add stat"
                onClick={() =>
                  set("stats", [
                    ...form.stats,
                    { id: nextTempId(), label: "", value: "", order: form.stats.length },
                  ] as Stat[])
                }
              />
            </div>
          </div>

          {/* Gallery */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Gallery
            </p>
            <div className="space-y-2.5">
              {form.gallery.map((g) => (
                <RepeatingRow
                  key={g.id}
                  onRemove={() => set("gallery", form.gallery.filter((x) => x.id !== g.id) as GalleryImage[])}
                >
                  <div className="sm:col-span-2">
                    <ImageUpload
                      value={g.image_url}
                      onChange={(u) =>
                        set("gallery", form.gallery.map((x) => (x.id === g.id ? { ...x, image_url: u } : x)) as GalleryImage[])
                      }
                      folder="programs"
                    />
                  </div>
                  <input
                    value={g.caption}
                    placeholder="Caption (optional)"
                    onChange={(e) =>
                      set("gallery", form.gallery.map((x) => (x.id === g.id ? { ...x, caption: e.target.value } : x)) as GalleryImage[])
                    }
                    className={inputCls + " mt-0 sm:col-span-2"}
                  />
                </RepeatingRow>
              ))}
            </div>
            <div className="mt-3">
              <AddRowButton
                label="Add photo"
                onClick={() =>
                  set("gallery", [
                    ...form.gallery,
                    { id: nextTempId(), image_url: "", caption: "", order: form.gallery.length },
                  ] as GalleryImage[])
                }
              />
            </div>
          </div>

          {/* Testimonials */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Testimonials
            </p>
            <div className="space-y-2.5">
              {form.testimonials.map((t) => (
                <RepeatingRow
                  key={t.id}
                  onRemove={() =>
                    set("testimonials", form.testimonials.filter((x) => x.id !== t.id) as Testimonial[])
                  }
                >
                  <input
                    value={t.name}
                    placeholder="Name"
                    onChange={(e) =>
                      set("testimonials", form.testimonials.map((x) => (x.id === t.id ? { ...x, name: e.target.value } : x)) as Testimonial[])
                    }
                    className={inputCls + " mt-0"}
                  />
                  <input
                    value={t.role}
                    placeholder="Role / context (optional)"
                    onChange={(e) =>
                      set("testimonials", form.testimonials.map((x) => (x.id === t.id ? { ...x, role: e.target.value } : x)) as Testimonial[])
                    }
                    className={inputCls + " mt-0"}
                  />
                  <textarea
                    rows={2}
                    value={t.quote}
                    placeholder="Quote"
                    onChange={(e) =>
                      set("testimonials", form.testimonials.map((x) => (x.id === t.id ? { ...x, quote: e.target.value } : x)) as Testimonial[])
                    }
                    className={inputCls + " mt-0 sm:col-span-2"}
                  />
                  <div className="sm:col-span-2">
                    <ImageUpload
                      value={t.photo_url}
                      onChange={(u) =>
                        set("testimonials", form.testimonials.map((x) => (x.id === t.id ? { ...x, photo_url: u } : x)) as Testimonial[])
                      }
                      folder="programs"
                    />
                  </div>
                </RepeatingRow>
              ))}
            </div>
            <div className="mt-3">
              <AddRowButton
                label="Add testimonial"
                onClick={() =>
                  set("testimonials", [
                    ...form.testimonials,
                    { id: nextTempId(), name: "", role: "", quote: "", photo_url: "", order: form.testimonials.length },
                  ] as Testimonial[])
                }
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-border pt-5">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
              style={{ background: "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))" }}
            >
              <Save size={15} /> {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
