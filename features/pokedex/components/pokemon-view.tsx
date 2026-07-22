"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"

import { PokemonDetailCard } from "@/features/pokedex/components/detail/pokemon-detail-card"
import { PokemonList } from "@/features/pokedex/components/list/pokemon-list"
import {
  fetchAllPokemonsOptions,
  fetchPokemonOptions,
} from "@/features/pokedex/lib/pokemon.queries"
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

/** Main pokédex view: search form, search results, and paginated pokemon list */
export function PokemonView() {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  const form = useForm<SearchPokemonInput>({
    resolver: zodResolver(searchPokemonSchema),
    defaultValues: { query: "" },
  })

  const {
    data: pokemon,
    isFetching,
    isError,
    error,
    isSuccess: searchSuccess,
  } = useQuery(fetchPokemonOptions(query))

  const { data: paginatedList, isFetching: isListFetching } = useQuery(
    fetchAllPokemonsOptions(page, pageSize)
  )

  /** Handles valid form submission by setting the search query */
  function onSubmit(data: SearchPokemonInput) {
    setQuery(data.query)
  }

  /** Resets the search form and clears results */
  function handleClear() {
    form.reset()
    setQuery("")
  }

  const showSearchResult = query.length > 0

  return (
    <div className="flex w-full items-start gap-8">
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
                      aria-invalid={fieldState.invalid}
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
        <CardFooter>
          {showSearchResult ? (
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          ) : null}
          <Button type="submit" form="pokemon-search-form" disabled={isFetching}>
            {isFetching && <Spinner />}
            Search
          </Button>
        </CardFooter>
      </Card>

      <div className="min-w-0 flex-1">
        {showSearchResult ? (
          <>
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
            {searchSuccess && pokemon && <PokemonDetailCard pokemon={pokemon} />}
          </>
        ) : (
          <PokemonList
            pokemon={paginatedList?.items}
            isLoading={isListFetching}
            page={page}
            totalPages={paginatedList?.totalPages ?? 1}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  )
}
