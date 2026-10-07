// Normally generated: npx supabase gen types typescript --linked > lib/database.types.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      waitlist: {
        Row: { id: number; email: string; created_at: string }
        Insert: { id?: never; email: string; created_at?: string }
        Update: { id?: never; email?: string; created_at?: string }
        Relationships: []
      }
      workspaces: {
        Row: { id: string; name: string; created_at: string }
        Insert: { id?: string; name: string; created_at?: string }
        Update: { id?: string; name?: string; created_at?: string }
        Relationships: []
      }
      workspace_members: {
        Row: { workspace_id: string; user_id: string; role: string }
        Insert: { workspace_id: string; user_id: string; role?: string }
        Update: { workspace_id?: string; user_id?: string; role?: string }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string; workspace_id: string; title: string
          status: Database["public"]["Enums"]["task_status"]
          assignee_id: string | null; position: number; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; workspace_id: string; title: string
          status?: Database["public"]["Enums"]["task_status"]
          assignee_id?: string | null; position?: number; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; workspace_id?: string; title?: string
          status?: Database["public"]["Enums"]["task_status"]
          assignee_id?: string | null; position?: number; created_at?: string; updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { is_member: { Args: { ws: string }; Returns: boolean } }
    Enums: { task_status: "backlog" | "in_progress" | "review" | "done" }
    CompositeTypes: { [_ in never]: never }
  }
}
