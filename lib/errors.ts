export function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;

  if (err && typeof err === "object") {
    const anyErr = err as any;
    if (typeof anyErr.message === "string") return anyErr.message;
    if (typeof anyErr.detail === "string") return anyErr.detail;

    if (typeof anyErr.statusText === "string" && anyErr.statusText)
      return anyErr.statusText;

    try {
      return JSON.stringify(err);
    } catch {
      return "Something went wrong.";
    }
  }

  return "Something went wrong.";
}
