/** Extracts the numeric pokemon ID from a PokéAPI URL, e.g. "pokemon/25/" → 25 */
export function extractId(url: string): number {
  const parts = url.replace(/\/$/, "").split("/")
  return Number(parts[parts.length - 1])
}
