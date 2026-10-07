import { Body, Container, Heading, Html, Preview, Text } from "react-email"

export default function WelcomeEmail({ email = "you@example.com" }: { email?: string }) {
  return (
    <Html>
      <Preview>You&apos;re on the TaskFlow waitlist</Preview>
      <Body style={{ fontFamily: "sans-serif", background: "#f6f6fb" }}>
        <Container style={{ background: "#fff", padding: 32, borderRadius: 12 }}>
          <Heading>You&apos;re in 🎉</Heading>
          <Text>Thanks for joining the TaskFlow waitlist with {email}.</Text>
          <Text>We&apos;ll email you as soon as your workspace is ready.</Text>
        </Container>
      </Body>
    </Html>
  )
}
