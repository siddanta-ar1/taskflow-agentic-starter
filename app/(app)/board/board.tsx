"use client"
import { useEffect, useState } from "react"
import { DndContext, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { positionBetween } from "@/lib/position"
import type { Database } from "@/lib/database.types"
import { moveTask } from "./actions"

type Status = Database["public"]["Enums"]["task_status"]
type Task = Pick<Database["public"]["Tables"]["tasks"]["Row"], "id" | "title" | "status" | "position" | "workspace_id">
const COLUMNS: Status[] = ["backlog", "in_progress", "review", "done"]

export function Board({ workspaceId, initialTasks }: { workspaceId: string; initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)

  // Realtime: apply inserts/updates/deletes made by anyone in this workspace
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`tasks:${workspaceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `workspace_id=eq.${workspaceId}` },
        (payload) => {
          setTasks((prev) => {
            if (payload.eventType === "DELETE") return prev.filter((t) => t.id !== payload.old.id)
            const next = payload.new as Task
            return [...prev.filter((t) => t.id !== next.id), next]
          })
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  async function onDragEnd({ active, over }: DragEndEvent) {
    if (!over) return
    const status = over.id as Status
    const task = tasks.find((t) => t.id === active.id)
    if (!task || task.status === status) return

    // drop at the bottom of the target column
    const last = tasks.filter((t) => t.status === status).sort((a, b) => a.position - b.position).at(-1)
    const position = positionBetween(last?.position)

    const previous = tasks
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status, position } : t))) // optimistic
    try {
      await moveTask(task.id, status, position)
    } catch {
      setTasks(previous) // roll back
      toast.error("Couldn't move the task. Please try again.")
    }
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {COLUMNS.map((status) => (
          <Column key={status} status={status}>
            {tasks
              .filter((t) => t.status === status)
              .sort((a, b) => a.position - b.position)
              .map((t) => (
                <Card key={t.id} task={t} />
              ))}
          </Column>
        ))}
      </div>
    </DndContext>
  )
}

function Column({ status, children }: { status: Status; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <section ref={setNodeRef} className={`min-h-40 rounded-xl p-3 ${isOver ? "bg-indigo-50" : "bg-slate-50"}`}>
      <h2 className="mb-2 text-sm font-semibold capitalize">{status.replace("_", " ")}</h2>
      {children}
    </section>
  )
}

function Card({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id })
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined
  return (
    <article ref={setNodeRef} style={style} {...listeners} {...attributes}
      className="mb-2 cursor-grab rounded-lg bg-white p-3 shadow-sm">
      {task.title}
    </article>
  )
}
