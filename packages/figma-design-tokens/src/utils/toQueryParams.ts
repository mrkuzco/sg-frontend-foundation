export function toQueryParams(x: object): string {
  if (!x) return '';
  return Object.entries(x)
    .map(([k, v]) => k && v && `${k}=${encodeURIComponent(v as string)}`)
    .filter(Boolean)
    .join('&');
}
