import { Badge } from '@radix-ui/themes';
import { RunStatus } from '../../types/challenge';

const colorByStatus: Record<RunStatus, 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'orange'> = {
  idle: 'gray',
  running: 'blue',
  passed: 'green',
  partial: 'amber',
  runtime_error: 'red',
  timeout: 'orange',
  accepted: 'green',
};

export function StatusBadge({ status }: { status: RunStatus }) {
  return <Badge color={colorByStatus[status]}>{status.replace('_', ' ')}</Badge>;
}
