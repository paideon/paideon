import { PageHeader } from '@paideon/ui';

import { MyLibrary } from '@/components/library/MyLibrary';

export const metadata = { title: 'My library · Paideon' };

export default function MyLibraryPage() {
  return (
    <>
      <PageHeader
        title="My library"
        description="Books you have borrowed, any fines, and your history."
      />
      <MyLibrary />
    </>
  );
}
