import { PokemonItem } from "@/features/pokedex/components/list/pokemon-item"
import type { PokemonListItem } from "@/features/pokedex/lib/pokemon.schema"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/core/components/ui/pagination"
import { Spinner } from "@/core/components/ui/spinner"

/** Builds page numbers with at most 5 visible buttons, ellipsis for gaps */
function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
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

interface PokemonListProps {
  pokemon: PokemonListItem[] | undefined
  isLoading: boolean
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

/** Renders a paginated list of pokemon items with loading and empty states */
export function PokemonList({
  pokemon,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: PokemonListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-8">
        <Spinner />
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    )
  }

  if (!pokemon || pokemon.length === 0) {
    return <p className="text-muted-foreground py-8 text-sm">No Pokémon to display</p>
  }

  const canPrev = page > 1
  const canNext = page < totalPages
  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {pokemon.map(p => (
          <PokemonItem key={p.id} pokemon={p} />
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={canPrev ? () => onPageChange(page - 1) : undefined}
              aria-disabled={!canPrev}
            />
          </PaginationItem>
          {pageNumbers.map((p, i) =>
            p === "ellipsis" ? (
              <PaginationEllipsis key={`e-${i}`} />
            ) : (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === page} onClick={() => onPageChange(p)}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={canNext ? () => onPageChange(page + 1) : undefined}
              aria-disabled={!canNext}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
