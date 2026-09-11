import axios from 'axios';
import { CreateTaskPayload, Task, TasksResponse } from '@/types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  async getTasks(): Promise<TasksResponse> {
    const response = await apiClient.get<TasksResponse>('/tasks');
    return response.data;
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', {
      title: payload.title,
      description: payload.description || '',
      priority: payload.priority || 'medium',
      completed: false,
    });
    return response.data;
  },

  async toggleTask(taskId: string): Promise<{ message: string; task?: Task }> {
    const response = await apiClient.put(`/tasks/${taskId}`);
    return response.data;
  },

  async deleteTask(taskId: string): Promise<{ message: string; id: string }> {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  },
};
