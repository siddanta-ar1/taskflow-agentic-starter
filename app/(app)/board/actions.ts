"use server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

const Status = z.enum(["backlog", "in_progress", "review", "done"])

export async function createTask(formData: FormData) {
  const input = z
    .object({ title: z.string().trim().min(1).max(200), workspaceId: z.uuid() })
    .parse({ title: formData.get("title"), workspaceId: formData.get("workspaceId") })

  const supabase = await createClient() // the USER's client: RLS decides access
  const { error } = await supabase
    .from("tasks")
    .insert({ title: input.title, workspace_id: input.workspaceId, position: Date.now() })
  if (error) throw new Error(error.message)
  revalidatePath("/board")
}

export async function moveTask(id: string, status: string, position: number) {
  const input = z
    .object({ id: z.uuid(), status: Status, position: z.number().finite() })
    .parse({ id, status, position })

  const supabase = await createClient()
  const { error } = await supabase
    .from("tasks")
    .update({ status: input.status, position: input.position, updated_at: new Date().toISOString() })
    .eq("id", input.id)
  if (error) throw new Error(error.message)
}
