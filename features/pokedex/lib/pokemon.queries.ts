import { queryOptions } from "@tanstack/react-query"

import { fetchAllPokemons, fetchPokemon } from "@/features/pokedex/lib/pokemon.api"

const fetchPokemonKey = ["pokemon", "detail"] as const
const fetchAllPokemonsKey = ["pokemon", "list"] as const

/** Query options for fetching a single pokemon */
export function fetchPokemonOptions(nameOrId: string) {
  return queryOptions({
    queryKey: [...fetchPokemonKey, nameOrId],
    queryFn: () => fetchPokemon(nameOrId),
    enabled: nameOrId.length > 0,
  })
}

/** Query options for fetching a paginated pokemon list */
export function fetchAllPokemonsOptions(page: number, limit: number = 20) {
  return queryOptions({
    queryKey: [...fetchAllPokemonsKey, { page, limit }],
    queryFn: () => fetchAllPokemons(page, limit),
  })
}
