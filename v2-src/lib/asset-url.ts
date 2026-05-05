const base = process.env.NEXT_PUBLIC_ASSET_BASE ?? '';

export function assetUrl(path: string): string {
  return `${base}${path}`;
}
