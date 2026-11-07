import { RequireCapability } from '@/components/common/RequireCapability';
import { EditStudent } from '@/components/people/EditStudent';

export const metadata = { title: 'Edit student · Paideon' };

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RequireCapability capability="people.write">
      <EditStudent id={id} />
    </RequireCapability>
  );
}
