import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { GradientButton } from "@/components/site/GradientButton";
import { contactApi } from "@/lib/api";
import { ChevronRight, GraduationCap, MapPin, Users } from "lucide-react";
import heroLeadership from "@/assets/hero-leadership.jpg";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join PUSAB" },
      {
        name: "description",
        content:
          "Got admitted to a public university from Bishwambarpur? Fill in the membership form and join the PUSAB family.",
      },
      { property: "og:title", content: "Join PUSAB" },
      { property: "og:url", content: "/join" },
    ],
    links: [{ rel: "canonical", href: "/join" }],
  }),
  component: JoinPage,
});

function Field({
  label,
  type = "text",
  value,
  onChange,
  textarea,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const hasValue = value.length > 0;
  const sharedClass =
    "peer w-full bg-transparent outline-none px-4 pt-6 pb-2 text-sm border border-border rounded-xl focus:border-[var(--color-accent-1)] transition-colors";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={sharedClass + " resize-none"}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={sharedClass}
        />
      )}
      <span
        className={
          "pointer-events-none absolute left-4 transition-all duration-200 " +
          (hasValue
            ? "top-2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent-1)]"
            : "top-4 text-sm text-muted-foreground peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-[var(--color-accent-1)]")
        }
      >
        {label}
      </span>
    </label>
  );
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const hasValue = value.length > 0;
  return (
    <label className="relative block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer w-full bg-transparent outline-none px-4 pt-6 pb-2 text-sm border border-border rounded-xl focus:border-[var(--color-accent-1)] transition-colors appearance-none"
      >
        <option value="" disabled hidden />
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span
        className={
          "pointer-events-none absolute left-4 transition-all duration-200 " +
          (hasValue
            ? "top-2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent-1)]"
            : "top-4 text-sm text-muted-foreground peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-[var(--color-accent-1)]")
        }
      >
        {label}
      </span>
    </label>
  );
}

function JoinPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [subject, setSubject] = useState("");
  const [university, setUniversity] = useState("");
  const [session, setSession] = useState("");
  const [unionName, setUnionName] = useState("");
  const [village, setVillage] = useState("");
  const [school, setSchool] = useState("");
  const [college, setCollege] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);

  function reset() {
    setName(""); setPhone(""); setFatherName(""); setMotherName(""); setBloodGroup("");
    setSubject(""); setUniversity("");
    setSession(""); setUnionName(""); setVillage(""); setSchool("");
    setCollege(""); setMessage("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    if (!name.trim() || !phone.trim() || !fatherName.trim() || !motherName.trim() || !bloodGroup.trim()) {
      toast.error("Full name, phone, parents' names and blood group are required.");
      return;
    }
    setBusy(true);
    try {
      await contactApi.create({
        name, phone, father_name: fatherName, mother_name: motherName, blood_group: bloodGroup,
        subject, university, session,
        union_name: unionName, village, school, college, message,
        email: "",
      } as never);
      toast.success("Application submitted! We will be in touch soon.");
      reset();
    } catch {
      toast.error("Could not submit. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[580px] w-full overflow-hidden bg-background">
        <img src={heroLeadership} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />

        {/* Breadcrumbs */}
        <div className="absolute top-32 md:top-36 left-0 right-0 z-10">
          <div className="container-page">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight size={12} />
              <span className="text-foreground">Join PUSAB</span>
            </nav>
          </div>
        </div>

        <div className="absolute inset-0 flex items-end pb-16 md:pb-20 z-10">
          <div className="container-page">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <p
                className="mb-3 text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: "var(--color-accent-1)" }}
              >
                Membership
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Join PUSAB
              </h1>
              <p className="mt-4 text-base text-muted-foreground max-w-xl">
                Got admitted to a public university from Bishwambarpur? Fill in the form below and we will welcome you into the PUSAB family.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 md:gap-12">
            {/* Form */}
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-3xl border border-border bg-[var(--color-surface)] p-6 md:p-10 space-y-4 shadow-sm"
            >
              {/* Honeypot */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}>
                <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} autoComplete="off" tabIndex={-1} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: "var(--color-accent-2)" }}>
                  Personal Info
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full name *" value={name} onChange={setName} />
                  <Field label="Phone *" type="tel" value={phone} onChange={setPhone} />
                  <Field label="Father's name *" value={fatherName} onChange={setFatherName} />
                  <Field label="Mother's name *" value={motherName} onChange={setMotherName} />
                  <SelectField label="Blood group *" value={bloodGroup} onChange={setBloodGroup} options={BLOOD_GROUPS} />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4 mt-2" style={{ color: "var(--color-accent-2)" }}>
                  Institute
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Institute" value={university} onChange={setUniversity} />
                  <Field label="Session (e.g. 2023-24)" value={session} onChange={setSession} />
                </div>
                <div className="mt-4">
                  <Field label="Subject / Department" value={subject} onChange={setSubject} />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4 mt-2" style={{ color: "var(--color-accent-2)" }}>
                  Home
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Union" value={unionName} onChange={setUnionName} />
                  <Field label="Village" value={village} onChange={setVillage} />
                  <Field label="School" value={school} onChange={setSchool} />
                  <Field label="College" value={college} onChange={setCollege} />
                </div>
              </div>

              <Field label="Message (optional)" value={message} onChange={setMessage} textarea />

              <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-xs text-muted-foreground">* Required fields.</p>
                <GradientButton type="submit">{busy ? "Sending…" : "Submit Application"}</GradientButton>
              </div>
            </motion.form>

            {/* Sidebar info */}
            <div className="space-y-4">
              {[
                {
                  Icon: GraduationCap,
                  title: "Who can join?",
                  body: "Any student from Bishwambarpur who is currently enrolled in a public university, government medical college and engineering college in Bangladesh.",
                },
                {
                  Icon: Users,
                  title: "What happens next?",
                  body: "We review your application and add you to the PUSAB group. A committee member will reach out on your phone number.",
                },
                {
                  Icon: MapPin,
                  title: "Where are we?",
                  body: "Bishwambarpur Upazila, Sunamganj, Sylhet Division, Bangladesh.",
                },
              ].map(({ Icon, title, body }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 * (i + 1) }}
                  className="rounded-2xl border border-border bg-[var(--color-surface)] p-5"
                >
                  <div
                    className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))" }}
                  >
                    <Icon size={16} />
                  </div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
