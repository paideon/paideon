import { RequireCapability } from '@/components/common/RequireCapability';
import { StudentPhoto } from '@/components/people/StudentPhoto';

export const metadata = { title: 'Student photo · Paideon' };

export default async function StudentPhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RequireCapability capability="people.write">
      <StudentPhoto id={id} />
    </RequireCapability>
  );
}
