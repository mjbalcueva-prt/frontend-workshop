import { z } from "zod"

/** Zod schema for the pokemon search form */
export const searchPokemonSchema = z.object({
  query: z
    .string()
    .min(1, "Enter a Pokémon name or ID")
    .transform(v => v.trim().toLowerCase()),
})

/** A pokemon's type (e.g. fire, water) */
export const pokemonTypeSchema = z.object({
  slot: z.number(),
  type: z.object({ name: z.string(), url: z.string() }),
})

/** Pokemon sprite image URLs */
export const pokemonSpritesSchema = z.object({
  front_default: z.string().nullable(),
})

/** Full pokemon detail from the PokéAPI */
export const pokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  sprites: pokemonSpritesSchema,
  types: z.array(pokemonTypeSchema),
})

/** Lightweight pokemon reference used in list views */
export const pokemonListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export type SearchPokemonInput = z.infer<typeof searchPokemonSchema>
export type PokemonType = z.infer<typeof pokemonTypeSchema>
export type PokemonSprites = z.infer<typeof pokemonSpritesSchema>
export type Pokemon = z.infer<typeof pokemonSchema>
export type PokemonListItem = z.infer<typeof pokemonListItemSchema>
