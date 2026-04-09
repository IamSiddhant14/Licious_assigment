import type { Task } from '../../types/task.ts';
import './TaskStats.css';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;


  return (
    <div className="task-stats">
      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-card__value">{total}</span>
          <span>Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{pending}</span>
          <span>Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{completed}</span>
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
}
