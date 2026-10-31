'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppShell,
  Breadcrumb,
  Container,
  ErrorState,
  LoadingScreen,
  SchoolLogo,
  Sidebar,
  Text,
  ThemeToggle,
} from '@paideon/ui';

import { CurrentUserProvider } from '@/hooks/useCurrentUser';
import { ApiError, fetchCurrentUser, type CurrentUser } from '@/lib/api';
import { breadcrumbsFor } from '@/lib/breadcrumbs';
import { navFor } from '@/lib/nav';
import { ROUTES } from '@/lib/routes';

import { UserMenu } from './UserMenu';

/**
 * The signed-in frame. Asks the API who the person is, then renders the
 * shell. A missing session is handled by apiFetch (it sends them to /login
 * with ?next=), so here we only deal with "still loading" and "server problem".
 */
export function AppFrame({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    fetchCurrentUser()
      .then(setUser)
      .catch((cause: unknown) => {
        if (cause instanceof ApiError && cause.status === 401) return; // redirecting
        if (cause instanceof ApiError && cause.status === 503) {
          router.replace(ROUTES.maintenance);
          return;
        }
        setFailed(true);
      });
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  if (failed) {
    return (
      <div className="mx-auto max-w-prose p-space-6">
        <ErrorState
          variant="section"
          message="We could not load your account. Check your connection and try again."
          onRetry={load}
        />
      </div>
    );
  }

  if (!user) return <LoadingScreen />;

  const { groups } = navFor(user);

  return (
    <CurrentUserProvider user={user}>
      <AppShell
        sidebar={({ onNavigate }) => (
          <Sidebar
            groups={groups}
            onNavigate={onNavigate}
            brand={
              <>
                <div className="w-size-10">
                  <SchoolLogo variant="crest-only" />
                </div>
                <span className="font-display text-h5">Paideon</span>
              </>
            }
          />
        )}
        topbarStart={<Breadcrumb items={breadcrumbsFor(pathname)} />}
        topbarEnd={
          <>
            <ThemeToggle />
            <UserMenu />
          </>
        }
      >
        <Container size="lg" padding="sm">
          {children}
          <footer className="mt-space-12 border-t border-border-light pt-space-4">
            <Text variant="body-sm" color="muted">
              <Link href={ROUTES.privacy} className="underline">
                Privacy notice
              </Link>
            </Text>
          </footer>
        </Container>
      </AppShell>
    </CurrentUserProvider>
  );
}
