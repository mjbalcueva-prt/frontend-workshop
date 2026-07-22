import Image from "next/image"

import type { Pokemon } from "@/features/pokedex/lib/pokemon.schema"
import { formatHeight, formatWeight, padId } from "@/features/pokedex/utils/pokemon.format"

import { Badge } from "@/core/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"

/** Displays detailed information about a single pokemon */
export function PokemonDetailCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="capitalize">{pokemon.name}</CardTitle>
        <CardDescription>
          {padId(pokemon.id)} · Height: {formatHeight(pokemon.height)} · Weight:{" "}
          {formatWeight(pokemon.weight)}
        </CardDescription>
      </CardHeader>

      {pokemon.sprites.front_default && (
        <CardContent className="flex justify-center">
          <Image src={pokemon.sprites.front_default} alt={pokemon.name} width={120} height={120} />
        </CardContent>
      )}

      <CardFooter className="flex-wrap gap-1.5">
        {pokemon.types.map(t => (
          <Badge key={t.slot} variant="secondary" className="capitalize">
            {t.type.name}
          </Badge>
        ))}
        {pokemon.types.length === 0 && (
          <span className="text-muted-foreground text-xs">No types</span>
        )}
      </CardFooter>
    </Card>
  )
}
