import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { AnimatedHeading } from "@/components/site/AnimatedHeading";
import { SITE } from "@/lib/site-content";

const QUERY = encodeURIComponent(SITE.location);

export function LocationMap() {
  return (
    <section className="py-24 md:py-28">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] lg:grid-cols-[1fr_1.3fr]"
        >
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-label mb-3">Where we are</p>
            <AnimatedHeading
              as="h2"
              className="font-display text-3xl md:text-4xl font-bold tracking-tight"
            >
              Rooted in Bishwambarpur
            </AnimatedHeading>
            <p className="mt-5 flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-accent-1)]" />
              {SITE.location}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${QUERY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:text-foreground"
            >
              <Navigation size={14} /> Get directions
            </a>
          </div>

          <div className="relative min-h-[280px]">
            <iframe
              title="Bishwambarpur Upazila, Sunamganj"
              src={`https://maps.google.com/maps?q=${QUERY}&output=embed`}
              loading="lazy"
              className="absolute inset-0 h-full w-full grayscale-[0.3] contrast-[1.05]"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
