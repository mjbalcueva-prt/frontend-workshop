"use client"

import Link from "next/link"

import { useQuery } from "@tanstack/react-query"

import { PokemonDetailCard } from "@/features/pokedex/components/detail/pokemon-detail-card"
import { fetchPokemonOptions } from "@/features/pokedex/lib/pokemon.queries"

import { Button } from "@/core/components/ui/button"
import { Spinner } from "@/core/components/ui/spinner"

/** Detail page view for a single pokemon: back button, loading/error states, and detail card */
export function PokemonDetailView({ id }: { id: string }) {
  const { data: pokemon, isFetching, isError, error } = useQuery(fetchPokemonOptions(id))

  return (
    <div className="flex w-full flex-col gap-4">
      <Link href="/">
        <Button variant="outline" size="sm">
          ← Back to Pokédex
        </Button>
      </Link>

      {isFetching && (
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <Spinner /> Loading...
        </p>
      )}

      {isError && (
        <p className="text-destructive text-sm">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}

      {pokemon && <PokemonDetailCard pokemon={pokemon} />}
    </div>
  )
}
