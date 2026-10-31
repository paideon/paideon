import { NotFoundPage } from '@paideon/ui';

import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Page not found · Paideon' };

export default function NotFound() {
  return (
    <NotFoundPage
      message="That page does not exist, or it has moved."
      ctaLabel="Go to Home"
      ctaHref={ROUTES.home}
      quickLinksIntro="Or go to"
      quickLinks={[
        { href: ROUTES.home, label: 'Home' },
        { href: ROUTES.login, label: 'Log in' },
      ]}
      footerText="C.W.W. Kannangara Central College"
    />
  );
}
