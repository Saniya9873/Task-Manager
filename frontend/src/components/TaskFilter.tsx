'use client';

import React from 'react';
import { Search, ListFilter, CheckCircle2, Clock, Layers } from 'lucide-react';
import { TaskCounts } from '@/types/task';

export type FilterStatus = 'all' | 'pending' | 'completed';

interface TaskFilterProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: TaskCounts;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}) => {
  const tabs = [
    {
      id: 'all' as FilterStatus,
      label: 'All Tasks',
      icon: Layers,
      count: counts.total,
      color: 'bg-slate-700/60 text-slate-200',
      activeBorder: 'border-indigo-500 bg-indigo-500/10 text-indigo-300',
    },
    {
      id: 'pending' as FilterStatus,
      label: 'Pending',
      icon: Clock,
      count: counts.left,
      color: 'bg-amber-500/20 text-amber-300',
      activeBorder: 'border-amber-500 bg-amber-500/10 text-amber-300',
    },
    {
      id: 'completed' as FilterStatus,
      label: 'Completed',
      icon: CheckCircle2,
      count: counts.completed,
      color: 'bg-emerald-500/20 text-emerald-300',
      activeBorder: 'border-emerald-500 bg-emerald-500/10 text-emerald-300',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      {/* Tab Buttons */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentFilter === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? `${tab.activeBorder} shadow-sm font-semibold`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/10' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-64">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
