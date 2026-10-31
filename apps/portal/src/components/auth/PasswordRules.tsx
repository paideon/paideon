import { PASSWORD_RULES } from '@paideon/contracts';
import { Icon } from '@paideon/ui';

type Props = {
  password: string;
  /** When given, adds a "both passwords match" line. */
  confirm?: string;
};

/**
 * Live checklist under a new-password field. The rules come from the same
 * contract the API enforces, so what turns green here is what the server accepts.
 */
export function PasswordRules({ password, confirm }: Props) {
  const rules: { id: string; label: string; met: boolean }[] =
    PASSWORD_RULES.map((rule) => ({
      id: rule.id,
      label: rule.label,
      met: rule.test(password),
    }));
  if (confirm !== undefined) {
    rules.push({
      id: 'match',
      label: 'Both passwords match',
      met: password.length > 0 && password === confirm,
    });
  }

  return (
    <ul
      aria-label="Password requirements"
      className="m-space-0 flex list-none flex-col gap-space-1 p-space-0"
    >
      {rules.map((rule) => (
        <li
          key={rule.id}
          className={`flex items-center gap-space-2 text-body-sm ${
            rule.met ? 'text-semantic-success-base' : 'text-text-muted'
          }`}
        >
          <Icon
            name={rule.met ? 'check-circle' : 'minus'}
            size="xs"
            aria-hidden="true"
          />
          <span>{rule.label}</span>
          <span className="sr-only">
            {rule.met ? '(met)' : '(not met yet)'}
          </span>
        </li>
      ))}
    </ul>
  );
}
