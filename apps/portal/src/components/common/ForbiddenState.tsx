import { ButtonLink, Heading, Text } from '@paideon/ui';

import { ROUTES } from '@/lib/routes';

export function ForbiddenState() {
  return (
    <div className="flex flex-col items-center gap-space-4 py-space-16 text-center">
      <Heading as="h1" level="h2">
        You don&apos;t have access to this page
      </Heading>
      <Text color="muted" className="max-w-prose">
        Your account is not set up to use this part of Paideon. If you think
        that is a mistake, ask the school office.
      </Text>
      <ButtonLink href={ROUTES.home} variant="primary">
        Back to Home
      </ButtonLink>
    </div>
  );
}
