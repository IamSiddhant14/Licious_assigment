import type { Priority, Status } from '../../types/task.ts';
import './FilterBar.css';

interface FilterBarProps {
  status: Status | 'all';
  priority: Priority | 'all';
  onStatusChange: (s: Status | 'all') => void;
  onPriorityChange: (p: Priority | 'all') => void;
}

export function FilterBar({ status, priority, onStatusChange, onPriorityChange }: FilterBarProps) {
  const active = status !== 'all' || priority !== 'all';

  return (
    <div className="filter-bar">
      <div className="filter-bar__group">
        <label htmlFor="fb-status" className="filter-bar__label">Status</label>
        <select
          id="fb-status"
          className="filter-bar__select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as Status | 'all')}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-bar__group">
        <label htmlFor="fb-priority" className="filter-bar__label">Priority</label>
        <select
          id="fb-priority"
          className="filter-bar__select"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {active && (
        <button
          className="filter-bar__clear"
          onClick={() => { onStatusChange('all'); onPriorityChange('all'); }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
