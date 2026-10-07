import { Resend } from "resend"
import { supabaseAdmin } from "@/lib/supabase/admin"
import DigestEmail from "@/emails/digest"

export async function GET(request: Request) {
  // Vercel sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const [{ data: done }, { data: members }] = await Promise.all([
    supabaseAdmin.from("tasks").select("title, workspace_id").eq("status", "done").gte("updated_at", since),
    supabaseAdmin.from("workspace_members").select("workspace_id, user_id"),
  ])

  const emails = []
  for (const m of members ?? []) {
    const tasks = (done ?? []).filter((t) => t.workspace_id === m.workspace_id)
    if (tasks.length === 0) continue
    const { data } = await supabaseAdmin.auth.admin.getUserById(m.user_id)
    if (!data.user?.email) continue
    emails.push({
      from: process.env.EMAIL_FROM!,
      to: data.user.email,
      subject: `${tasks.length} tasks shipped last week`,
      react: DigestEmail({ tasks }),
    })
  }

  // Resend's batch endpoint accepts up to 100 emails per call
  const resend = new Resend(process.env.RESEND_API_KEY)
  for (let i = 0; i < emails.length; i += 100) {
    await resend.batch.send(emails.slice(i, i + 100))
  }
  return Response.json({ sent: emails.length })
}
