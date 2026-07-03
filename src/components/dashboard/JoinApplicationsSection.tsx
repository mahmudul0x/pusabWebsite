import { useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, GraduationCap, MapPin, School, Phone, BookOpen, Users, Droplet, UserRound } from "lucide-react";
import { contactApi, type ContactMessage } from "@/lib/api";
import { useResource, errMessage } from "./useResource";
import { SectionHeader, EmptyState, Toolbar, FilterSelect, ListSkeleton, useConfirm } from "./primitives";

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-[var(--color-background)] text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/70">{label}</p>
        <p className="text-sm font-medium leading-snug break-words">{value}</p>
      </div>
    </div>
  );
}

function DetailGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-[var(--color-background)]/60 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent-1)] mb-2.5">
        {title}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
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

                {/* Details */}
                <div className="mt-4 space-y-2.5">
                  {(m.father_name || m.mother_name || m.blood_group) && (
                    <DetailGroup title="Family">
                      {m.father_name && (
                        <DetailItem icon={<UserRound size={12} />} label="Father's name" value={m.father_name} />
                      )}
                      {m.mother_name && (
                        <DetailItem icon={<UserRound size={12} />} label="Mother's name" value={m.mother_name} />
                      )}
                      {m.blood_group && (
                        <DetailItem icon={<Droplet size={12} />} label="Blood group" value={m.blood_group} />
                      )}
                    </DetailGroup>
                  )}

                  {(m.university || m.subject || m.session) && (
                    <DetailGroup title="Academic">
                      {m.university && (
                        <DetailItem icon={<GraduationCap size={12} />} label="Institute" value={m.university} />
                      )}
                      {m.subject && (
                        <DetailItem icon={<BookOpen size={12} />} label="Subject / Department" value={m.subject} />
                      )}
                      {m.session && <DetailItem icon={<BookOpen size={12} />} label="Session" value={m.session} />}
                    </DetailGroup>
                  )}

                  {(m.union_name || m.village || m.school || m.college) && (
                    <DetailGroup title="Address & Schooling">
                      {m.union_name && <DetailItem icon={<MapPin size={12} />} label="Union" value={m.union_name} />}
                      {m.village && <DetailItem icon={<MapPin size={12} />} label="Village" value={m.village} />}
                      {m.school && <DetailItem icon={<School size={12} />} label="School" value={m.school} />}
                      {m.college && <DetailItem icon={<School size={12} />} label="College" value={m.college} />}
                    </DetailGroup>
                  )}
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
