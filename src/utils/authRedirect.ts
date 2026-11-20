export const getSafeRedirect = (value: string | null, fallback = "/") => {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.startsWith("/sign-in") || value.startsWith("/sign-up")) {
    return fallback;
  }
  return value;
};

export const withQueryParam = (url: string, key: string, value: string) => {
  const u = new URL(url, window.location.origin);
  u.searchParams.set(key, value);
  return `${u.pathname}${u.search}${u.hash}`;
};
