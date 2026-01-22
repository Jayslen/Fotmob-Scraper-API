export function normalizeDbColumnName(key: string): string {
  return key
    .replace(/[-\s]/g, '_')
    .replaceAll('+', 'plus')
    .replace(/[()]/g, '')
    .toLowerCase()
}
