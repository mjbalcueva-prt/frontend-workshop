import type { Pokemon, PokemonListItem } from "@/features/pokedex/lib/pokemon.schema"
import { extractId } from "@/features/pokedex/utils/pokemon.url"

/** Fetches a single pokemon by name or ID from the PokéAPI */
export async function fetchPokemon(nameOrId: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nameOrId)}`)

  if (response.status === 404) throw new Error(`Pokémon "${nameOrId}" not found`)
  if (!response.ok) throw new Error("Failed to fetch Pokémon data")

  return response.json() as Promise<Pokemon>
}

// --- Paginated list ---

/** A page of pokemon list results */
export interface PaginatedPokemonList {
  items: PokemonListItem[]
  total: number
  page: number
  totalPages: number
}

interface PokéAPIPaginatedResponse {
  count: number
  results: { name: string; url: string }[]
}

/** Fetches a paginated list of pokemon from the PokéAPI */
export async function fetchAllPokemons(page: number, limit: number): Promise<PaginatedPokemonList> {
  const offset = (page - 1) * limit
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)

  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list")
  }

  const data = (await response.json()) as PokéAPIPaginatedResponse

  return {
    items: data.results.map(p => ({
      name: p.name,
      id: extractId(p.url),
    })),
    total: data.count,
    page,
    totalPages: Math.ceil(data.count / limit),
  }
}
