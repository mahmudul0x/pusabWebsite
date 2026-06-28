import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Crown, Gavel } from "lucide-react";
import { leaderMessageApi, type LeaderMessage } from "@/lib/api";
import { Field, inputCls } from "./primitives";
import { ImageUpload } from "./ImageUpload";
import { errMessage } from "./useResource";

type Role = "president" | "secretary";

type Form = {
  name: string;
  designation: string;
  session: string;
  photo_url: string;
  quote: string;
  body: string;
};

const emptyForm: Form = {
  name: "",
  designation: "",
  session: "",
  photo_url: "",
  quote: "",
  body: "",
};

function toForm(m: LeaderMessage): Form {
  return {
    name: m.name,
    designation: m.designation,
    session: m.session,
    photo_url: m.photo_url,
    quote: m.quote,
    body: m.body,
  };
}

export function LeadershipMessagesSection() {
  const [role, setRole] = useState<Role>("president");
  const [forms, setForms] = useState<Record<Role, Form>>({
    president: emptyForm,
    secretary: emptyForm,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = forms[role];
  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForms((f) => ({ ...f, [role]: { ...f[role], [k]: v } }));

  useEffect(() => {
    Promise.all([leaderMessageApi.get("president"), leaderMessageApi.get("secretary")])
      .then(([p, s]) =>
        setForms({ president: toForm(p), secretary: toForm(s) }),
      )
      .catch((e) => toast.error(errMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await leaderMessageApi.update(role, form);
      toast.success(
        (role === "president" ? "President's" : "Secretary's") + " message saved",
      );
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-20 text-muted-foreground">
        <Loader2 className="animate-spin" size={18} /> Loading messages…
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">Leadership messages</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The President's & General Secretary's messages shown on the public site. Update these
          each session — no code needed.
        </p>
      </div>

      {/* Role tabs */}
      <div className="mb-5 inline-flex rounded-xl border border-border bg-[var(--color-surface)] p-1">
        {(
          [
            { key: "president" as Role, label: "President", Icon: Crown },
            { key: "secretary" as Role, label: "General Secretary", Icon: Gavel },
          ]
        ).map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setRole(key)}
            className={
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all " +
              (role === key
                ? "bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white shadow"
                : "text-foreground/65 hover:text-foreground")
            }
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <form
        onSubmit={save}
        className="grid gap-5 rounded-2xl border border-border bg-[var(--color-surface)] p-6 sm:grid-cols-2"
      >
        <Field label="Photo" full>
          <ImageUpload
            value={form.photo_url}
            onChange={(u) => set("photo_url", u)}
            folder="leadership"
          />
        </Field>
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputCls}
            placeholder="Full name"
          />
        </Field>
        <Field label="Designation">
          <input
            value={form.designation}
            onChange={(e) => set("designation", e.target.value)}
            className={inputCls}
            placeholder={role === "president" ? "President, PUSAB" : "General Secretary, PUSAB"}
          />
        </Field>
        <Field label="Session" full>
          <input
            value={form.session}
            onChange={(e) => set("session", e.target.value)}
            className={inputCls}
            placeholder="Session 2026"
          />
        </Field>
        <Field label="Pull quote (highlighted)" full hint="One short, punchy line shown big.">
          <textarea
            value={form.quote}
            onChange={(e) => set("quote", e.target.value)}
            className={inputCls + " min-h-[64px] resize-y"}
            placeholder="A short memorable quote…"
          />
        </Field>
        <Field
          label="Message body"
          full
          hint="Separate paragraphs with a blank line (press Enter twice)."
        >
          <textarea
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            className={inputCls + " min-h-[260px] resize-y leading-relaxed"}
            placeholder="Write the full message here…"
          />
        </Field>

        <div className="sm:col-span-2">
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Save size={16} /> {saving ? "Saving…" : "Save message"}
          </button>
        </div>
      </form>
    </div>
  );
}
