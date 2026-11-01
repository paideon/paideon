import { PageHeader } from '@paideon/ui';

import { ChangePasswordForm } from '@/components/me/ChangePasswordForm';
import { SessionsList } from '@/components/me/SessionsList';

export const metadata = { title: 'Security · Paideon' };

export default function SecurityPage() {
  return (
    <>
      <PageHeader
        title="Security"
        description="Change your password and see where you are signed in."
      />
      <ChangePasswordForm />
      <SessionsList />
    </>
  );
}
