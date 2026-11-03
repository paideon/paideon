import Link from 'next/link';

import type { HomeTile } from '@/lib/nav';

// Shortcut cards. On /home they come from navFor(user).tiles; /library uses
// them for the librarian's tools. `label` names the group for screen readers.
export function HomeTiles({
  tiles,
  label = 'Your tools',
}: {
  tiles: HomeTile[];
  label?: string;
}) {
  return (
    <nav aria-label={label}>
      <ul className="m-space-0 grid list-none gap-space-3 p-space-0 sm:grid-cols-2">
        {tiles.map((tile) => (
          <li key={tile.href}>
            <Link
              href={tile.href}
              className="flex h-full flex-col gap-space-1 rounded-md border border-border-light bg-surface-elevated p-space-4 transition-colors duration-fast hover:border-gold-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-base"
            >
              <span className="font-body text-body font-semibold text-text-primary">
                {tile.label}
              </span>
              <span className="font-body text-body-sm text-text-muted">
                {tile.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
