'use client';

import React from 'react';
import { getCadetRank, getNextRankTarget } from '@/lib/constants';

interface XPProgressBarProps {
  xp: number;
}

export default function XPProgressBar({ xp }: XPProgressBarProps) {
  const currentRank = getCadetRank(xp);
  const { nextRank, targetXp, percent } = getNextRankTarget(xp);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Experience</span>
          <div className="text-3xl font-black text-amber-400 flex items-center gap-2">
            ⚡ {xp.toLocaleString()} <span className="text-sm font-bold text-slate-400">XP</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Military Rank</span>
          <div className="text-xl font-black text-indigo-400">{currentRank}</div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-3.5 rounded-full bg-slate-950 p-0.5 border border-slate-800 relative overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-amber-400 transition-all duration-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
        <span>{percent}% Complete</span>
        <span>
          Next Milestone: <strong className="text-slate-200">{nextRank}</strong> ({targetXp.toLocaleString()} XP)
        </span>
      </div>
    </div>
  );
}
