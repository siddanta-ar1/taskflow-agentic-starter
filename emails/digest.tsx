import { Body, Container, Heading, Html, Preview, Text } from "react-email"

export default function DigestEmail({ tasks = [{ title: "Example task" }] }: { tasks?: { title: string }[] }) {
  return (
    <Html>
      <Preview>{`${tasks.length} tasks shipped last week`}</Preview>
      <Body style={{ fontFamily: "sans-serif", background: "#f6f6fb" }}>
        <Container style={{ background: "#fff", padding: 32, borderRadius: 12 }}>
          <Heading>Last week in TaskFlow</Heading>
          {tasks.map((t, i) => (
            <Text key={i}>✅ {t.title}</Text>
          ))}
        </Container>
      </Body>
    </Html>
  )
}
