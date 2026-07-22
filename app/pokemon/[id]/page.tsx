import { PokemonDetailView } from "@/features/pokedex/components/detail/pokemon-detail-view"

export default function PokemonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-8">
        <PokemonDetailView id={params.then(page => page.id)} />
      </main>
    </div>
  )
}
