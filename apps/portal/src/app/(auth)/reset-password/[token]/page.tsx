import { AuthShell, InlineLink, Text } from '@paideon/ui';

import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: 'Choose a new password · Paideon',
  referrer: 'no-referrer',
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Your old password will stop working."
      tagline="C.W.W. Kannangara Central College"
      footer={
        <Text variant="body-sm">
          <InlineLink href={ROUTES.login}>Back to log in</InlineLink>
        </Text>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
