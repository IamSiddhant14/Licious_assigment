import { useState } from 'react';
import type { Task, Priority, Status } from './types/task.ts';
import { TaskProvider, useTaskContext } from './context/TaskContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { useTasks } from './hooks/useTasks.ts';
import { Header } from './components/Layout/Header.tsx';
import { TaskStats } from './components/TaskStats/TaskStats.tsx';
import { SearchBar } from './components/SearchBar/SearchBar.tsx';
import { FilterBar } from './components/FilterBar/FilterBar.tsx';
import { TaskList } from './components/TaskList/TaskList.tsx';
import { TaskForm } from './components/TaskForm/TaskForm.tsx';
import { Modal } from './components/Modal/Modal.tsx';
import { ConfirmDialog } from './components/ConfirmDialog/ConfirmDialog.tsx';
import './App.css';

function Dashboard() {
  const ctx = useTaskContext();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { filtered } = useTasks({ search, status: statusFilter, priority: priorityFilter });

  const openCreate = () => { setEditing(undefined); setFormOpen(true); };
  const openEdit = (task: Task) => { setEditing(task); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(undefined); };

  const handleFormSubmit = (data: Omit<Task, 'id' | 'createdAt'>) => {
    if (editing) {
      ctx.editTask({ ...editing, ...data });
    } else {
      ctx.addTask(data);
    }
    closeForm();
  };

  const confirmDelete = () => {
    if (deletingId) {
      ctx.deleteTask(deletingId);
      setDeletingId(null);
    }
  };

  const deletingTask = ctx.tasks.find((t) => t.id === deletingId);

  return (
    <div className="app">
      <Header onAddTask={openCreate} />

      <main className="app-main">
        <TaskStats tasks={ctx.tasks} />

        <div className="toolbar">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar
            status={statusFilter}
            priority={priorityFilter}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
          />
        </div>

        <TaskList
          tasks={filtered}
          onToggle={ctx.toggleStatus}
          onEdit={openEdit}
          onDelete={(id: string) => setDeletingId(id)}
        />
      </main>

      <Modal open={formOpen} onClose={closeForm} title={editing ? 'Edit Task' : 'New Task'}>
        <TaskForm task={editing} onSubmit={handleFormSubmit} onCancel={closeForm} />
      </Modal>

      <Modal open={!!deletingId} onClose={() => setDeletingId(null)}>
        <ConfirmDialog
          title="Delete Task"
          message={`Are you sure you want to delete "${deletingTask?.title ?? ''}"? This can't be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Dashboard />
      </TaskProvider>
    </ThemeProvider>
  );
}
