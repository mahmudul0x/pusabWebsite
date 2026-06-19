import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { PageHero } from "@/components/site/PageHero";
import { toast } from "sonner";
import { Trash2, Upload, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Admin — PUSAB" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

type Tab = "moments" | "publicity" | "ec";
const TABS: { key: Tab; label: string }[] = [
  { key: "moments", label: "Moments gallery" },
  { key: "publicity", label: "Publicity" },
  { key: "ec", label: "EC members" },
];

const GALLERY_CATS = ["events", "achievements", "community", "reunion", "other"] as const;
const PUB_TYPES = ["news", "press", "event"] as const;

type GalleryItem = Tables<"gallery_items">;
type PublicityPost = Tables<"publicity_posts">;
type EcMember = Tables<"ec_members">;

async function uploadToMedia(file: File, prefix: string): Promise<{ path: string; url: string }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  // Signed URL with ~10 year expiry
  const { data, error: signErr } = await supabase.storage
    .from("media")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signErr || !data) throw signErr ?? new Error("Could not sign URL");
  return { path, url: data.signedUrl };
}

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("moments");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setEmail(u.user?.email ?? "");
      if (!u.user) return setIsAdmin(false);
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data && !error);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <>
      <PageHero
        title="Admin"
        lede="Manage photos, publicity posts and Executive Committee members."
        crumbs={[{ label: "Home", to: "/" }, { label: "Admin" }]}
      />
      <section className="pb-24">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="text-sm text-muted-foreground">
              Signed in as <span className="text-foreground font-medium">{email}</span>
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 text-sm rounded-full glass px-4 py-2"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>

          {isAdmin === null ? (
            <div className="rounded-3xl border border-border bg-[var(--color-surface)] p-10 text-muted-foreground">
              Loading…
            </div>
          ) : !isAdmin ? (
            <div className="rounded-3xl border border-border bg-[var(--color-surface)] p-10">
              <h2 className="text-lg font-semibold mb-2">You don't have admin access yet.</h2>
              <p className="text-sm text-muted-foreground">
                Your account has been created. Ask a site admin to grant your account the{" "}
                <code>admin</code> role, then refresh this page.
              </p>
            </div>
          ) : (
            <>
              <div className="inline-flex glass rounded-full p-1 gap-1 mb-8">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={
                      "px-4 py-2 text-sm rounded-full " +
                      (tab === t.key
                        ? "bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white"
                        : "text-foreground/70 hover:text-foreground")
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {tab === "moments" && <MomentsAdmin />}
              {tab === "publicity" && <PublicityAdmin />}
              {tab === "ec" && <EcAdmin />}
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* ------------ Moments ------------ */
function MomentsAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<(typeof GALLERY_CATS)[number]>("events");
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data ?? []);
  }
  useEffect(() => {
    refresh();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return toast.error("Choose a photo");
    setBusy(true);
    try {
      const { path, url } = await uploadToMedia(file, "moments");
      const { error } = await supabase.from("gallery_items").insert({
        title: title || null,
        caption: caption || null,
        category,
        year: year ? Number(year) : null,
        image_url: url,
        storage_path: path,
      });
      if (error) throw error;
      toast.success("Photo added");
      setTitle("");
      setCaption("");
      setFile(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(it: GalleryItem) {
    if (!confirm(`Delete "${it.title ?? "photo"}"?`)) return;
    if (it.storage_path) await supabase.storage.from("media").remove([it.storage_path]);
    await supabase.from("gallery_items").delete().eq("id", it.id);
    await refresh();
  }

  return (
    <div className="grid lg:grid-cols-[400px,1fr] gap-8">
      <form
        onSubmit={submit}
        className="glass rounded-3xl p-6 space-y-4 border border-border h-fit"
      >
        <h3 className="font-semibold">Upload a photo</h3>
        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Caption">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as (typeof GALLERY_CATS)[number])}
              className={inputCls}
            >
              {GALLERY_CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Year">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Photo file">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </Field>
        <button
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white font-semibold py-3 disabled:opacity-60"
        >
          <Upload size={16} /> {busy ? "Uploading…" : "Add photo"}
        </button>
      </form>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-2xl border border-border bg-[var(--color-surface)] overflow-hidden group"
          >
            <img src={it.image_url} alt={it.title ?? ""} className="w-full h-44 object-cover" />
            <div className="p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {it.category} · {it.year ?? "—"}
              </div>
              <div className="font-medium mt-1">{it.title ?? "Untitled"}</div>
              {it.caption && (
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.caption}</div>
              )}
              <button
                onClick={() => remove(it)}
                className="mt-3 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------ Publicity ------------ */
function PublicityAdmin() {
  const [items, setItems] = useState<PublicityPost[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<(typeof PUB_TYPES)[number]>("news");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const { data } = await supabase
      .from("publicity_posts")
      .select("*")
      .order("date", { ascending: false });
    setItems(data ?? []);
  }
  useEffect(() => {
    refresh();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      let image_url: string | null = null;
      let storage_path: string | null = null;
      if (file) {
        const r = await uploadToMedia(file, "publicity");
        image_url = r.url;
        storage_path = r.path;
      }
      const { error } = await supabase.from("publicity_posts").insert({
        title,
        type,
        date,
        excerpt: excerpt || null,
        body: body || null,
        link: link.trim() || null,
        image_url,
        storage_path,
        published: true,
      });
      if (error) throw error;
      toast.success("Post added");
      setTitle("");
      setExcerpt("");
      setBody("");
      setLink("");
      setFile(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(it: PublicityPost) {
    if (!confirm(`Delete "${it.title}"?`)) return;
    if (it.storage_path) await supabase.storage.from("media").remove([it.storage_path]);
    await supabase.from("publicity_posts").delete().eq("id", it.id);
    await refresh();
  }

  return (
    <div className="grid lg:grid-cols-[400px,1fr] gap-8">
      <form
        onSubmit={submit}
        className="glass rounded-3xl p-6 space-y-4 border border-border h-fit"
      >
        <h3 className="font-semibold">New publicity post</h3>
        <Field label="Title">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as (typeof PUB_TYPES)[number])}
              className={inputCls}
            >
              {PUB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Excerpt">
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Body">
          <textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="External link (optional)">
          <input
            type="url"
            placeholder="https://…  — clicking the card opens this"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Cover image">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </Field>
        <button
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white font-semibold py-3 disabled:opacity-60"
        >
          <Upload size={16} /> {busy ? "Saving…" : "Publish"}
        </button>
      </form>

      <div className="space-y-3">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex gap-4 rounded-2xl border border-border bg-[var(--color-surface)] overflow-hidden"
          >
            {it.image_url && (
              <img src={it.image_url} alt="" className="w-40 h-28 object-cover shrink-0" />
            )}
            <div className="p-4 flex-1 min-w-0">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {it.type} · {it.date ?? ""}
              </div>
              <div className="font-medium truncate">{it.title}</div>
              {it.excerpt && (
                <div className="text-sm text-muted-foreground line-clamp-2">{it.excerpt}</div>
              )}
              <button
                onClick={() => remove(it)}
                className="mt-2 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------ EC members ------------ */
function EcAdmin() {
  const [items, setItems] = useState<EcMember[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [isCurrent, setIsCurrent] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const { data } = await supabase
      .from("ec_members")
      .select("*")
      .order("year", { ascending: false })
      .order("name");
    setItems(data ?? []);
  }
  useEffect(() => {
    refresh();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      let photo_url: string | null = null;
      let storage_path: string | null = null;
      if (file) {
        const r = await uploadToMedia(file, "ec");
        photo_url = r.url;
        storage_path = r.path;
      }
      const { error } = await supabase.from("ec_members").insert({
        name,
        role,
        university: university || null,
        year: Number(year),
        is_current: isCurrent,
        photo_url,
        storage_path,
      });
      if (error) throw error;
      toast.success("Member added");
      setName("");
      setRole("");
      setUniversity("");
      setFile(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(it: EcMember) {
    if (!confirm(`Remove ${it.name}?`)) return;
    if (it.storage_path) await supabase.storage.from("media").remove([it.storage_path]);
    await supabase.from("ec_members").delete().eq("id", it.id);
    await refresh();
  }

  return (
    <div className="grid lg:grid-cols-[400px,1fr] gap-8">
      <form
        onSubmit={submit}
        className="glass rounded-3xl p-6 space-y-4 border border-border h-fit"
      >
        <h3 className="font-semibold">Add EC member</h3>
        <Field label="Name">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Role">
          <input
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="University">
          <input
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Year">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Current EC?">
            <label className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
              />
              <span className="text-sm">Yes</span>
            </label>
          </Field>
        </div>
        <Field label="Photo">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </Field>
        <button
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white font-semibold py-3 disabled:opacity-60"
        >
          <Upload size={16} /> {busy ? "Saving…" : "Add member"}
        </button>
      </form>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-2xl border border-border bg-[var(--color-surface)] overflow-hidden"
          >
            {it.photo_url ? (
              <img src={it.photo_url} alt={it.name} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 grid place-items-center text-muted-foreground text-sm bg-white/[0.02]">
                No photo
              </div>
            )}
            <div className="p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {it.role} · {it.year}
                {it.is_current ? " · current" : ""}
              </div>
              <div className="font-medium mt-1">{it.name}</div>
              {it.university && (
                <div className="text-xs text-muted-foreground mt-1">{it.university}</div>
              )}
              <button
                onClick={() => remove(it)}
                className="mt-3 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputCls =
  "mt-2 w-full rounded-xl bg-[var(--color-surface)] border border-border px-3 py-2 text-sm outline-none focus:border-[var(--color-accent-1)]";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
