import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff, Trash2, UserPlus, Users } from "lucide-react";
import { usersApi, register, useAuth, type AdminUser } from "@/lib/api";
import { useResource, errMessage } from "./useResource";
import { Field, Modal, SectionHeader, EmptyState, Toolbar, ListSkeleton, useConfirm, inputCls } from "./primitives";

interface Form {
  email: string;
  full_name: string;
  password: string;
  is_admin: boolean;
}

const empty: Form = { email: "", full_name: "", password: "", is_admin: false };

export function UsersSection() {
  const { user: me } = useAuth();
  const { items, loading, reload } = useResource(usersApi);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [confirm, confirmEl] = useConfirm();

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function toggleAdmin(u: AdminUser) {
    try {
      await usersApi.update(u.id, { is_admin: !u.is_admin } as Partial<AdminUser>);
      toast.success(u.is_admin ? "Admin access removed" : "Granted admin access");
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  async function remove(u: AdminUser) {
    if (!(await confirm(`Delete the account ${u.email}?`))) return;
    try {
      await usersApi.remove(u.id);
      toast.success("User deleted");
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  async function createUser() {
    if (!form.email || form.password.length < 8)
      return toast.error("Email and an 8+ character password are required");
    setSaving(true);
    try {
      const created = await register({ email: form.email, password: form.password, full_name: form.full_name });
      if (form.is_admin) await usersApi.update(created.id, { is_admin: true } as Partial<AdminUser>);
      toast.success("User created");
      setOpen(false);
      setForm(empty);
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const filtered = items.filter((u) => {
    const q = query.trim().toLowerCase();
    return !q || u.email.toLowerCase().includes(q) || u.full_name.toLowerCase().includes(q);
  });

  return (
    <div>
      <SectionHeader
        title="Users"
        subtitle="Who can sign in to this dashboard, and who has admin access."
        count={items.length}
        onNew={() => { setForm(empty); setOpen(true); }}
        newLabel="Add user"
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search by name or email…" />

      {loading ? (
        <ListSkeleton rows={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={22} className="text-muted-foreground/40" />}
          label="No users found."
        />
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((u) => {
            const isSelf = me?.email === u.email;
            return (
              <li
                key={u.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-[var(--color-surface)] p-4 transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_20%,transparent)]"
              >
                {/* Avatar */}
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))" }}
                >
                  {(u.full_name || u.email).slice(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-semibold text-sm">{u.full_name || u.email}</span>
                    {u.is_admin && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                        style={{ background: "linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))" }}
                      >
                        <ShieldCheck size={9} /> Admin
                      </span>
                    )}
                    {isSelf && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                        you
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground mt-0.5">{u.email}</p>
                </div>

                {/* Toggle admin */}
                <button
                  onClick={() => toggleAdmin(u)}
                  disabled={isSelf}
                  title={u.is_admin ? "Remove admin" : "Make admin"}
                  className={
                    "inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-all disabled:opacity-40 " +
                    (u.is_admin
                      ? "border-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-1)_8%,transparent)] text-[var(--color-accent-1)] hover:bg-[color-mix(in_oklab,var(--color-accent-1)_14%,transparent)]"
                      : "border-border text-muted-foreground hover:border-[color-mix(in_oklab,var(--color-accent-1)_30%,transparent)] hover:text-[var(--color-accent-1)]")
                  }
                >
                  {u.is_admin ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
                  {u.is_admin ? "Admin" : "User"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => remove(u)}
                  disabled={isSelf}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all hover:border-red-400 hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40"
                  aria-label="Delete user"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={createUser}
        saving={saving}
        title="Add user"
        submitLabel="Create user"
      >
        <Field label="Email" full>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Full name" full>
          <input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Temporary password" full hint="At least 8 characters. Share it with the user.">
          <input type="text" value={form.password} onChange={(e) => set("password", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Admin access" full>
          <label className="mt-3 flex items-center gap-2.5 text-sm cursor-pointer select-none">
            <div
              className={
                "relative h-5 w-9 rounded-full transition-colors cursor-pointer " +
                (form.is_admin ? "bg-[var(--color-accent-1)]" : "bg-border")
              }
              onClick={() => set("is_admin", !form.is_admin)}
            >
              <div
                className={
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform " +
                  (form.is_admin ? "translate-x-4" : "translate-x-0.5")
                }
              />
            </div>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <UserPlus size={13} /> Grant admin access
            </span>
          </label>
        </Field>
      </Modal>
      {confirmEl}
    </div>
  );
}
