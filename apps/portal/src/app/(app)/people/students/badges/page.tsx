import { StudentBadgeView } from '@/components/people/StudentBadgeView';

export const metadata = { title: 'Print badges · Paideon' };

export default async function StudentBadgesPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string | string[] }>;
}) {
  const { ids } = await searchParams;
  const text = Array.isArray(ids) ? ids.join(',') : (ids ?? '');
  const list = text
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  return <StudentBadgeView ids={list} />;
}
