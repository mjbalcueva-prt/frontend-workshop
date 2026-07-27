"use client"

import { useQuery } from "@tanstack/react-query"

import { PokemonDetailCard } from "@/features/pokedex/components/detail/pokemon-detail-card"
import { fetchPokemonOptions } from "@/features/pokedex/lib/pokemon.query"

import { Spinner } from "@/core/components/ui/spinner"

/** Renders the search result: loading spinner, error message, or the pokemon detail card */
export function PokemonSearchResult({ query }: { query: string }) {
  const pokemonResult = useQuery(fetchPokemonOptions({ nameOrId: query }))

  if (pokemonResult.isFetching) {
    return (
      <p className="text-muted-foreground flex items-center gap-2 text-sm">
        <Spinner /> Loading...
      </p>
    )
  }

  if (pokemonResult.isError) {
    return <p className="text-destructive text-sm">{pokemonResult.error.message}</p>
  }

  if (pokemonResult.data) {
    return <PokemonDetailCard pokemon={pokemonResult.data} />
  }

  return null
}
