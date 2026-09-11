export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  created_at?: string;
}

export interface TaskCounts {
  total: number;
  completed: number;
  left: number;
}

export interface TasksResponse {
  tasks: Task[];
  counts: TaskCounts;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: Priority;
}
