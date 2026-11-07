import {
  STUDENT_STATUS_LABELS,
  type StudentStatusEnumData,
} from '@paideon/contracts';
import { Badge } from '@paideon/ui';

const STYLES: Record<StudentStatusEnumData, string> = {
  ACTIVE: 'bg-semantic-success-surface text-semantic-success-base',
  TRANSFERRED_OUT: 'bg-semantic-warning-surface text-semantic-warning-base',
  LEFT: 'bg-surface-default text-text-muted',
  GRADUATED: 'bg-semantic-info-surface text-semantic-info-base',
};

export function StudentStatusBadge({
  status,
}: {
  status: StudentStatusEnumData;
}) {
  return (
    <Badge
      variant="category"
      label={STUDENT_STATUS_LABELS[status]}
      className={STYLES[status]}
    />
  );
}
