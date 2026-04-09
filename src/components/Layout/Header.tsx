import { ThemeToggle } from '../ThemeToggle/ThemeToggle.tsx';
import './Header.css';

interface HeaderProps {
  onAddTask: () => void;
}

export function Header({ onAddTask }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__title">Task Management Dashboard</h1>
        <div className="header__actions">
          <button className="btn btn--primary" onClick={onAddTask}>
            + Add Task
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
