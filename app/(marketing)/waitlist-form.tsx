"use client"
import { useActionState } from "react"
import { Turnstile } from "@marsidev/react-turnstile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { joinWaitlist } from "./actions"

export function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, null)
  if (state?.ok) return <p className="text-indigo-600">Check your inbox ✉️</p>
  return (
    <form action={action} className="flex flex-col items-center gap-3">
      <div className="flex w-full max-w-md gap-2">
        <Input name="email" type="email" required placeholder="Enter your work email" />
        <Button disabled={pending}>{pending ? "Joining…" : "Join the waitlist"}</Button>
      </div>
      <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  )
}
