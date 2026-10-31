import { ButtonLink, Heading, SchoolLogo, Text } from '@paideon/ui';

import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Back soon · Paideon' };

// Shown when the API reports it is down for maintenance (503).
export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-space-6 bg-surface-canopy p-space-6 text-center">
      <div className="w-32">
        <SchoolLogo variant="crest-only" />
      </div>
      <Heading as="h1" level="h2">
        Paideon is being updated
      </Heading>
      <Text color="muted" className="max-w-prose">
        We are making improvements and will be back shortly. Nothing has been
        lost. Please try again in a few minutes.
      </Text>
      <ButtonLink href={ROUTES.home} variant="secondary">
        Try again
      </ButtonLink>
    </main>
  );
}
