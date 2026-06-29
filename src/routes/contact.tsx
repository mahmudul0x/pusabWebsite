import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SITE } from "@/lib/site-content";
import heroImg1 from "@/assets/contact-hero-1.jpg";
import heroImg2 from "@/assets/contact-hero-2.jpg";
import heroImg3 from "@/assets/contact-hero-3.jpg";

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
          rows={5}
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

function ContactPage() {
  return (
    <>
      <HeroSlider />
      <ContactBody />
    </>
  );
}

const HERO_SLIDES = [
  {
    img: heroImg1,
    kicker: "Get in touch",
    title: "Start a conversation",
    caption: "Questions, partnerships and scholarship inquiries are always welcome.",
  },
  {
    img: heroImg2,
    kicker: "From Bishwambarpur",
    title: "Rooted in service",
    caption: "A student-led organization shaped by community and commitment.",
  },
  {
    img: heroImg3,
    kicker: "We respond promptly",
    title: "A reply within 48 hours",
    caption: "Every message is reviewed by a member of the team.",
  },
];

function HeroSlider() {
  const [i, setI] = useState(0);
  const n = HERO_SLIDES.length;

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(id);
  }, [n]);

  const go = (next: number) => setI(((next % n) + n) % n);
  const slide = HERO_SLIDES[i];

  return (
    <section className="relative h-[78vh] min-h-[560px] max-h-[820px] w-full overflow-hidden bg-background">
      <AnimatePresence mode="sync">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.9, ease: "easeOut" },
            scale: { duration: 7, ease: "linear" },
          }}
          className="absolute inset-0"
        >
          <img src={slide.img} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

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
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <p className="text-label mb-4 text-[var(--color-accent-1)]">{slide.kicker}</p>
              <h1 className="font-display text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                {slide.title}
              </h1>
              <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
                {slide.caption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 md:bottom-8 right-0 z-20">
        <div className="container-page flex items-center justify-end gap-4">
          <div className="flex items-center gap-1.5">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => go(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1 transition-all rounded-full ${idx === i ? "w-10 bg-[var(--color-accent-1)]" : "w-5 bg-border hover:bg-muted-foreground"}`}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-muted-foreground tabular-nums">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={() => go(i - 1)}
              aria-label="Previous"
              className="h-9 w-9 rounded-full border border-border bg-background/60 backdrop-blur hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)] transition-colors flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => go(i + 1)}
              aria-label="Next"
              className="h-9 w-9 rounded-full border border-border bg-background/60 backdrop-blur hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)] transition-colors flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
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

  const COORDS = { lat: 25.1639, lng: 91.2533 };

  function copyValue(key: string, value: string) {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
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
                <Field label="Name" value={name} onChange={setName} />
                <Field label="Email" type="email" value={email} onChange={setEmail} />
              </div>
              <Field label="Subject" value={subject} onChange={setSubject} />
              <Field label="Message" value={message} onChange={setMessage} textarea />
              <div className="pt-4 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-xs text-muted-foreground">We aim to respond within 48 hours.</p>
                <GradientButton type="submit">{busy ? "Sending…" : "Send Message"}</GradientButton>
              </div>
            </motion.form>

            {/* Direct channel cards */}
            {[
              {
                key: "email",
                icon: Mail,
                label: "Email",
                value: SITE.email,
                href: `mailto:${SITE.email}`,
              },
              {
                key: "phone",
                icon: Phone,
                label: "Phone",
                value: SITE.phone,
                href: `tel:${SITE.phone}`,
              },
              {
                key: "social",
                icon: Facebook,
                label: "Facebook",
                value: "facebook.com/PUSAB",
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
              href={`https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}`}
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
            className="rounded-3xl border border-border overflow-hidden bg-[var(--color-surface)] shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
              <div className="relative">
                <iframe
                  title="PUSAB — Bishwambarpur, Sunamganj"
                  src={`https://www.google.com/maps?q=${COORDS.lat},${COORDS.lng}&z=13&output=embed`}
                  className="w-full h-[420px] md:h-[520px] grayscale-[0.4]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="border-t lg:border-t-0 lg:border-l border-border p-6 md:p-8 space-y-6 bg-background/30">
                <div>
                  <p className="text-label mb-2">Our location</p>
                  <p className="text-lg font-display leading-tight">PUSAB · Bishwambarpur</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Govt. Digendra Barman College vicinity, Bishwambarpur Upazila, Sunamganj —
                    Sylhet Division, Bangladesh.
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 text-[var(--color-accent-1)] shrink-0" />
                    <span>Sylhet Division, Bangladesh</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="mt-0.5 text-[var(--color-accent-1)] shrink-0" />
                    <span>Local time · UTC +06:00</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${COORDS.lat},${COORDS.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-sm group hover:text-[var(--color-accent-1)] transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-sm group hover:text-[var(--color-accent-1)] transition-colors"
                  >
                    <span>Get directions</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
