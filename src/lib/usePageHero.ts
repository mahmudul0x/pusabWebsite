import { useEffect, useState } from "react";
import { pageHeroApi, type PageHero, type PageHeroKey } from "@/lib/api";

/**
 * Loads the dashboard-editable hero (title/lede/images) for a page. Falls
 * back to the given defaults until the fetch resolves, or forever if this
 * page has no custom title/lede/image set (so the site keeps working before
 * a migration is seeded or the API is unreachable).
 */
export function usePageHero(page: PageHeroKey) {
  const [hero, setHero] = useState<PageHero | null>(null);

  useEffect(() => {
    let cancelled = false;
    pageHeroApi
      .get(page)
      .then((h) => {
        if (!cancelled) setHero(h);
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  return {
    title: hero?.title || undefined,
    lede: hero?.lede || undefined,
    /** First image in the ordered list, if any. */
    image: hero?.images?.[0]?.image_url || undefined,
    imageAlt: hero?.images?.[0]?.alt_text || undefined,
    /** Full ordered image list — for the home page slideshow. */
    images: hero?.images ?? [],
  };
}
