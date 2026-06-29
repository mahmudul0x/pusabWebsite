import { useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Phone, Trash2, MessageSquare } from "lucide-react";
import { contactApi, type ContactMessage } from "@/lib/api";
import { useResource, errMessage } from "./useResource";
import { SectionHeader, EmptyState, Toolbar, FilterSelect, ListSkeleton, useConfirm } from "./primitives";

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

  // Only contact messages (no phone = contact form)
  const contactItems = items.filter((m) => !m.phone || m.phone.trim() === "");
  const unread = contactItems.filter((m) => !m.is_read).length;

  const filtered = contactItems.filter((m) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.subject && m.subject.toLowerCase().includes(q)) ||
      m.message.toLowerCase().includes(q);
    const matchesF = filter === "all" || (filter === "unread" ? !m.is_read : m.is_read);
    return matchesQ && matchesF;
  });

  return (
    <div>
      <SectionHeader
        title="Messages"
        subtitle={`Contact form messages.${unread ? ` ${unread} unread.` : ""}`}
        count={contactItems.length}
        onNew={reload}
        newLabel="Refresh"
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search by name, email, subject…">
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
        <ListSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={22} className="text-muted-foreground/40" />}
          label={contactItems.length === 0 ? "No messages yet." : "No matches."}
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((m) => (
            <li
              key={m.id}
              className={
                "group rounded-2xl border bg-[var(--color-surface)] overflow-hidden transition-all " +
                (m.is_read
                  ? "border-border"
                  : "border-[color-mix(in_oklab,var(--color-accent-1)_35%,transparent)] shadow-sm shadow-[color-mix(in_oklab,var(--color-accent-1)_8%,transparent)]")
              }
            >
              {/* Top accent bar for unread */}
              {!m.is_read && (
                <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2))" }} />
              )}

              <div className="p-5">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {!m.is_read && (
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--color-accent-1)" }} />
                    )}
                    <div
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))" }}
                    >
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm leading-tight">{m.name}</p>
                      {m.email && (
                        <a href={`mailto:${m.email}`} className="text-xs text-muted-foreground hover:text-[var(--color-accent-1)] transition-colors">
                          {m.email}
                        </a>
                      )}
                    </div>
                    {m.phone && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
                        <Phone size={10} /> {m.phone}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(m.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {!m.is_read && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: "var(--color-accent-1)" }}>
                        New
                      </span>
                    )}
                  </div>
                </div>

                {m.subject && (
                  <p className="mt-3 text-sm font-semibold text-foreground/90">{m.subject}</p>
                )}
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground leading-relaxed">{m.message}</p>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => toggleRead(m)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-[var(--color-accent-1)]/40 hover:text-foreground"
                  >
                    {m.is_read ? <Mail size={12} /> : <MailOpen size={12} />}
                    {m.is_read ? "Mark unread" : "Mark read"}
                  </button>
                  {m.email && (
                    <a
                      href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Your message to PUSAB")}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-[var(--color-accent-1)]/40 hover:text-foreground"
                    >
                      <Mail size={12} /> Reply
                    </a>
                  )}
                  <button
                    onClick={() => remove(m)}
                    className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all hover:border-red-400 hover:bg-red-500/10 hover:text-red-500"
                    aria-label="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {confirmEl}
    </div>
  );
}
