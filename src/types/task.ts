export type Priority = 'low' | 'medium' | 'high';

export type Status = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: Status;
  createdAt: string;
}
