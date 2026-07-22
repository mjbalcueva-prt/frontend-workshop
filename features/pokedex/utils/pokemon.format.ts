/** Formats a pokemon ID as a zero-padded string, e.g. #001 */
export function padId(id: number): string {
  return `#${String(id).padStart(3, "0")}`
}

/** Converts height from decimeters to a human-readable string */
export function formatHeight(dm: number): string {
  return `${(dm / 10).toFixed(1)} m`
}

/** Converts weight from hectograms to a human-readable string */
export function formatWeight(hg: number): string {
  return `${(hg / 10).toFixed(1)} kg`
}
