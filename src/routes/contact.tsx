import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { GradientButton } from "@/components/site/GradientButton";
import { contactApi } from "@/lib/api";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  ArrowUpRight,
  Clock,
  Copy,
  Check,
  ChevronRight,
  Navigation,
} from "lucide-react";
import { SITE } from "@/lib/site-content";
import contactHero from "@/assets/contact-hero.jpeg";

const COORDS = { lat: 25.1639, lng: 91.2533 };
const LATLNG = `${COORDS.lat},${COORDS.lng}`;

const MAP_LINKS = {
  /** Zoomed to the upazila so the pin reads as a place, not a street address. */
  embed: `https://www.google.com/maps?q=${LATLNG}&z=12&output=embed`,
  view: `https://www.google.com/maps/search/?api=1&query=${LATLNG}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${LATLNG}`,
};

/** Dhaka time, formatted where the visitor is — the office is UTC+06:00. */
function useLocalTime() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "Asia/Dhaka",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — PUSAB" },
      {
        name: "description",
        content:
          "Get in touch with the Public University Students' Association of Bishwambarpur — questions, partnerships, scholarship inquiries.",
      },
      { property: "og:title", content: "Contact — PUSAB" },
      {
        property: "og:description",
        content: "Reach the PUSAB team for questions, partnerships and scholarship inquiries.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function Field({
  label,
  type = "text",
  value,
  onChange,
  textarea,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  required?: boolean;
}) {
  const hasValue = value.length > 0;
  const sharedClass =
    "peer w-full bg-transparent outline-none px-4 pt-6 pb-2 text-sm border border-border rounded-xl focus:border-[var(--color-accent-1)] transition-colors";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea
          rows={5}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={sharedClass + " resize-none"}
        />
      ) : (
        <input
          type={type}
          value={value}
          required={required}
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

function ContactPage() {
  return (
    <>
      <HeroSlider />
      <ContactBody />
    </>
  );
}

function HeroSlider() {
  return (
    <section className="relative h-[78vh] min-h-[560px] max-h-[820px] w-full overflow-hidden bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          opacity: { duration: 0.9, ease: "easeOut" },
          scale: { duration: 7, ease: "linear" },
        }}
        className="absolute inset-0"
      >
        <img src={contactHero} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-transparent to-transparent" />
      </motion.div>

      {/* Breadcrumbs */}
      <div className="absolute top-32 md:top-36 left-0 right-0 z-10">
        <div className="container-page">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-foreground">Contact</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-20 md:pb-24 z-10">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="text-label mb-4 text-[var(--color-accent-1)]">Get in touch</p>
            <h1 className="font-display text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
              Start a conversation
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
              Questions, partnerships and scholarship inquiries are always welcome.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactBody() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const localTime = useLocalTime();

  function copyValue(key: string, value: string) {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    // Guard the send itself, so a blank message can't slip through even if the
    // browser's own field validation is bypassed.
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, subject and message.");
      return;
    }
    setBusy(true);
    try {
      await contactApi.create({ name, email, subject, message, phone: "" });
      toast.success("Message sent — we'll get back to you soon.");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch {
      toast.error("Couldn't send your message. Please check the fields and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Form + direct channels */}
      <section className="pb-16 md:pb-24">
        <div className="container-page">
          <div className="mb-8">
            <p className="text-label mb-2 text-[var(--color-accent-1)]">Write to us</p>
            <h2 className="text-3xl md:text-5xl font-display tracking-tight">Share your inquiry</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
            {/* Form */}
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="md:col-span-8 rounded-3xl border border-border bg-[var(--color-surface)] p-6 md:p-10 space-y-4 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Name" value={name} onChange={setName} required />
                <Field label="Email" type="email" value={email} onChange={setEmail} required />
              </div>
              <Field label="Subject" value={subject} onChange={setSubject} required />
              <Field label="Message" value={message} onChange={setMessage} textarea required />
              <div className="pt-4 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-xs text-muted-foreground">We aim to respond within 48 hours.</p>
                <GradientButton type="submit">{busy ? "Sending…" : "Send Message"}</GradientButton>
              </div>
            </motion.form>

            {/* Direct channel cards */}
            {/* Email */}
            {[
              {
                key: "email",
                icon: Mail,
                label: "Email",
                value: SITE.email,
                href: `mailto:${SITE.email}`,
              },
              {
                key: "social",
                icon: Facebook,
                label: "Facebook",
                value: "facebook.com/info.pusab",
                href: SITE.facebook,
              },
              {
                key: "hours",
                icon: Clock,
                label: "Response time",
                value: "Within 48 hours",
                href: null,
              },
            ].map((c, idx) => (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: 0.06 * (idx + 1), ease: "easeOut" }}
                className="md:col-span-4 group rounded-3xl border border-border bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent-1)]/40 transition-colors shadow-sm"
              >
                <div className="h-10 w-10 rounded-xl bg-[var(--color-accent-1)]/10 border border-[var(--color-accent-1)]/20 flex items-center justify-center text-[var(--color-accent-1)]">
                  <c.icon size={18} />
                </div>
                <p className="text-label mt-5">{c.label}</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="text-sm md:text-base font-medium truncate hover:text-[var(--color-accent-1)] transition-colors"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <span className="text-sm md:text-base font-medium truncate">{c.value}</span>
                  )}
                  {c.href && c.key !== "hours" && (
                    <button
                      type="button"
                      onClick={(ev) => { ev.preventDefault(); copyValue(c.key, c.value); }}
                      className="shrink-0 text-muted-foreground hover:text-[var(--color-accent-1)] transition-colors"
                      aria-label={`Copy ${c.label}`}
                    >
                      {copied === c.key ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Phone card — two numbers */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.06, ease: "easeOut" }}
              className="md:col-span-4 group rounded-3xl border border-border bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent-1)]/40 transition-colors shadow-sm"
            >
              <div className="h-10 w-10 rounded-xl bg-[var(--color-accent-1)]/10 border border-[var(--color-accent-1)]/20 flex items-center justify-center text-[var(--color-accent-1)]">
                <Phone size={18} />
              </div>
              <p className="text-label mt-5">Phone</p>
              <div className="mt-1 space-y-1.5">
                {[
                  { key: "phone-p", value: SITE.phonePresident, label: "President" },
                  { key: "phone-gs", value: SITE.phoneGS, label: "GS" },
                ].map((p) => (
                  <div key={p.key} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <a href={`tel:${p.value}`} className="text-sm font-medium hover:text-[var(--color-accent-1)] transition-colors">
                        {p.value}
                      </a>
                      <span className="ml-1.5 text-xs text-muted-foreground">({p.label})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyValue(p.key, p.value)}
                      className="shrink-0 text-muted-foreground hover:text-[var(--color-accent-1)] transition-colors"
                      aria-label={`Copy ${p.label} number`}
                    >
                      {copied === p.key ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map section */}
      <section className="pb-28 md:pb-32">
        <div className="container-page">
          <div className="mb-6 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-label mb-2 text-[var(--color-accent-2)]">Visit us</p>
              <h2 className="text-3xl md:text-5xl font-display tracking-tight">
                Bishwambarpur, Sunamganj
              </h2>
            </div>
            <a
              href={MAP_LINKS.directions}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-1)] hover:underline"
            >
              Get directions <ArrowUpRight size={14} />
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.12)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr]">
              <div className="group relative isolate">
                <iframe
                  title="PUSAB — Bishwambarpur, Sunamganj"
                  src={MAP_LINKS.embed}
                  className="h-[380px] w-full saturate-[0.72] contrast-[1.04] transition-[filter] duration-500 group-hover:saturate-100 md:h-[540px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Softens the embed's edge into the card without eating pointer
                    events on the map itself. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.06]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/[0.07] to-transparent"
                />

                {/* Floating place chip — gives the raw embed an anchor. */}
                <div className="pointer-events-none absolute left-4 top-4 md:left-5 md:top-5">
                  <div className="flex items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-white/85 py-2 pl-2.5 pr-3.5 shadow-lg backdrop-blur-md">
                    <span
                      className="grid h-8 w-8 place-items-center rounded-xl text-white shadow-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))",
                      }}
                    >
                      <MapPin size={15} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-[13px] font-bold tracking-tight text-slate-900">PUSAB</p>
                      <p className="text-[11px] text-slate-600">Bishwambarpur, Sunamganj</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col border-t border-border p-7 md:p-9 lg:border-l lg:border-t-0">
                <div>
                  <p className="text-label mb-2.5">Our location</p>
                  <p className="font-display text-xl leading-tight tracking-tight">
                    PUSAB · Bishwambarpur
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Govt. Digendra Barman College vicinity, Bishwambarpur Upazila, Sunamganj —
                    Sylhet Division, Bangladesh.
                  </p>
                </div>

                <dl className="mt-7 space-y-4 border-t border-border pt-6 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-[var(--color-accent-1)]" />
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                        Region
                      </dt>
                      <dd className="mt-0.5">Sylhet Division, Bangladesh</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={15} className="mt-0.5 shrink-0 text-[var(--color-accent-1)]" />
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                        Local time
                      </dt>
                      <dd className="mt-0.5 tabular-nums">
                        {localTime ? `${localTime} · UTC +06:00` : "UTC +06:00"}
                      </dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-auto space-y-2.5 pt-7">
                  <a
                    href={MAP_LINKS.directions}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
                    style={{
                      background:
                        "linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))",
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Navigation size={14} /> Get directions
                    </span>
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                  <a
                    href={MAP_LINKS.view}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:text-[var(--color-accent-1)]"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
