'use client';

import React, { useState } from 'react';
import { Check, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      await onToggle(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const priorityBadge = {
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  }[task.priority || 'medium'];

  const formattedDate = task.created_at
    ? new Date(task.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div
      className={`group relative flex items-start justify-between p-4 rounded-xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0 pr-4">
        {/* Toggle Checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={isToggling}
          aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
              : 'border-slate-600 hover:border-indigo-400 hover:bg-indigo-500/10'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              onClick={handleToggle}
              className={`text-sm font-medium cursor-pointer break-words select-none transition-all ${
                task.completed
                  ? 'line-through text-slate-500'
                  : 'text-slate-100 hover:text-indigo-300'
              }`}
            >
              {task.title}
            </h4>

            {/* Priority Tag */}
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityBadge}`}
            >
              {task.priority || 'medium'}
            </span>

            {task.completed && (
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Completed
              </span>
            )}
          </div>

          {/* Description / Notes */}
          {task.description && (
            <p
              className={`text-xs mt-1.5 break-words ${
                task.completed ? 'text-slate-600 line-through' : 'text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Timestamp */}
          {formattedDate && (
            <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Action Button */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="Delete task"
        title="Delete task"
        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-40 shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
