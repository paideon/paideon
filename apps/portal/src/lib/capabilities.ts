import type { CapabilityEnumData, CurrentUserData } from '@paideon/contracts';

/**
 * Does this person hold the capability?
 *
 * Without `scope` the question is "do they hold it anywhere?" (used to decide
 * whether to show a menu entry). With a scope it is "for this grade or class":
 * a SCHOOL grant covers everything, otherwise the scopes must match exactly.
 *
 * The portal only HIDES what the server would refuse; the API still checks.
 */
export function can(
  user: Pick<CurrentUserData, 'capabilities'>,
  capability: CapabilityEnumData,
  scope?: string,
): boolean {
  return user.capabilities.some(
    (grant) =>
      grant.capability === capability &&
      (scope === undefined ||
        grant.scope === 'SCHOOL' ||
        grant.scope === scope),
  );
}

export function canAny(
  user: Pick<CurrentUserData, 'capabilities'>,
  capabilities: readonly CapabilityEnumData[],
): boolean {
  return capabilities.some((capability) => can(user, capability));
}
