"use client"

import { useState } from "react"

import { PokemonList } from "@/features/pokedex/components/list/pokemon-list"
import { PokemonSearchCard } from "@/features/pokedex/components/search/pokemon-search-card"
import { PokemonSearchResult } from "@/features/pokedex/components/search/pokemon-search-result"

/** Main pokédex view: search form, search results, and paginated pokemon list */
export function PokemonView() {
  const [query, setQuery] = useState("")

  const showSearchResult = query.length > 0

  return (
    <div className="flex w-full items-start gap-8">
      <PokemonSearchCard
        query={query}
        showClear={showSearchResult}
        onSearch={setQuery}
        onClear={() => setQuery("")}
      />

      <div className="min-w-0 flex-1">
        {showSearchResult ? <PokemonSearchResult query={query} /> : <PokemonList />}
      </div>
    </div>
  )
}
