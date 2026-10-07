import "server-only"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Uses the SECRET key: bypasses RLS. Only import from server code.
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)
