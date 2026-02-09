export function toMediaProxyUrl(urlOrKey?: string | null): string | null {
  if (!urlOrKey) return null;

  const proxyBase =
    process.env.NEXT_PUBLIC_MEDIA_API_ENDPOINT?.replace(/\/$/, "") ||
    "/api/media/public";

  if (urlOrKey.startsWith(proxyBase)) return urlOrKey;

  const normalizeKey = (rawPath: string) => {
    let p = rawPath.replace(/^\/+/, "");

    const idx = p.indexOf("/public/");
    if (idx >= 0) {
      p = p.slice(idx + "/public/".length);
    } else {
      p = p.replace(/^public\//, "");
    }

    return p;
  };

  if (/^https?:\/\//i.test(urlOrKey)) {
    try {
      const u = new URL(urlOrKey);
      const key = normalizeKey(u.pathname);
      return `${proxyBase}/${key}`;
    } catch {
      return null;
    }
  }

  const key = normalizeKey(urlOrKey);
  return `${proxyBase}/${key}`;
}
