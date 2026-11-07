import { StudentBadgeView } from '@/components/people/StudentBadgeView';

export const metadata = { title: 'Student badge · Paideon' };

// The API decides who may print: people.read or library.members.read.
export default async function StudentBadgePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudentBadgeView ids={[id]} />;
}
