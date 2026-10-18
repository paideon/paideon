import type { CurrentUser } from './api';

/** Everyone lands on /home. What they see there depends on what they can do. */
export function postLoginPath(_user: CurrentUser): string {
  return '/home';
}
