import Link from "next/link"

import { TodoView } from "@/features/todo/components/todo-view"

export default function TodoPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <main className="flex w-full max-w-5xl flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Pokédex
          </Link>
          <Link
            href="/todo"
            className="text-sm font-medium text-black underline underline-offset-4 dark:text-zinc-50"
          >
            Todos
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
            Todos
          </h1>
          <p className="text-muted-foreground text-sm">Keep track of what needs to get done.</p>
        </div>

        <TodoView />
      </main>
    </div>
  )
}
