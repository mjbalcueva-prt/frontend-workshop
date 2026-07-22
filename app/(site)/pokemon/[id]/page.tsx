import { PokemonDetailView } from "@/features/pokedex/components/detail/pokemon-detail-view"

export default function PokemonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <PokemonDetailView id={params.then(page => page.id)} />
}
