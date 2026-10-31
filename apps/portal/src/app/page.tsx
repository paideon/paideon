import { ButtonLink, Heading, InlineLink, SchoolLogo, Text } from '@paideon/ui';

import { SessionRedirect } from '@/components/common/SessionRedirect';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Paideon' };

// Public landing page. Anyone can see it; someone who is already signed in
// is sent straight on to /home.
export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-surface-canopy p-space-6">
      <SessionRedirect to={ROUTES.home} />

      <div className="flex flex-1 flex-col items-center justify-center gap-space-6 text-center">
        <div className="w-40">
          <SchoolLogo variant="crest-only" />
        </div>
        <div className="flex flex-col gap-space-2">
          <Heading as="h1" level="h1">
            Paideon
          </Heading>
          <Text color="muted">C.W.W. Kannangara Central College</Text>
        </div>
        <Text className="max-w-prose">
          Your school&apos;s records, library and everyday tools in one place.
        </Text>
        <ButtonLink href={ROUTES.login} size="lg">
          Sign in
        </ButtonLink>
      </div>

      <footer>
        <Text variant="body-sm" color="muted">
          <InlineLink href={ROUTES.privacy}>Privacy notice</InlineLink>
        </Text>
      </footer>
    </main>
  );
}
