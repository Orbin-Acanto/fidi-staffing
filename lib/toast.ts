import { toast } from "react-toastify";
import { getErrorMessage } from "./errors";
import { ApiError, AuthError } from "./apiFetch";

function extractMessages(errors: any): string[] {
  if (!errors || typeof errors !== "object") return [];

  const msgs: string[] = [];
  for (const val of Object.values(errors)) {
    if (Array.isArray(val)) {
      for (const m of val) if (typeof m === "string") msgs.push(m);
    } else if (typeof val === "string") {
      msgs.push(val);
    }
  }
  return msgs;
}

export function toastError(err: unknown, fallback = "Something went wrong.") {
  if (err instanceof AuthError) {
    return;
  }

  if (err instanceof ApiError) {
    const msgs = extractMessages(err.data?.errors);

    if (msgs.length) {
      msgs.forEach((m) => toast.error(m, { toastId: m }));
      return;
    }

    const msg = err.data?.message || err.message || fallback;
    toast.error(msg, { toastId: msg });
    return;
  }

  const msg = getErrorMessage(err) || fallback;
  toast.error(msg, { toastId: msg });
}

export function toastSuccess(message: string) {
  toast.success(message, { toastId: message });
}
