export function toMediaProxyUrl(urlOrKey?: string | null): string | null {
  if (!urlOrKey) return null;

  const storageBase = process.env.NEXT_PUBLIC_STORAGE_BASE_URL?.replace(
    /\/$/,
    "",
  );
  const proxyBase =
    process.env.NEXT_PUBLIC_MEDIA_PROXY_BASE?.replace(/\/$/, "") ||
    "/api/media";

  if (storageBase && urlOrKey.startsWith(storageBase)) {
    const rest = urlOrKey.slice(storageBase.length).replace(/^\/+/, "");
    return `${proxyBase}/${rest}`;
  }

  if (!/^https?:\/\//i.test(urlOrKey)) {
    return `${proxyBase}/${urlOrKey.replace(/^\/+/, "")}`;
  }

  return urlOrKey;
}
