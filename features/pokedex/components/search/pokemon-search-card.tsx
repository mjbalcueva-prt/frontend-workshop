"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"

import { fetchPokemonOptions } from "@/features/pokedex/lib/pokemon.query"
import { searchPokemonSchema, type SearchPokemonInput } from "@/features/pokedex/lib/pokemon.schema"

import { Button } from "@/core/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/core/components/ui/field"
import { Input } from "@/core/components/ui/input"
import { Spinner } from "@/core/components/ui/spinner"

/** Search form card for finding a pokemon by name or ID */
export function PokemonSearchCard({
  query,
  showClear,
  onSearch,
  onClear,
}: {
  query: string
  showClear: boolean
  onSearch: (query: string) => void
  onClear: () => void
}) {
  const pokemonResult = useQuery(fetchPokemonOptions({ nameOrId: query }))

  const form = useForm<SearchPokemonInput>({
    resolver: zodResolver(searchPokemonSchema),
    defaultValues: {
      query: "",
    },
  })

  const onSubmit = (data: SearchPokemonInput) => {
    onSearch(data.query)
  }

  const handleClear = () => {
    form.reset()
    onClear()
  }

  return (
    <Card className="w-80 shrink-0">
      <CardHeader>
        <CardTitle>Pokédex</CardTitle>
        <CardDescription>Search for a Pokémon by name or ID.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="pokemon-search-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="query"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pokemon-search-input">Pokémon name or ID</FieldLabel>
                  <Input
                    {...field}
                    id="pokemon-search-input"
                    placeholder="e.g. pikachu or 25"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Enter a name or Pokédex number to find a Pokémon.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="gap-1.5">
        <Button type="submit" form="pokemon-search-form" disabled={pokemonResult.isFetching}>
          {pokemonResult.isFetching && <Spinner />}
          Search
        </Button>

        {showClear && (
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
