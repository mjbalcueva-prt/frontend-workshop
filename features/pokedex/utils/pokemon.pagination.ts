/** Builds page numbers with at most 5 visible buttons, ellipsis for gaps */
export function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = Array.from(pages)
    .filter(n => n >= 1 && n <= total)
    .sort((a, b) => a - b)

  const result: (number | "ellipsis")[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("ellipsis")
    result.push(sorted[i])
  }
  return result
}
