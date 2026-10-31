import { AuthShell, InlineLink, Text } from '@paideon/ui';

import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Forgot password · Paideon' };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your school email and we'll send you a link to choose a new one."
      tagline="C.W.W. Kannangara Central College"
      footer={
        <Text variant="body-sm">
          <InlineLink href={ROUTES.login}>Back to log in</InlineLink>
        </Text>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
