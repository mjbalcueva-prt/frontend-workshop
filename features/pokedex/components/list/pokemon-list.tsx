"use client"

import { useState } from "react"

import { useQuery } from "@tanstack/react-query"

import { PokemonItem } from "@/features/pokedex/components/list/pokemon-item"
import { fetchAllPokemonsOptions } from "@/features/pokedex/lib/pokemon.queries"
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

const pageSize = 10

/** Renders a paginated list of pokemon items with loading and empty states */
export function PokemonList() {
  const [page, setPage] = useState(1)

  const pokemonResult = useQuery(fetchAllPokemonsOptions({ page, limit: pageSize }))

  if (pokemonResult.isFetching) {
    return (
      <div className="flex items-center gap-2 py-8">
        <Spinner />
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    )
  }

  const data = pokemonResult.data
  if (!data || data.items.length === 0) {
    return <p className="text-muted-foreground py-8 text-sm">No Pokémon to display</p>
  }

  const canPrev = page > 1
  const canNext = page < data.totalPages
  const pageNumbers = getPageNumbers(page, data.totalPages)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {data.items.map(p => (
          <PokemonItem key={p.id} pokemon={p} />
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={canPrev ? () => setPage(page - 1) : undefined} />
          </PaginationItem>
          {pageNumbers.map((p, i) =>
            p === "ellipsis" ? (
              <PaginationEllipsis key={`e-${i}`} />
            ) : (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext onClick={canNext ? () => setPage(page + 1) : undefined} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
