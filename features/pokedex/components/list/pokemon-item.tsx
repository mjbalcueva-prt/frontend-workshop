import Link from "next/link"

import type { PokemonListItem } from "@/features/pokedex/lib/pokemon.schema"

import { Card, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card"

interface PokemonItemProps {
  pokemon: PokemonListItem
}

/** Formats a pokemon ID as a zero-padded string, e.g. #001 */
function padId(id: number): string {
  return `#${String(id).padStart(3, "0")}`
}

/** A single pokemon list item — a card linking to the detail page */
export function PokemonItem({ pokemon }: PokemonItemProps) {
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
