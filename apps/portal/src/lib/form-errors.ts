/** Turns schema issues into { fieldName: firstMessage } for the form fields. */
export function fieldErrors(
  issues: { path: (string | number)[]; message: string }[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? '_form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Like fieldErrors, but a nested field keeps its whole path:
 * address.line1, guardians.0.phone. The first message per path is kept.
 */
export function fieldErrorsByPath(
  issues: { path: (string | number)[]; message: string }[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.length > 0 ? issue.path.join('.') : '_form';
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
