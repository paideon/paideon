'use client';

import dynamic from 'next/dynamic';
import { MyProfileSchema } from '@paideon/contracts';

import { useApiResource } from '@/hooks/useApiResource';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { badgeDetails } from '@/lib/badge';

// three.js and the physics engine are big: only fetched when this renders.
const PaideonIdCard = dynamic(
  () =>
    import('@/components/id-card/PaideonIdCard').then((m) => m.PaideonIdCard),
  { ssr: false },
);

// The hanging 3D badge beside the greeting. Wide screens only: on phones the
// flat card on /account/badge is the better fit, and the 3D scene is heavy.
export function HomeBadge() {
  const wide = useMediaQuery('(min-width: 1024px)');
  const { data } = useApiResource(wide ? '/me/profile' : null, MyProfileSchema);

  if (!wide || !data) return null;
  const details = badgeDetails(data);

  return (
    <div aria-hidden="true">
      <PaideonIdCard
        height="520px"
        user={{
          firstName: data.firstName,
          lastName: data.lastName,
          paideonId: data.paideonId,
          cardNumber: data.cardNumber,
          kind: data.kind,
          currentGrade: data.grade ?? 0,
          admissionNumber: details.numberValue,
          photoUrl: data.photoUrl,
          detailLabel: details.detailLabel,
          detailValue: details.detailValue,
          numberLabel: details.numberLabel,
        }}
      />
    </div>
  );
}
