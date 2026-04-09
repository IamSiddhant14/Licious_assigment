import type { Task } from '../../types/task.ts';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const isOverdue = (t: Task) =>
  t.status === 'pending' && new Date(t.dueDate) < new Date(new Date().toDateString());

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const done = task.status === 'completed';
  const overdue = isOverdue(task);

  return (
    <div className={`task-item ${done ? 'is-done' : ''} ${overdue ? 'is-overdue' : ''}`}>
      <input
        type="checkbox"
        className="task-item-checkbox"
        checked={done}
        onChange={() => onToggle(task.id)}
      />

      <div className="task-item-body">
        <div className="task-item-top">
          <span className="task-item-title">{task.title}</span>
          <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
        </div>
        {task.description && <p className="task-item-desc">{task.description}</p>}
        <span className={`task-item-due ${overdue ? 'is-overdue' : ''}`}>Due {fmt(task.dueDate)}</span>
      </div>

      <div className="task-item-actions">
        <span className="icon-btn" onClick={() => onEdit(task)}>Edit</span>
        <span className="icon-btn" onClick={() => onDelete(task.id)}>Delete</span>
      </div>
    </div>
  );
}
