import { useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext.tsx';
import type { Priority, Status } from '../types/task.ts';

interface UseTasksOptions {
  search?: string;
  status?: Status | 'all';
  priority?: Priority | 'all';
}

export function useTasks(opts: UseTasksOptions = {}) {
  const ctx = useTaskContext();
  const { search = '', status = 'all', priority = 'all' } = opts;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ctx.tasks
      .filter((t) => {
        if (status !== 'all' && t.status !== status) return false;
        if (priority !== 'all' && t.priority !== priority) return false;
        if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
        return true;
      })
  }, [ctx.tasks, search, status, priority]);

  return { ...ctx, filtered };
}
