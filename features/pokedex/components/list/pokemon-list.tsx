import { PokemonItem } from "@/features/pokedex/components/list/pokemon-item"
import type { PokemonListItem } from "@/features/pokedex/lib/pokemon.schema"
import { getPageNumbers } from "@/features/pokedex/utils/pokemon.pagination"

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

/** Renders a paginated list of pokemon items with loading and empty states */
export function PokemonList({
  pokemon,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: {
  pokemon: PokemonListItem[] | undefined
  isLoading: boolean
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
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
            <PaginationPrevious onClick={canPrev ? () => onPageChange(page - 1) : undefined} />
          </PaginationItem>
          {pageNumbers.map((page, i) =>
            page === "ellipsis" ? (
              <PaginationEllipsis key={`e-${i}`} />
            ) : (
              <PaginationItem key={page}>
                <PaginationLink isActive={page === page} onClick={() => onPageChange(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext onClick={canNext ? () => onPageChange(page + 1) : undefined} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
