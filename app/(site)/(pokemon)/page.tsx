import { PokemonView } from "@/features/pokedex/components/pokemon-view"

export default function HomePage(props: PageProps<"/">) {
  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
          Pokédex
        </h1>
        <p className="text-muted-foreground text-sm">Search for a Pokémon by name or ID</p>
      </div>

      <PokemonView />
    </>
  )
}
