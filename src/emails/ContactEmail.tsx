import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "react-email";

type Props = {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
  ip?: string;
  userAgent?: string;
};

export function ContactEmail({ name, email, subject, message, locale, ip, userAgent }: Props) {
  return (
    <Html lang={locale}>
      <Head />
      <Preview>
        {subject} — {name}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>New contact message</Heading>

          <Section style={section}>
            <Text style={label}>From</Text>
            <Text style={value}>
              {name} &lt;{email}&gt;
            </Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Subject</Text>
            <Text style={value}>{subject}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={label}>Message</Text>
            <Text style={messageStyle}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={meta}>
            <Text style={metaText}>Locale: {locale}</Text>
            {ip ? <Text style={metaText}>IP: {ip}</Text> : null}
            {userAgent ? <Text style={metaText}>User-Agent: {userAgent}</Text> : null}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#0b0b14",
  color: "#e8e8f0",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  margin: 0,
  padding: "32px 0",
};

const container = {
  margin: "0 auto",
  padding: "24px",
  maxWidth: "560px",
  backgroundColor: "#13131e",
  borderRadius: "12px",
  border: "1px solid #2a2a3a",
};

const h1 = {
  color: "#a78bfa",
  fontSize: "20px",
  fontWeight: 600,
  margin: "0 0 16px 0",
};

const section = { margin: "12px 0" };

const label = {
  color: "#8b8ba7",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  margin: "0 0 4px 0",
};

const value = {
  color: "#e8e8f0",
  fontSize: "14px",
  margin: 0,
};

const messageStyle = {
  color: "#e8e8f0",
  fontSize: "14px",
  lineHeight: 1.6,
  whiteSpace: "pre-wrap" as const,
  margin: 0,
};

const hr = {
  borderColor: "#2a2a3a",
  margin: "16px 0",
};

const meta = { margin: "8px 0 0 0" };

const metaText = {
  color: "#6b6b85",
  fontSize: "11px",
  margin: "2px 0",
};
