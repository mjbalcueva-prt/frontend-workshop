import type { Pokemon, PokemonListItem } from "@/features/pokedex/lib/pokemon.schema"

/** Fetches a single pokemon by name or ID from the PokéAPI */
export async function fetchPokemon(nameOrId: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nameOrId)}`)

  if (response.status === 404) throw new Error(`Pokémon "${nameOrId}" not found`)
  if (!response.ok) throw new Error("Failed to fetch Pokémon data")

  return response.json() as Promise<Pokemon>
}

interface PokéAPIListResponse {
  results: { name: string; url: string }[]
}

/** Extracts the numeric pokemon ID from a PokéAPI URL, e.g. "pokemon/25/" → 25 */
export function extractId(url: string): number {
  const parts = url.replace(/\/$/, "").split("/")
  return Number(parts[parts.length - 1])
}

/** Fetches the full list of original 151 pokemon */
export async function fetchAllPokemonList(): Promise<PokemonListItem[]> {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")

  if (!response.ok) throw new Error("Failed to fetch Pokémon list")

  const data = (await response.json()) as PokéAPIListResponse

  return data.results.map(p => ({
    name: p.name,
    id: extractId(p.url),
  }))
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
