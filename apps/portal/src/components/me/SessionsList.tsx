'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionsSchema } from '@paideon/contracts';
import {
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  ErrorState,
  FormSectionWrapper,
} from '@paideon/ui';

import { useApiResource } from '@/hooks/useApiResource';
import { apiFetch, clearAccessToken } from '@/lib/api';
import { describeDevice, formatDateTime } from '@/lib/format';
import { ROUTES } from '@/lib/routes';

type Row = {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  current: boolean;
};

export function SessionsList() {
  const router = useRouter();
  const { data, error, loading, reload } = useApiResource(
    '/auth/sessions',
    SessionsSchema,
  );
  const [confirming, setConfirming] = useState(false);

  const rows: Row[] = (data ?? []).map((session) => ({
    id: session.id,
    device: describeDevice(session.userAgent),
    ip: session.ipAddress ?? '—',
    lastActive: formatDateTime(session.lastActiveAt),
    current: session.current,
  }));

  async function signOutEverywhere() {
    await apiFetch('/auth/sessions', { method: 'DELETE' });
    // The server ended every session, this one included.
    clearAccessToken();
    router.replace(ROUTES.login);
  }

  return (
    <FormSectionWrapper
      title="Where you are signed in"
      description="Each line is a browser or device that is signed in to your account. “Last active” is when it last renewed its sign-in."
    >
      {error && !data ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <DataTable<Row>
          getRowKey={(row) => row.id}
          isLoading={loading && !data}
          emptyMessage="No active sessions."
          data={rows}
          columns={[
            {
              key: 'device',
              header: 'Device',
              render: (value, row) => (
                <span className="inline-flex flex-wrap items-center gap-space-2">
                  {String(value)}
                  {row.current && (
                    <Badge variant="category" label="This device" />
                  )}
                </span>
              ),
            },
            { key: 'ip', header: 'Address' },
            { key: 'lastActive', header: 'Last active' },
          ]}
        />
      )}
      <div>
        <Button variant="destructive" onClick={() => setConfirming(true)}>
          Sign out everywhere
        </Button>
      </div>
      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Sign out everywhere?"
        description="Every browser and device, including this one, will be signed out. You will need to log in again."
        confirmLabel="Sign out everywhere"
        destructive
        onConfirm={signOutEverywhere}
        errorMessage={() => 'Could not sign out. Try again.'}
      />
    </FormSectionWrapper>
  );
}
