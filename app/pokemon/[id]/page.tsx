import { PokemonDetailView } from "@/features/pokedex/components/detail/pokemon-detail-view"

interface PokemonDetailPageProps {
  params: Promise<{ id: string }>
}

export default function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-8">
        <PokemonDetailView id={params.then(p => p.id)} />
      </main>
    </div>
  )
}
