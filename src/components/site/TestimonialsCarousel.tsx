import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonialsApi, optimizeImage, type Testimonial } from "@/lib/api";
import { AnimatedHeading } from "@/components/site/AnimatedHeading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

export function TestimonialsCarousel() {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    let active = true;
    testimonialsApi
      .list({ is_featured: true })
      .then((res) => active && setItems(res.results))
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!api) return;
    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [api]);

  if (items !== null && items.length === 0) return null;

  return (
    <section className="py-28 md:py-32 relative overflow-hidden bg-[var(--color-surface-2)]">
      <div className="absolute -right-32 top-1/3 h-[40vh] w-[40vh] rounded-full bg-[var(--color-accent-1)] opacity-10 blur-[120px]" />
      <div className="container-page relative">
        <div className="mb-16 max-w-xl">
          <p className="text-label mb-3">Community voices</p>
          <AnimatedHeading
            as="h2"
            className="font-display text-4xl md:text-5xl font-bold tracking-tight"
          >
            What Our Members Say
          </AnimatedHeading>
        </div>

        {items === null ? null : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Carousel opts={{ loop: true, align: "start" }} setApi={setApi} className="mx-auto max-w-4xl">
              <CarouselContent>
                {items.map((t) => (
                  <CarouselItem key={t.id}>
                    <div className="relative rounded-2xl border border-border bg-[var(--color-surface)] p-8 md:p-12 text-center">
                      <Quote
                        className="absolute -top-4 left-1/2 -translate-x-1/2 text-[var(--color-surface-2)]"
                        size={90}
                        strokeWidth={1}
                      />
                      <div className="relative">
                        <p className="mx-auto max-w-2xl font-display text-lg md:text-xl leading-relaxed text-foreground/90">
                          "{t.quote}"
                        </p>
                        <div className="mt-7 flex items-center justify-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))]">
                            {t.photo_url ? (
                              <img
                                src={optimizeImage(t.photo_url, 120)}
                                alt={t.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="grid h-full w-full place-items-center text-sm font-bold text-white select-none">
                                {t.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-sm">{t.name}</p>
                            {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {items.length > 1 && (
                <>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </>
              )}
            </Carousel>
          </motion.div>
        )}
      </div>
    </section>
  );
}
