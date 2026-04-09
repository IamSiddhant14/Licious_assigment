import { useTheme } from '../../context/ThemeContext.tsx';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()!;

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
