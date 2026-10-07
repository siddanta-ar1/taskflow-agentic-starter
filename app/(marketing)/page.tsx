import { WaitlistForm } from "./waitlist-form"

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight">Ship work, not status updates</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
        The collaborative task board for high-velocity teams.
      </p>
      <div className="mt-8">
        <WaitlistForm />
      </div>
    </main>
  )
}
