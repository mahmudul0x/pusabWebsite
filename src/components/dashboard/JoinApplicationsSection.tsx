import { useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, GraduationCap, MapPin, School, Phone, BookOpen, Users, Droplet, UserRound } from "lucide-react";
import { contactApi, type ContactMessage } from "@/lib/api";
import { useResource, errMessage } from "./useResource";
import { SectionHeader, EmptyState, Toolbar, FilterSelect, ListSkeleton, useConfirm } from "./primitives";

function InfoPill({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-[var(--color-background)] px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
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
      (m.union_name && m.union_name.toLowerCase().includes(q)) ||
      (m.father_name && m.father_name.toLowerCase().includes(q)) ||
      (m.mother_name && m.mother_name.toLowerCase().includes(q));
    const matchesF = filter === "all" || (filter === "unread" ? !m.is_read : m.is_read);
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

      <Toolbar query={query} onQuery={setQuery} placeholder="Search by name, phone, institute…">
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
        <ListSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={22} className="text-muted-foreground/40" />}
          label={applications.length === 0 ? "No applications yet." : "No matches."}
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
              {!m.is_read && (
                <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2))" }} />
              )}

              <div className="p-5">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {!m.is_read && (
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--color-accent-1)" }} />
                    )}
                    <div
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                      style={{ background: "linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))" }}
                    >
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm leading-tight">{m.name}</p>
                      <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-[var(--color-accent-1)] transition-colors mt-0.5">
                        <Phone size={10} /> {m.phone}
                      </a>
                    </div>
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

                {/* Info pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.father_name && <InfoPill icon={<UserRound size={10} />} value={`Father: ${m.father_name}`} />}
                  {m.mother_name && <InfoPill icon={<UserRound size={10} />} value={`Mother: ${m.mother_name}`} />}
                  {m.blood_group && <InfoPill icon={<Droplet size={10} />} value={m.blood_group} />}
                  {m.university && <InfoPill icon={<GraduationCap size={10} />} value={m.university} />}
                  {m.subject && <InfoPill icon={<BookOpen size={10} />} value={m.subject} />}
                  {m.session && <InfoPill icon={<BookOpen size={10} />} value={`Session: ${m.session}`} />}
                  {m.union_name && <InfoPill icon={<MapPin size={10} />} value={m.union_name} />}
                  {m.village && <InfoPill icon={<MapPin size={10} />} value={m.village} />}
                  {m.school && <InfoPill icon={<School size={10} />} value={m.school} />}
                  {m.college && <InfoPill icon={<School size={10} />} value={m.college} />}
                </div>

                {m.message && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3 whitespace-pre-line">
                    {m.message}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => toggleRead(m)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-[color-mix(in_oklab,var(--color-accent-1)_40%,transparent)] hover:text-foreground"
                  >
                    {m.is_read ? <Mail size={12} /> : <MailOpen size={12} />}
                    {m.is_read ? "Mark unreviewed" : "Mark reviewed"}
                  </button>
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
