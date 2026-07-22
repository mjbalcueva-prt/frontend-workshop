"use client"

import Link from "next/link"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { PokemonDetailCard } from "@/features/pokedex/components/detail/pokemon-detail-card"
import { fetchPokemonOptions } from "@/features/pokedex/lib/pokemon.queries"
import type { Pokemon } from "@/features/pokedex/lib/pokemon.schema"

import { Button } from "@/core/components/ui/button"
import { Spinner } from "@/core/components/ui/spinner"

/** Detail page view for a single pokemon: back button, loading/error states, and detail card */
export function PokemonDetailView({ id }: { id: string }) {
  const pokemonResult = useQuery(fetchPokemonOptions({ nameOrId: id }))

  return (
    <div className="flex w-full flex-col gap-4">
      <Link href="/">
        <Button variant="outline" size="sm">
          ← Back to Pokédex
        </Button>
      </Link>

      <PokemonDetailBody pokemonResult={pokemonResult} />
    </div>
  )
}

/** Renders the query result body: loading spinner, error, or detail card */
function PokemonDetailBody({ pokemonResult }: { pokemonResult: UseQueryResult<Pokemon> }) {
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
