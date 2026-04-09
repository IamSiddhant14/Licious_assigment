import { useState, useEffect } from 'react';
import type { Task, Priority, Status } from '../../types/task.ts';
import './TaskForm.css';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

interface FormFields {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: Status;
}

const today = () => new Date().toISOString().split('T')[0];

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [fields, setFields] = useState<FormFields>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});

  useEffect(() => {
    if (task) {
      setFields({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate.split('T')[0],
        status: task.status,
      });
    }
  }, [task]);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!fields.title.trim()) next.title = 'Title is required';
    if (!fields.dueDate) {
      next.dueDate = 'Due date is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormFields]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: fields.title.trim(),
      description: fields.description.trim(),
      priority: fields.priority,
      dueDate: new Date(fields.dueDate + 'T23:59:59').toISOString(),
      status: fields.status,
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="tf-title" className="field__label">
          Title <span className="field__req">*</span>
        </label>
        <input
          id="tf-title"
          name="title"
          type="text"
          className={`field__input ${errors.title ? 'has-error' : ''}`}
          value={fields.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          maxLength={100}
          autoFocus
        />
        {errors.title && <span className="field__error">{errors.title}</span>}
      </div>

      <div className="field">
        <label htmlFor="tf-desc" className="field__label">Description</label>
        <textarea
          id="tf-desc"
          name="description"
          className="field__input field__textarea"
          value={fields.description}
          onChange={handleChange}
          placeholder="Add details (optional)"
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="tf-priority" className="field__label">Priority</label>
          <select
            id="tf-priority"
            name="priority"
            className="field__input"
            value={fields.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="tf-due" className="field__label">
            Due Date <span className="field__req">*</span>
          </label>
          <input
            id="tf-due"
            name="dueDate"
            type="date"
            className={`field__input ${errors.dueDate ? 'has-error' : ''}`}
            value={fields.dueDate}
            onChange={handleChange}
            min={today()}
          />
          {errors.dueDate && <span className="field__error">{errors.dueDate}</span>}
        </div>
      </div>

      {task && (
        <div className="field">
          <label htmlFor="tf-status" className="field__label">Status</label>
          <select
            id="tf-status"
            name="status"
            className="field__input"
            value={fields.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      <div className="task-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
