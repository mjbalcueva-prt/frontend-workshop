import { queryOptions } from "@tanstack/react-query"

import { fetchAllPokemons, fetchPokemon } from "@/features/pokedex/lib/pokemon.api"

export const fetchPokemonKey = ["pokemon", "detail"] as const
export const fetchAllPokemonsKey = ["pokemon", "list"] as const

/** Query options for fetching a single pokemon */
export function fetchPokemonOptions({ nameOrId }: { nameOrId: string }) {
  return queryOptions({
    queryKey: [...fetchPokemonKey, nameOrId],
    queryFn: () => fetchPokemon(nameOrId),
    enabled: nameOrId.length > 0,
  })
}

/** Query options for fetching a paginated pokemon list */
export function fetchAllPokemonsOptions({ page, limit = 20 }: { page: number; limit?: number }) {
  return queryOptions({
    queryKey: [...fetchAllPokemonsKey, { page, limit }],
    queryFn: () => fetchAllPokemons(page, limit),
  })
}
