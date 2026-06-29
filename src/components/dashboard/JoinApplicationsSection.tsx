import { useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, GraduationCap, MapPin, School, Phone, BookOpen } from "lucide-react";
import { contactApi, type ContactMessage } from "@/lib/api";
import { useResource, errMessage } from "./useResource";
import { SectionHeader, EmptyState, Toolbar, FilterSelect, useConfirm } from "./primitives";

function InfoPill({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
      {icon}
      {value}
    </span>
  );
}

export function JoinApplicationsSection() {
  const { items, loading, reload } = useResource(contactApi);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirm, confirmEl] = useConfirm();

  // Only show applications that came from the /join form (they have a phone number)
  const applications = items.filter((m) => m.phone && m.phone.trim() !== "");

  const unread = applications.filter((m) => !m.is_read).length;

  const filtered = applications.filter((m) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      (m.university && m.university.toLowerCase().includes(q)) ||
      (m.village && m.village.toLowerCase().includes(q)) ||
      (m.union_name && m.union_name.toLowerCase().includes(q));
    const matchesF =
      filter === "all" || (filter === "unread" ? !m.is_read : m.is_read);
    return matchesQ && matchesF;
  });

  async function toggleRead(m: ContactMessage) {
    try {
      await contactApi.update(m.id, { is_read: !m.is_read });
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  async function remove(m: ContactMessage) {
    if (!(await confirm(`Delete application from ${m.name}?`))) return;
    try {
      await contactApi.remove(m.id);
      toast.success("Deleted");
      reload();
    } catch (err) {
      toast.error(errMessage(err));
    }
  }

  return (
    <div>
      <SectionHeader
        title="Join Applications"
        subtitle={`Membership applications from the Join PUSAB form.${unread ? ` ${unread} new.` : ""}`}
        count={applications.length}
        onNew={reload}
        newLabel="Refresh"
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search by name, phone, university…">
        <FilterSelect
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "unread", label: "New" },
            { value: "read", label: "Reviewed" },
          ]}
        />
      </Toolbar>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-[var(--color-surface)]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="text-muted-foreground" />}
          label={applications.length === 0 ? "No applications yet." : "No matches."}
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
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {!m.is_read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent-1)]" />
                  )}
                  <span className="font-semibold text-base">{m.name}</span>
                  <a
                    href={`tel:${m.phone}`}
                    className="inline-flex items-center gap-1 text-sm text-[var(--color-accent-1)] hover:underline"
                  >
                    <Phone size={12} /> {m.phone}
                  </a>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>

              {/* Info pills */}
              <div className="mt-3 flex flex-wrap gap-2">
                {m.university && (
                  <InfoPill icon={<GraduationCap size={11} />} value={m.university} />
                )}
                {m.subject && (
                  <InfoPill icon={<BookOpen size={11} />} value={m.subject} />
                )}
                {m.session && (
                  <InfoPill icon={<BookOpen size={11} />} value={`Session: ${m.session}`} />
                )}
                {m.union_name && (
                  <InfoPill icon={<MapPin size={11} />} value={m.union_name} />
                )}
                {m.village && (
                  <InfoPill icon={<MapPin size={11} />} value={m.village} />
                )}
                {m.school && (
                  <InfoPill icon={<School size={11} />} value={m.school} />
                )}
                {m.college && (
                  <InfoPill icon={<School size={11} />} value={m.college} />
                )}
              </div>

              {m.message && (
                <p className="mt-3 text-sm text-foreground/80 border-t border-border pt-3 whitespace-pre-line">
                  {m.message}
                </p>
              )}

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => toggleRead(m)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {m.is_read ? <Mail size={13} /> : <MailOpen size={13} />}
                  {m.is_read ? "Mark unreviewed" : "Mark reviewed"}
                </button>
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
