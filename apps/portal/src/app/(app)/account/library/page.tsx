import { redirect } from 'next/navigation';

import { ROUTES } from '@/lib/routes';

// My library moved to /library, where everyone's library page now lives.
export default function OldMyLibraryPage() {
  redirect(ROUTES.library);
}
