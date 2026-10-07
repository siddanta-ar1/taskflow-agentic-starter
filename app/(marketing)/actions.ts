"use server"
import { headers } from "next/headers"
import { z } from "zod"
import { Resend } from "resend"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { isRateLimited } from "@/lib/ratelimit"
import WelcomeEmail from "@/emails/welcome"

const resend = new Resend(process.env.RESEND_API_KEY)

const Schema = z.object({
  email: z.email(),
  token: z.string().min(1),
})

async function verifyTurnstile(token: string, ip: string) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token, remoteip: ip }),
  })
  const data = (await res.json()) as { success: boolean }
  return data.success
}

export type WaitlistState = { ok?: true; error?: string } | null

export async function joinWaitlist(_: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0] ?? "unknown"
  if (await isRateLimited(`waitlist:${ip}`)) return { error: "Too many attempts, try again in a minute." }

  const parsed = Schema.safeParse({
    email: formData.get("email"),
    token: formData.get("cf-turnstile-response"),
  })
  if (!parsed.success) return { error: "Please enter a valid email." }

  if (!(await verifyTurnstile(parsed.data.token, ip))) return { error: "Bot check failed, try again." }

  const { error } = await supabaseAdmin.from("waitlist").insert({ email: parsed.data.email })
  if (error?.code === "23505") return { ok: true } // already on the list: same response
  if (error) return { error: "Something went wrong." }

  const { error: mailError } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: parsed.data.email,
    subject: "You're on the TaskFlow waitlist",
    react: WelcomeEmail({ email: parsed.data.email }),
  })
  if (mailError) console.error("welcome email failed", mailError)
  return { ok: true }
}
