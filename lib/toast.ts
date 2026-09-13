import { toast } from "@aec-craft/ui/components/primitives/sonner";

/** Surface a failed mutation as a toast (load errors go in empty states). */
export function toastError(err: unknown, fallback = "Something went wrong.") {
  const message = err instanceof Error && err.message ? err.message : fallback;
  toast.error(message);
}
