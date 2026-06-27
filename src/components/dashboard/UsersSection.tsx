import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { usersApi, register, useAuth, type AdminUser } from "@/lib/api";
import { useResource, errMessage } from "./useResource";
import { Field, Modal, SectionHeader, EmptyState, Toolbar, useConfirm, inputCls } from "./primitives";

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
      return toast.error("Email and an 8+ char password are required");
    setSaving(true);
    try {
      const created = await register({
        email: form.email,
        password: form.password,
        full_name: form.full_name,
      });
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
        onNew={() => {
          setForm(empty);
          setOpen(true);
        }}
        newLabel="Add user"
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search users…" />

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl border border-border bg-[var(--color-surface)]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState label="No users found." />
      ) : (
        <ul className="space-y-3">
          {filtered.map((u) => {
            const isSelf = me?.email === u.email;
            return (
              <li
                key={u.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-[var(--color-surface)] p-4"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-xs font-bold text-white">
                  {u.email.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{u.full_name || u.email}</span>
                    {u.is_admin && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--color-accent-1)_14%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent-1)]">
                        <ShieldCheck size={10} /> Admin
                      </span>
                    )}
                    {isSelf && <span className="text-[10px] text-muted-foreground">(you)</span>}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={u.is_admin}
                    disabled={isSelf}
                    onChange={() => toggleAdmin(u)}
                  />
                  Admin
                </label>
                <button
                  onClick={() => remove(u)}
                  disabled={isSelf}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-red-500 hover:text-red-500 disabled:opacity-40"
                  aria-label="Delete user"
                >
                  <Trash2 size={14} />
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
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Full name" full>
          <input
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Temporary password" full hint="At least 8 characters. Share it with the user.">
          <input
            type="text"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Admin access">
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_admin}
              onChange={(e) => set("is_admin", e.target.checked)}
            />
            <span className="inline-flex items-center gap-1">
              <UserPlus size={14} /> Make this user an admin
            </span>
          </label>
        </Field>
      </Modal>
      {confirmEl}
    </div>
  );
}
