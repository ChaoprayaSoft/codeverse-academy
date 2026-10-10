'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthProgress } from '@/context/AuthProgressContext';
import GoogleAuthModal from './GoogleAuthModal';
import EditProfileModal from './EditProfileModal';
import RoleModal from './RoleModal';
import { Shield, Sparkles, LogOut, Edit3, LayoutDashboard, Rocket } from 'lucide-react';

export default function Navbar() {
  const { user, progress, logout } = useAuthProgress();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const roleColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    Admin: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: '🛡️' },
    Teacher: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', icon: '👩‍🏫' },
    Student: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: '🧑‍🚀' },
    Guest: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', icon: '👤' },
  };

  const currentRole = user?.role || 'Guest';
  const roleStyle = roleColors[currentRole] || roleColors.Student;

  return (
    <>
      <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070a13]/80 border-b border-indigo-500/15 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:scale-105 transition">
              🚀
            </div>
            <div className="text-2xl font-black tracking-wider text-white">
              CODE<span className="text-gradient">VERSE</span>
            </div>
          </Link>

          {/* Navigation Links & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/#missions"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition"
            >
              <Rocket size={16} /> Missions
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition shadow-sm"
              >
                <LayoutDashboard size={16} /> My Dashboard
              </Link>
            )}

            {/* Admin Command Center Link */}
            {user?.role === 'Admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 transition shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                <Shield size={14} /> Command Center
              </Link>
            )}

            {/* User Session or Join Button */}
            {user ? (
              <div className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-900/80 border border-slate-800 shadow-inner">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-indigo-500/50 object-cover"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-200 leading-tight max-w-[120px] truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] font-mono text-amber-400 font-semibold">
                    ⚡ {progress.xp.toLocaleString()} XP
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border} hidden lg:inline-flex items-center gap-1`}
                >
                  <span>{roleStyle.icon}</span> {currentRole}
                </span>

                <button
                  onClick={() => setProfileModalOpen(true)}
                  title="Edit Profile"
                  className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-full transition cursor-pointer"
                >
                  <Edit3 size={15} />
                </button>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-full transition cursor-pointer"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition cursor-pointer"
              >
                <Sparkles size={16} /> Join Now
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Modals */}
      <GoogleAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <EditProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <RoleModal />
    </>
  );
}
