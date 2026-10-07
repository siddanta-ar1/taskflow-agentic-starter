"use server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

export async function sendMagicLink(_: unknown, formData: FormData) {
  const email = z.email().safeParse(formData.get("email"))
  if (!email.success) return { error: "Please enter a valid email." }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
  })
  return error ? { error: error.message } : { ok: true }
}
