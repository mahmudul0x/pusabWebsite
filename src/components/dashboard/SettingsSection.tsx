import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Globe, Phone, Users, Calendar, MapPin, Facebook } from "lucide-react";
import { settingsApi, type SiteSettings } from "@/lib/api";
import { Field, inputCls } from "./primitives";
import { errMessage } from "./useResource";

type Form = Omit<SiteSettings, "updated_at">;

const empty: Form = { email: "", phone: "", members: "", founded: "", founded_at: "", address: "", facebook: "" };

const fieldDefs: {
  key: keyof Form;
  label: string;
  type?: string;
  placeholder?: string;
  full?: boolean;
  icon: React.ReactNode;
}[] = [
  { key: "email", label: "Contact email", type: "email", icon: <Globe size={14} /> },
  { key: "phone", label: "Phone", type: "tel", icon: <Phone size={14} /> },
  { key: "members", label: "Members (e.g. 300+)", icon: <Users size={14} /> },
  { key: "founded", label: "Founded (e.g. July 30, 2014)", icon: <Calendar size={14} /> },
  { key: "founded_at", label: "Founded at", full: true, icon: <MapPin size={14} /> },
  { key: "address", label: "Address", full: true, icon: <MapPin size={14} /> },
  { key: "facebook", label: "Facebook URL", type: "url", full: true, placeholder: "https://facebook.com/…", icon: <Facebook size={14} /> },
];

export function SettingsSection() {
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    settingsApi
      .get()
      .then((s) => setForm({ email: s.email, phone: s.phone, members: s.members, founded: s.founded, founded_at: s.founded_at, address: s.address, facebook: s.facebook }))
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
      <div className="flex items-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="animate-spin" size={18} /> Loading settings…
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-2xl font-extrabold tracking-tight">Site settings</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Organisation info shown across the public site — edit here, no code needed.
        </p>
      </div>

      <form onSubmit={save} className="space-y-5">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]">
          {/* Card header */}
          <div className="border-b border-border px-6 py-4">
            <p className="text-sm font-bold">Organisation info</p>
            <p className="mt-0.5 text-xs text-muted-foreground">These values populate the footer, about section, and contact details.</p>
          </div>

          <div className="grid gap-x-6 gap-y-5 p-6 sm:grid-cols-2">
            {fieldDefs.map(({ key, label, type, placeholder, full, icon }) => (
              <Field key={key} label={label} full={full}>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                    {icon}
                  </span>
                  <input
                    type={type ?? "text"}
                    value={form[key] as string}
                    placeholder={placeholder}
                    onChange={(e) => set(key, e.target.value as Form[typeof key])}
                    className={inputCls + " pl-9"}
                  />
                </div>
              </Field>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
            style={{ background: "linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))" }}
          >
            <Save size={14} /> {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
