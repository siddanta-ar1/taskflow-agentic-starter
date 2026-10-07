"use client"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendMagicLink } from "./actions"

export default function LoginPage() {
  const [state, action, pending] = useActionState(sendMagicLink, null)
  return (
    <main className="mx-auto mt-24 max-w-sm space-y-4 p-6">
      <h1 className="text-2xl font-bold">Sign in to TaskFlow</h1>
      {state?.ok ? (
        <p>Check your email for a sign-in link ✉️</p>
      ) : (
        <form action={action} className="space-y-3">
          <Input name="email" type="email" required placeholder="you@company.com" />
          <Button disabled={pending} className="w-full">
            {pending ? "Sending…" : "Send magic link"}
          </Button>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        </form>
      )}
    </main>
  )
}
