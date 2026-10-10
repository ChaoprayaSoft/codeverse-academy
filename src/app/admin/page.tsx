'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthProgress } from '@/context/AuthProgressContext';
import { COURSES } from '@/lib/constants';
import { CadetUserData } from '@/types';
import { Shield, Users, Award, Zap, Download, Search, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuthProgress();
  const [cadets, setCadets] = useState<CadetUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCadets = async () => {
    if (!user || user.role !== 'Admin') return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const token = localStorage.getItem('codeverse_google_token');
      const res = await fetch('/api/codeverse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'getUsers' }),
      });

      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.users)) {
        setCadets(data.users);
      } else {
        setErrorMsg(data.message || 'Could not fetch cadets.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchCadets();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Access Restriction
  if (!user || user.role !== 'Admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-3xl">
          🔒
        </div>
        <h1 className="text-3xl font-black text-white">Access Restricted</h1>
        <p className="text-slate-400 text-sm">
          This command center is only accessible to verified Academy Admins.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition"
        >
          <ArrowLeft size={16} /> Return to Spaceport
        </Link>
      </div>
    );
  }

  const handleRemoveUser = async (targetEmail: string) => {
    if (!confirm(`Are you sure you want to PERMANENTLY remove and block ${targetEmail}?`)) return;

    try {
      const token = localStorage.getItem('codeverse_google_token');
      const res = await fetch('/api/codeverse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'removeUser', targetEmail }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        alert('Cadet removed and blocked successfully.');
        fetchCadets();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    }
  };

  // Stats
  const totalCount = cadets.length;
  const adminCount = cadets.filter((c) => c.role === 'Admin').length;
  const teacherCount = cadets.filter((c) => c.role === 'Teacher').length;
  const studentCount = cadets.filter((c) => !c.role || c.role === 'Student').length;
  const guestCount = cadets.filter((c) => c.role === 'Guest').length;
  const totalXp = cadets.reduce((sum, c) => sum + (c.progress?.xp || 0), 0);
  const totalBadges = cadets.reduce((sum, c) => sum + (c.progress?.badges?.length || 0), 0);

  // Filtered Cadets
  const filtered = cadets.filter((c) => {
    const role = c.role || 'Student';
    const matchesRole = filterRole === 'All' || role === filterRole;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      (c.name && c.name.toLowerCase().includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query));
    return matchesRole && matchesQuery;
  });

  // Export CSV
  const exportCSV = () => {
    if (filtered.length === 0) {
      alert('No cadet records to export.');
      return;
    }

    const headers = [
      'Name', 'Email', 'Role', 'XP', 'Completion %', 'Badges', 'Last Active',
      ...COURSES.map((c) => `${c.shortName} Level`),
    ];

    const rows = filtered.map((c) => {
      const p = c.progress || { xp: 0, levels: {}, missions: {}, badges: [] };
      let completedLevels = 0;
      let totalLevels = 0;

      COURSES.forEach((course) => {
        totalLevels += course.totalLevels;
        if (p.missions && p.missions[course.key]) {
          completedLevels += course.totalLevels;
        } else {
          const lvl = (p.levels && p.levels[course.key]) || 1;
          completedLevels += Math.min(Math.max(0, lvl - 1), course.totalLevels);
        }
      });

      const completionPercent = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
      const badgesStr = (p.badges || []).join('; ');
      const lastActive = c.lastUpdated ? new Date(c.lastUpdated).toISOString() : '';

      const courseLevels = COURSES.map((course) => {
        if (p.missions && p.missions[course.key]) return course.totalLevels;
        const lvl = (p.levels && p.levels[course.key]) || 1;
        return Math.min(Math.max(1, lvl), course.totalLevels);
      });

      return [
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${c.role || 'Student'}"`,
        p.xp || 0,
        `${completionPercent}%`,
        `"${badgesStr.replace(/"/g, '""')}"`,
        `"${lastActive}"`,
        ...courseLevels,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `codeverse_cadets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const roleStyles: Record<string, { bg: string; text: string; border: string }> = {
    Admin: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
    Teacher: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30' },
    Student: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    Guest: { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield size={14} /> Academy Command Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Cadet Telemetry &amp; <span className="text-gradient">Cohorts</span>
          </h1>
          <p className="text-slate-400 text-sm">Full administrative visibility into cadet progression and security controls.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
          >
            <Download size={15} /> Export CSV
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
          >
            <ArrowLeft size={15} /> My Dashboard
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="text-xl font-black text-white">{totalCount}</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Users</div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
          <div className="text-xl font-black text-amber-400">{adminCount}</div>
          <div className="text-[11px] font-bold text-amber-300/80 uppercase tracking-wider">Admins</div>
        </div>
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center">
          <div className="text-xl font-black text-indigo-400">{teacherCount}</div>
          <div className="text-[11px] font-bold text-indigo-300/80 uppercase tracking-wider">Teachers</div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
          <div className="text-xl font-black text-emerald-400">{studentCount}</div>
          <div className="text-[11px] font-bold text-emerald-300/80 uppercase tracking-wider">Students</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/30 text-center">
          <div className="text-xl font-black text-slate-400">{guestCount}</div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Guests</div>
        </div>
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
          <div className="text-xl font-black text-cyan-400">{totalXp.toLocaleString()}</div>
          <div className="text-[11px] font-bold text-cyan-300/80 uppercase tracking-wider">Total XP</div>
        </div>
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center">
          <div className="text-xl font-black text-purple-400">{totalBadges}</div>
          <div className="text-[11px] font-bold text-purple-300/80 uppercase tracking-wider">Badges</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Role Filters */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Admin', 'Teacher', 'Student', 'Guest'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                filterRole === role
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle size={16} /> {errorMsg}
        </div>
      )}

      {/* Cadets Table */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Cadet</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">XP</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4">Course Levels</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading academy telemetry...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No cadets found matching search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((cadet) => {
                  const role = cadet.role || 'Student';
                  const style = roleStyles[role] || roleStyles.Student;
                  const p = cadet.progress || { xp: 0, levels: {}, missions: {}, badges: [] };

                  return (
                    <tr key={cadet.email} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cadet.avatar || 'https://ui-avatars.com/api/?name=C&background=6366f1&color=fff'}
                            alt=""
                            className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-200">{cadet.name || 'Unnamed Cadet'}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{cadet.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${style.bg} ${style.text} ${style.border}`}>
                          {role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        ⚡ {(p.xp || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-300 font-medium">{(p.badges || []).length}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {COURSES.map((course) => {
                            const isMastered = p.missions && p.missions[course.key];
                            const lvl = (p.levels && p.levels[course.key]) || 1;

                            return (
                              <span
                                key={course.key}
                                className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                                  isMastered
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : 'bg-slate-950 text-slate-400 border-slate-800'
                                }`}
                                title={`${course.title}: Level ${lvl}/${course.totalLevels}`}
                              >
                                {course.shortName.slice(0, 3)}.{isMastered ? '✓' : lvl}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {cadet.lastUpdated ? new Date(cadet.lastUpdated).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {cadet.role !== 'Admin' && (
                          <button
                            onClick={() => handleRemoveUser(cadet.email)}
                            title="Remove & Block Cadet"
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
