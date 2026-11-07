import { PeopleOverview } from '@/components/people/PeopleOverview';
import { RequireCapability } from '@/components/common/RequireCapability';

export const metadata = { title: 'People · Paideon' };

export default function PeoplePage() {
  return (
    <RequireCapability capability="people.read">
      <PeopleOverview />
    </RequireCapability>
  );
}
