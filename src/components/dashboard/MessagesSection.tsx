import { useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Phone, Trash2, GraduationCap, MapPin, School, BookOpen } from "lucide-react";
import { contactApi, type ContactMessage } from "@/lib/api";
import { useResource, errMessage } from "./useResource";
import { SectionHeader, EmptyState, Toolbar, FilterSelect, useConfirm } from "./primitives";

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className="shrink-0 text-(--color-accent-1)">{icon}</span>
      <span className="text-xs font-medium text-foreground/60">{label}:</span>
      <span className="text-xs truncate">{value}</span>
    </div>
  );
}

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
      m.phone.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.university && m.university.toLowerCase().includes(q)) ||
      (m.village && m.village.toLowerCase().includes(q)) ||
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
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {!m.is_read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent-1)]" />
                    )}
                    <span className="font-semibold text-base">{m.name}</span>
                    <a
                      href={`tel:${m.phone}`}
                      className="inline-flex items-center gap-1 text-sm text-(--color-accent-1) hover:underline"
                    >
                      <Phone size={12} /> {m.phone}
                    </a>
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="text-xs text-muted-foreground hover:underline">
                        {m.email}
                      </a>
                    )}
                  </div>
                  {m.subject && <p className="mt-1 text-sm font-medium">{m.subject}</p>}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>

              {/* Info grid */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-sm">
                {m.university && (
                  <InfoRow icon={<GraduationCap size={12} />} label="University" value={m.university} />
                )}
                {m.session && (
                  <InfoRow icon={<BookOpen size={12} />} label="Session" value={m.session} />
                )}
                {m.union_name && (
                  <InfoRow icon={<MapPin size={12} />} label="Union" value={m.union_name} />
                )}
                {m.village && (
                  <InfoRow icon={<MapPin size={12} />} label="Village" value={m.village} />
                )}
                {m.school && (
                  <InfoRow icon={<School size={12} />} label="School" value={m.school} />
                )}
                {m.college && (
                  <InfoRow icon={<School size={12} />} label="College" value={m.college} />
                )}
              </div>

              {m.message && (
                <p className="mt-3 whitespace-pre-line text-sm text-foreground/80 border-t border-border pt-3">
                  {m.message}
                </p>
              )}

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
