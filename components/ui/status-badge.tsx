import { RunStatus } from '@/types/challenge';
import clsx from 'clsx';

const styles: Record<RunStatus, string> = {
  idle: 'bg-slate-700/50 text-slate-200',
  running: 'bg-blue-500/20 text-blue-300',
  passed: 'bg-emerald-500/20 text-emerald-300',
  partial: 'bg-amber-500/20 text-amber-200',
  runtime_error: 'bg-rose-500/20 text-rose-300',
  timeout: 'bg-orange-500/20 text-orange-300',
  accepted: 'bg-emerald-500/25 text-emerald-200',
};

export function StatusBadge({ status }: { status: RunStatus }) {
  return (
    <span className={clsx('rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide', styles[status])}>
      {status.replace('_', ' ')}
    </span>
  );
}
