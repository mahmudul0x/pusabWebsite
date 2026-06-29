import { useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { contactApi, type ContactMessage } from "@/lib/api";
import { useResource, errMessage } from "./useResource";
import { SectionHeader, EmptyState, Toolbar, FilterSelect, useConfirm } from "./primitives";

export function MessagesSection() {
  const { items, loading, reload } = useResource(contactApi);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirm, confirmEl] = useConfirm();

  async function toggleRead(m: ContactMessage) {
    try {
      await contactApi.update(m.id, { is_read: !m.is_read });
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  async function remove(m: ContactMessage) {
    if (!(await confirm(`Delete the message from ${m.name}?`))) return;
    try {
      await contactApi.remove(m.id);
      toast.success("Deleted");
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  const filtered = items.filter((m) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.subject && m.subject.toLowerCase().includes(q)) ||
      m.message.toLowerCase().includes(q);
    const matchesF =
      filter === "all" || (filter === "unread" ? !m.is_read : m.is_read);
    return matchesQ && matchesF;
  });
  const unread = items.filter((m) => !m.is_read).length;

  return (
    <div>
      <SectionHeader
        title="Messages"
        subtitle={`Messages from the public Contact form.${unread ? ` ${unread} unread.` : ""}`}
        count={items.length}
        onNew={reload}
        newLabel="Refresh"
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search messages…">
        <FilterSelect
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "unread", label: "Unread" },
            { value: "read", label: "Read" },
          ]}
        />
      </Toolbar>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-[var(--color-surface)]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Mail className="text-muted-foreground" />}
          label={items.length === 0 ? "No messages yet." : "No matches."}
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((m) => (
            <li
              key={m.id}
              className={
                "rounded-2xl border bg-[var(--color-surface)] p-5 transition-colors " +
                (m.is_read
                  ? "border-border"
                  : "border-[color-mix(in_oklab,var(--color-accent-1)_40%,transparent)]")
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!m.is_read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent-1)]" />
                    )}
                    <span className="font-semibold">{m.name}</span>
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        className="text-sm text-[var(--color-accent-1)] hover:underline"
                      >
                        {m.email}
                      </a>
                    )}
                    {m.phone && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone size={11} /> {m.phone}
                      </span>
                    )}
                  </div>
                  {m.subject && <p className="mt-1 text-sm font-medium">{m.subject}</p>}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-foreground/85">{m.message}</p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => toggleRead(m)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {m.is_read ? <Mail size={13} /> : <MailOpen size={13} />}
                  {m.is_read ? "Mark unread" : "Mark read"}
                </button>
                {m.email && (
                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Your message to PUSAB")}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Mail size={13} /> Reply
                  </a>
                )}
                <button
                  onClick={() => remove(m)}
                  className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-red-500 hover:text-red-500"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {confirmEl}
    </div>
  );
}
