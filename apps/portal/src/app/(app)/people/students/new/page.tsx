import { RequireCapability } from '@/components/common/RequireCapability';
import { StudentForm } from '@/components/people/StudentForm';

export const metadata = { title: 'Add student · Paideon' };

export default function NewStudentPage() {
  return (
    <RequireCapability capability="people.write">
      <StudentForm mode="create" />
    </RequireCapability>
  );
}
