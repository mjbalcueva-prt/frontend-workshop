import Link from "next/link"

import type { PokemonListItem } from "@/features/pokedex/lib/pokemon.schema"
import { padId } from "@/features/pokedex/utils/pokemon.format"

import { Card, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card"

/** A single pokemon list item — a card linking to the detail page */
export function PokemonItem({ pokemon }: { pokemon: PokemonListItem }) {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{pokemon.name}</CardTitle>
          <CardDescription>{padId(pokemon.id)}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
