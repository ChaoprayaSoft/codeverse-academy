'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthProgress } from '@/context/AuthProgressContext';
import { COURSES } from '@/lib/constants';
import XPProgressBar from '@/components/XPProgressBar';
import EditProfileModal from '@/components/EditProfileModal';
import GoogleAuthModal from '@/components/GoogleAuthModal';
import { Shield, Cloud, Check, Edit3, Rocket, Trophy, AlertCircle, Play, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, progress, syncCloud } = useAuthProgress();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncStatus('Syncing with Spaceport Cloud...');
    const res = await syncCloud();
    setSyncStatus(res.message);
    setSyncing(false);
    setTimeout(() => {
      setSyncStatus(null);
    }, 3500);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-3xl shadow-[0_0_30px_rgba(244,63,94,0.2)]">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-4xl font-black text-white">
          Cadet Access <span className="text-rose-400">Restricted</span>
        </h1>
        <p className="text-slate-400 text-base max-w-md mx-auto">
          You must be logged in to view your cadet profile, military flight rank, and mission progression.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] transition cursor-pointer"
        >
          Sign In to Access Dashboard
        </button>
        <GoogleAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  const roleColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    Admin: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40', icon: '🛡️' },
    Teacher: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/40', icon: '👩‍🏫' },
    Student: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', icon: '🧑‍🚀' },
    Guest: { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/40', icon: '👤' },
  };

  const currentRole = user.role || 'Student';
  const roleStyle = roleColors[currentRole] || roleColors.Student;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* ── Cadet Profile Header ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-2 border-indigo-500/60 shadow-[0_0_30px_rgba(99,102,241,0.3)] object-cover bg-slate-900"
          />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-3xl sm:text-4xl font-black text-white">{user.name}</h1>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border} flex items-center gap-1.5`}>
                <span>{roleStyle.icon}</span> {currentRole}
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Welcome to academy central telemetry. Ready for your next flight mission?
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <Edit3 size={14} /> Edit Profile
              </button>

              <button
                onClick={handleManualSync}
                disabled={syncing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <Cloud size={14} className={syncing ? 'animate-spin text-cyan-400' : 'text-slate-400'} />
                <span>{syncing ? 'Syncing...' : 'Sync Cloud'}</span>
              </button>

              {user.role === 'Admin' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-extrabold transition shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                  <Shield size={14} /> Command Center
                </Link>
              )}
            </div>

            {syncStatus && (
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 pt-1">
                <Check size={14} /> {syncStatus}
              </div>
            )}
          </div>
        </div>

        {/* XP Progress Card */}
        <div className="lg:col-span-5">
          <XPProgressBar xp={progress.xp} />
        </div>
      </div>

      {/* ── Badges Showcase ──────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy size={22} className="text-amber-400" />
          <h2 className="text-2xl font-black text-white">Cadet Wings &amp; Badges</h2>
        </div>

        {progress.badges.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center text-slate-400 text-sm">
            🌟 No badges unlocked yet. Complete your first mission track below to earn your Space Wings!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {progress.badges.map((badge, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center space-y-2 shadow-sm"
              >
                <div className="text-3xl animate-bounce" style={{ animationDuration: '3s' }}>
                  🏅
                </div>
                <div className="text-xs font-extrabold text-slate-200 truncate">{badge}</div>
                <div className="text-[10px] font-mono text-indigo-400 uppercase">Verified</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Mission Briefings Tracker ────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Rocket size={22} className="text-cyan-400" />
          <h2 className="text-2xl font-black text-white">Mission Briefings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => {
            const currentLevel = progress.levels[course.key] || 1;
            const isCompleted = progress.missions[course.key] === true;
            const completionPercent = isCompleted
              ? 100
              : Math.round(((currentLevel - 1) / course.totalLevels) * 100);

            return (
              <div
                key={course.key}
                className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-slate-800 hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{course.icon}</span>
                      <h3 className="font-extrabold text-lg text-white">{course.title}</h3>
                    </div>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle size={12} /> Mastered
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                        Lv. {currentLevel}/{course.totalLevels}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{course.description}</p>

                  {/* Level Progress Bar */}
                  <div className="space-y-1 mb-6">
                    <div className="flex justify-between text-[11px] font-medium text-slate-400">
                      <span>Progress</span>
                      <span className="font-mono">{completionPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${completionPercent}%`,
                          backgroundColor: isCompleted ? '#10b981' : course.color,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Link
                  href={`/missions/${course.key}`}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition cursor-pointer"
                  style={{
                    backgroundColor: isCompleted ? '#10b98122' : `${course.color}22`,
                    color: isCompleted ? '#34d399' : course.color,
                    border: `1px solid ${isCompleted ? '#10b98155' : `${course.color}55`}`,
                  }}
                >
                  <Play size={13} fill="currentColor" />
                  <span>{isCompleted ? 'Review Mission' : 'Resume Mission'}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </div>
  );
}
