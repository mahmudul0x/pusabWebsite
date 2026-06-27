import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ListApi<T> {
  listAll: (params?: Record<string, string | number | boolean | undefined>) => Promise<T[]>;
}

/** Loads + tracks a list of resources, with a `reload` to refresh after writes. */
export function useResource<T>(api: ListApi<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .listAll()
      .then(setItems)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [api]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, reload };
}

export function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong";
}
