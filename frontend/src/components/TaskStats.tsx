'use client';

import React from 'react';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { TaskCounts } from '@/types/task';

interface TaskStatsProps {
  counts: TaskCounts;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ counts }) => {
  const percentage =
    counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Tasks Card */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Tasks</p>
            <h3 className="text-3xl font-extrabold text-white mt-1.5">{counts.total}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <ListTodo className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
          <span>Registered in MongoDB</span>
        </p>
      </div>

      {/* Pending Tasks Card */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Tasks</p>
            <h3 className="text-3xl font-extrabold text-amber-400 mt-1.5">{counts.left}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">Need your attention</p>
      </div>

      {/* Completed Tasks Card */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Tasks</p>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-1.5">{counts.completed}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">Successfully finished</p>
      </div>

      {/* Completion Rate Card */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completion Rate</p>
            <h3 className="text-3xl font-extrabold text-indigo-400 mt-1.5">{percentage}%</h3>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
