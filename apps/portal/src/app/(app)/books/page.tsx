import { redirect } from 'next/navigation';

import { ROUTES } from '@/lib/routes';

// Book search moved to /library/catalog.
export default function OldBooksPage() {
  redirect(ROUTES.libraryCatalog);
}
