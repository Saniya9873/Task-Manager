'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { api } from '@/services/api';
import { CreateTaskPayload, Task, TaskCounts } from '@/types/task';
import { TaskStats } from '@/components/TaskStats';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilter, FilterStatus } from '@/components/TaskFilter';
import { TaskItem } from '@/components/TaskItem';
import { CheckCircle2, AlertCircle, RefreshCw, Sparkles, Database, Layers } from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [counts, setCounts] = useState<TaskCounts>({ total: 0, completed: 0, left: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTasks();
      setTasks(data.tasks);
      setCounts(data.counts);
    } catch (error: any) {
      console.error('Failed to load tasks:', error);
      showNotification('error', 'Failed to connect to FastAPI backend. Ensure it is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (payload: CreateTaskPayload) => {
    setIsSubmitting(true);
    try {
      const newTask = await api.createTask(payload);
      // Prepend the new task
      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      setCounts({
        total: updatedTasks.length,
        completed: updatedTasks.filter((t) => t.completed).length,
        left: updatedTasks.filter((t) => !t.completed).length,
      });
      showNotification('success', 'Task created successfully!');
    } catch (error: any) {
      console.error('Failed to create task:', error);
      showNotification('error', error?.response?.data?.detail || 'Failed to create task');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const response = await api.toggleTask(taskId);
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = !task.completed;
          return response.task || { ...task, completed: newStatus };
        }
        return task;
      });

      setTasks(updatedTasks);
      setCounts({
        total: updatedTasks.length,
        completed: updatedTasks.filter((t) => t.completed).length,
        left: updatedTasks.filter((t) => !t.completed).length,
      });

      const currentTask = updatedTasks.find((t) => t.id === taskId);
      showNotification(
        'success',
        currentTask?.completed ? 'Task marked as completed! 🎉' : 'Task marked as pending.'
      );
    } catch (error) {
      console.error('Failed to toggle task:', error);
      showNotification('error', 'Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      const updatedTasks = tasks.filter((t) => t.id !== taskId);
      setTasks(updatedTasks);
      setCounts({
        total: updatedTasks.length,
        completed: updatedTasks.filter((t) => t.completed).length,
        left: updatedTasks.filter((t) => !t.completed).length,
      });
      showNotification('success', 'Task deleted successfully.');
    } catch (error) {
      console.error('Failed to delete task:', error);
      showNotification('error', 'Failed to delete task');
    }
  };

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by status tab
      if (filter === 'pending' && task.completed) return false;
      if (filter === 'completed' && !task.completed) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description ? task.description.toLowerCase().includes(query) : false;
        return matchTitle || matchDesc;
      }

      return true;
    });
  }, [tasks, filter, searchQuery]);

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Banner / Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all duration-300 backdrop-blur-md border ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-slate-800/80 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                TaskFlow <span className="text-indigo-400 text-lg font-normal">Manager</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-Stack Architecture: Next.js + FastAPI + MongoDB
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicator & Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-full text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>MongoDB Atlas</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <button
            onClick={loadTasks}
            disabled={isLoading}
            aria-label="Refresh tasks"
            title="Refresh tasks"
            className="p-2 bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </header>

      {/* Stats Counter Section */}
      <TaskStats counts={counts} />

      {/* Create Task Form */}
      <TaskForm onAddTask={handleAddTask} isSubmitting={isSubmitting} />

      {/* Filter Tabs & Search */}
      <TaskFilter
        currentFilter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
      />

      {/* Task List Section */}
      <section className="space-y-3">
        {isLoading && tasks.length === 0 ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Connecting to database and loading tasks...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          ))
        ) : (
          /* Empty States */
          <div className="py-14 px-4 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            {filter === 'completed' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">No completed tasks yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When you complete tasks from your list, they will appear here with full history.
                </p>
              </>
            ) : filter === 'pending' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3 text-amber-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">All caught up! 🎉</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  No pending tasks remaining. Take a break or add a new task above!
                </p>
              </>
            ) : searchQuery ? (
              <>
                <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">No tasks match &quot;{searchQuery}&quot;</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Try checking for typos or clear your search query.
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3 text-indigo-400">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">No tasks found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Your task list is empty. Type a task title above and click &quot;Add Task&quot; to get started.
                </p>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
