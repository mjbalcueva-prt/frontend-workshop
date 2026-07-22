import { use } from "react"

import { PokemonDetailView } from "@/features/pokedex/components/detail/pokemon-detail-view"

export default function PokemonDetailPage(props: PageProps<"/pokemon/[id]">) {
  const { id } = use(props.params)

  return <PokemonDetailView id={id} />
}
