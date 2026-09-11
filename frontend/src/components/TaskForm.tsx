'use client';

import React, { useState } from 'react';
import { Plus, Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CreateTaskPayload, Priority } from '@/types/task';

interface TaskFormProps {
  onAddTask: (payload: CreateTaskPayload) => Promise<void>;
  isSubmitting: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    setError(null);
    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim(),
        priority,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setShowDetails(false);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to create task. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Create New Task</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          placeholder="What needs to be done? (e.g. Complete backend API, buy groceries...)"
          className="flex-1 bg-slate-950/60 border border-slate-700/70 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
        />

        <div className="flex items-center gap-2">
          {/* Priority selector */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="bg-slate-950/60 border border-slate-700/70 rounded-xl px-3 py-3 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium px-5 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Adding...' : 'Add Task'}</span>
          </button>
        </div>
      </div>

      {/* Toggle additional description button */}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Hide Details</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>+ Add description / notes (optional)</span>
            </>
          )}
        </button>
      </div>

      {/* Collapsible description field */}
      {showDetails && (
        <div className="mt-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add extra context or notes here..."
            rows={2}
            className="w-full bg-slate-950/60 border border-slate-700/70 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
          />
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};
