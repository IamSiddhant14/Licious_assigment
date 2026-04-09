import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../types/task.ts';

const STORAGE_KEY = 'tasks';

type TaskAction = { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'EDIT_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_STATUS'; payload: string };

interface TaskState {
  tasks: Task[];
  loaded: boolean;
}

const initialState: TaskState = {
  tasks: [],
  loaded: false,
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loaded: true };

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case 'TOGGLE_STATUS':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? { ...t, status: t.status === 'pending' ? 'completed' as const : 'pending' as const }
            : t,
        ),
      };

    default:
      return state;
  }
}

interface TaskContextValue {
  tasks: Task[];
  loaded: boolean;
  addTask: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  editTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleStatus: (id: string) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Task[];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_TASKS', payload: loadTasks() });
  }, []);

  useEffect(() => {
    if (state.loaded) {
      saveTasks(state.tasks);
    }
  }, [state.tasks, state.loaded]);

  const addTask = (data: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const editTask = (task: Task) => {
    dispatch({ type: 'EDIT_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const toggleStatus = (id: string) => {
    dispatch({ type: 'TOGGLE_STATUS', payload: id });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        loaded: state.loaded,
        addTask,
        editTask,
        deleteTask,
        toggleStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTaskContext must be used inside <TaskProvider>');
  }
  return ctx;
}
