import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { settingsApi, type SiteSettings } from "@/lib/api";
import { Field, inputCls } from "./primitives";
import { errMessage } from "./useResource";

type Form = Omit<SiteSettings, "updated_at">;

const empty: Form = {
  email: "",
  phone: "",
  members: "",
  founded: "",
  founded_at: "",
  address: "",
  facebook: "",
};

export function SettingsSection() {
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    settingsApi
      .get()
      .then((s) =>
        setForm({
          email: s.email,
          phone: s.phone,
          members: s.members,
          founded: s.founded,
          founded_at: s.founded_at,
          address: s.address,
          facebook: s.facebook,
        }),
      )
      .catch((e) => toast.error(errMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.update(form);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-20 text-muted-foreground">
        <Loader2 className="animate-spin" size={18} /> Loading settings…
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">Site settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Organisation info shown across the public site — edit here, no code needed.
        </p>
      </div>

      <form
        onSubmit={save}
        className="grid gap-5 rounded-2xl border border-border bg-[var(--color-surface)] p-6 sm:grid-cols-2"
      >
        <Field label="Contact email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Phone">
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Members (e.g. 300+)">
          <input value={form.members} onChange={(e) => set("members", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Founded (e.g. July 30, 2014)">
          <input value={form.founded} onChange={(e) => set("founded", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Founded at" full>
          <input
            value={form.founded_at}
            onChange={(e) => set("founded_at", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Address" full>
          <input value={form.address} onChange={(e) => set("address", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Facebook URL" full>
          <input
            type="url"
            placeholder="https://facebook.com/…"
            value={form.facebook}
            onChange={(e) => set("facebook", e.target.value)}
            className={inputCls}
          />
        </Field>

        <div className="sm:col-span-2">
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Save size={16} /> {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
