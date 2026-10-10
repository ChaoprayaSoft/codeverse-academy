'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthProgress } from '@/context/AuthProgressContext';
import { COURSES } from '@/lib/constants';
import { ArrowRight, Sparkles, CheckCircle, Play, Code2, Terminal } from 'lucide-react';

export default function HomePage() {
  const { user, progress } = useAuthProgress();

  // Sandbox State
  const [sandboxCode, setSandboxCode] = useState('transform: scale(1.2) rotate(15deg);\nfilter: brightness(1.2);');
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(15);
  const [brightness, setBrightness] = useState(1.2);
  const [systemStatus, setSystemStatus] = useState('System Status: Stable');

  const handleSandboxChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSandboxCode(val);

    const scaleMatch = val.match(/scale\(([^)]+)\)/);
    const rotateMatch = val.match(/rotate\(([^)]+)\)/);
    const brightnessMatch = val.match(/brightness\(([^)]+)\)/);

    if (scaleMatch) setScale(parseFloat(scaleMatch[1]) || 1);
    if (rotateMatch) setRotate(parseFloat(rotateMatch[1]) || 0);
    if (brightnessMatch) setBrightness(parseFloat(brightnessMatch[1]) || 1);

    setSystemStatus('Telemetry Updating...');
    setTimeout(() => {
      setSystemStatus('System Status: Stable');
    }, 600);
  };

  return (
    <div className="space-y-24 pb-24">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles size={14} /> Next-Gen STEM Spaceport
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
              The Universe is Your <br />
              <span className="text-gradient">Playground.</span>
            </h1>

            <p className="text-slate-400 text-lg sm:text-xl max-w-xl leading-relaxed">
              Embark on an epic coding adventure through the stars. Master the languages of the future with gamified challenges designed for every age from 5 to 15+.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#missions"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Your Mission</span>
                <ArrowRight size={18} />
              </a>

              {user && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-base transition"
                >
                  <Terminal size={18} className="text-cyan-400" />
                  <span>Cadet Dashboard</span>
                </Link>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 sm:w-96 animate-float">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl -z-10" />
              <img
                src="/assets/mascot.png"
                alt="CodeVerse Astronaut Mascot"
                className="w-full h-auto drop-shadow-[0_20px_40px_rgba(99,102,241,0.3)] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 9-Track Mission Grid ─────────────────────────────────── */}
      <section id="missions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            9 Specialized Tracks
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Choose Your <span className="text-gradient">Path</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            From visual sequential block puzzles to neural networks and robotics, select a track to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => {
            const currentLevel = progress.levels[course.key] || 1;
            const isCompleted = progress.missions[course.key] === true;

            return (
              <div
                key={course.key}
                className="glass-card rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden group border border-slate-800 hover:border-indigo-500/50 transition-all duration-300"
              >
                {/* Age & Status Badges */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-extrabold px-3 py-1 rounded-full border"
                    style={{
                      backgroundColor: `${course.color}15`,
                      color: course.color,
                      borderColor: `${course.color}40`,
                    }}
                  >
                    {course.age}
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle size={12} /> Mastered
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-800">
                      Lv. {currentLevel}/{course.totalLevels}
                    </span>
                  )}
                </div>

                {/* Course Header */}
                <div>
                  <div className="text-4xl mb-3">{course.icon}</div>
                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors mb-2">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {course.description}
                  </p>

                  {/* Feature Highlights */}
                  <ul className="space-y-2 mb-8 text-xs text-slate-300">
                    {course.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span style={{ color: course.color }}>✨</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Launch Action */}
                <Link
                  href={`/missions/${course.key}`}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: isCompleted ? '#10b981' : course.color,
                    color: '#ffffff',
                    boxShadow: `0 4px 20px ${course.color}40`,
                  }}
                >
                  <Play size={15} fill="currentColor" />
                  <span>{isCompleted ? 'Replay Track' : 'Launch Mission'}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Interactive Live Sandbox ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-indigo-500/30">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Code2 size={14} /> Live Flight Simulation
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Try a <span className="text-gradient">Quick Mission</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Change the astronaut mascot's size, rotation, or brightness using live CSS in real-time!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Live Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>// astronaut_telemetry.css</span>
                <span className="text-emerald-400 font-bold">{systemStatus}</span>
              </div>
              <textarea
                value={sandboxCode}
                onChange={handleSandboxChange}
                rows={5}
                className="w-full p-4 rounded-2xl bg-slate-950 font-mono text-sm text-cyan-300 border border-slate-800 focus:outline-none focus:border-indigo-500 transition resize-none shadow-inner"
              />
              <div className="text-xs text-slate-500">
                Tip: Try modifying <code className="text-indigo-400 font-mono">scale(1.5)</code> or <code className="text-indigo-400 font-mono">rotate(45deg)</code>!
              </div>
            </div>

            {/* Mascot Viewport */}
            <div className="h-64 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent opacity-60" />
              <img
                src="/assets/mascot.png"
                alt="Interactive Mascot"
                className="w-32 h-32 object-contain transition-all duration-300"
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  filter: `brightness(${brightness})`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-slate-900 pt-12 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="text-lg font-bold text-slate-300">
            CODE<span className="text-gradient">VERSE</span> ACADEMY
          </div>
          <p>© 2026 CodeVerse Academy. Space Exploration &amp; Next-Gen STEM Learning Systems.</p>
        </div>
      </footer>
    </div>
  );
}
