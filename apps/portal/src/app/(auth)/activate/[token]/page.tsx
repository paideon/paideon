import { AuthShell } from '@paideon/ui';

import { ActivationConfirmForm } from '@/components/auth/ActivationConfirmForm';

export const metadata = {
  title: 'Activate your account · Paideon',
  // The token is in the URL: never let it leak through a Referer header.
  referrer: 'no-referrer',
};

export default async function ActivatePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <AuthShell
      title="Activate your account"
      subtitle="Choose a password to finish setting up your account."
      tagline="C.W.W. Kannangara Central College"
    >
      <ActivationConfirmForm token={token} />
    </AuthShell>
  );
}
