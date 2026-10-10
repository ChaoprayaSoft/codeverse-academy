'use client';

import React from 'react';
import { useAuthProgress } from '@/context/AuthProgressContext';
import { UserRole } from '@/types';
import { GraduationCap, Rocket, UserCheck } from 'lucide-react';

export default function RoleModal() {
  const { isNewUser, setUserRole } = useAuthProgress();

  if (!isNewUser) return null;

  const roles: { role: UserRole; title: string; desc: string; icon: any; color: string; border: string; bg: string }[] = [
    {
      role: 'Teacher',
      title: 'Teacher',
      desc: 'Manage missions & monitor cadets',
      icon: GraduationCap,
      color: '#818cf8',
      border: 'border-indigo-500/40 hover:border-indigo-400',
      bg: 'bg-indigo-500/10 hover:bg-indigo-500/20',
    },
    {
      role: 'Student',
      title: 'Student',
      desc: 'Launch missions & master code',
      icon: Rocket,
      color: '#34d399',
      border: 'border-emerald-500/40 hover:border-emerald-400',
      bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    },
    {
      role: 'Guest',
      title: 'Guest',
      desc: 'Explore & preview the academy',
      icon: UserCheck,
      color: '#94a3b8',
      border: 'border-slate-500/40 hover:border-slate-400',
      bg: 'bg-slate-500/10 hover:bg-slate-500/20',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl p-8 rounded-3xl bg-[#0f172a] border-2 border-indigo-500/40 shadow-[0_0_60px_rgba(99,102,241,0.25)] text-center text-slate-100">
        <div className="text-4xl mb-2">🚀</div>
        <h2 className="text-3xl font-extrabold mb-2 tracking-tight">
          Welcome to <span className="text-gradient">CodeVerse!</span>
        </h2>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          Before we launch, tell us who you are. This personalizes your experience across all missions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {roles.map(({ role, title, desc, icon: Icon, color, border, bg }) => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${border} ${bg}`}
            >
              <div className="p-3 rounded-full mb-3" style={{ background: `${color}22` }}>
                <Icon size={32} style={{ color }} />
              </div>
              <div className="text-lg font-bold mb-1" style={{ color }}>{title}</div>
              <div className="text-xs text-slate-400 text-center">{desc}</div>
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          Admins are assigned automatically by the academy leadership.
        </p>
      </div>
    </div>
  );
}
