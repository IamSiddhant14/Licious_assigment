import { ThemeToggle } from '../ThemeToggle/ThemeToggle.tsx';
import './Header.css';

interface HeaderProps {
  onAddTask: () => void;
}

export function Header({ onAddTask }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="header-title">Task Management Dashboard</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={onAddTask}>
            + Add Task
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
