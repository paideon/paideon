import { Alert, Container, Heading, InlineLink, Text } from '@paideon/ui';

import {
  PRIVACY_INTRO,
  PRIVACY_NOTICE_STATUS,
  PRIVACY_SECTIONS,
} from '@/content/privacy';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Privacy notice · Paideon' };

// Public information page. Linked from the landing page, the login page and
// the footer of every signed-in page.
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface-default">
      <Container size="sm">
        <div className="flex flex-col gap-space-8">
          <header className="flex flex-col gap-space-3">
            <InlineLink href={ROUTES.landing}>Paideon</InlineLink>
            <Heading as="h1" level="h1">
              Privacy notice
            </Heading>
            <Text color="muted">{PRIVACY_INTRO}</Text>
          </header>

          {PRIVACY_NOTICE_STATUS === 'draft' && (
            <Alert variant="warning" title="Draft">
              This notice has not yet been approved by the school.
            </Alert>
          )}

          {PRIVACY_SECTIONS.map((section) => (
            <section
              key={section.id}
              aria-labelledby={section.id}
              className="flex flex-col gap-space-3"
            >
              <Heading as="h2" level="h3" id={section.id}>
                {section.heading}
              </Heading>
              {section.paragraphs.map((paragraph) => (
                <Text key={paragraph}>{paragraph}</Text>
              ))}
            </section>
          ))}

          <footer>
            <Text variant="body-sm">
              <InlineLink href={ROUTES.login}>Back to log in</InlineLink>
            </Text>
          </footer>
        </div>
      </Container>
    </main>
  );
}
