import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Board } from "./board"
import { createTask } from "./actions"

// Cache Components is on by default in Next 16: anything that reads cookies
// (the signed-in user) must render inside <Suspense> so the page shell can
// still be prerendered and streamed instantly.
export default function BoardPage() {
  return (
    <main className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Board</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading your board…</p>}>
        <BoardContent />
      </Suspense>
    </main>
  )
}

async function BoardContent() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  if (!auth?.claims) redirect("/login")

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .limit(1)
    .maybeSingle()
  if (!membership) return <p>You&apos;re not in a workspace yet.</p>

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, status, position, workspace_id")
    .eq("workspace_id", membership.workspace_id)
    .order("position")

  return (
    <>
      <form action={createTask} className="flex gap-2">
        <input type="hidden" name="workspaceId" value={membership.workspace_id} />
        <input name="title" required placeholder="New task…" className="flex-1 rounded-md border px-3 py-2" />
        <button className="rounded-md bg-indigo-600 px-4 py-2 text-white">Add</button>
      </form>
      <Board workspaceId={membership.workspace_id} initialTasks={tasks ?? []} />
    </>
  )
}
