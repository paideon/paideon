import { Avatar } from '@paideon/ui';

type Props = {
  name: string;
  photoUrl: string | null;
  /** A second line under the name: an ID, a class, a post. */
  subtitle?: string;
};

// A person in a table row: small photo (or initials), name, and a quiet
// second line. The picture is decoration, so screen readers skip it.
export function PersonCell({ name, photoUrl, subtitle }: Props) {
  return (
    <span className="flex min-w-0 items-center gap-space-3">
      <span aria-hidden="true">
        <Avatar name={name} src={photoUrl} size="sm" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-text-primary">{name}</span>
        {subtitle && (
          <span className="truncate text-caption text-text-muted">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
