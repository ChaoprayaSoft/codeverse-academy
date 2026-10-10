'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthProgress } from '@/context/AuthProgressContext';
import { CourseMeta } from '@/types';
import { usePyodide } from '@/hooks/usePyodide';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Terminal as TerminalIcon,
  Code2,
  Cpu,
  Zap,
  HelpCircle
} from 'lucide-react';

interface MissionRunnerClientProps {
  course: CourseMeta;
}

export default function MissionRunnerClient({ course }: MissionRunnerClientProps) {
  const { progress, advanceTrackLevel, completeTrack } = useAuthProgress();
  const { ready: pyodideReady, loading: pyodideLoading, statusMessage, runPython } = usePyodide();

  const savedLevel = progress.levels[course.key] || 1;
  const [currentLevel, setCurrentLevel] = useState<number>(Math.min(savedLevel, course.totalLevels));

  // Explorer Grid State
  const [explorerSequence, setExplorerSequence] = useState<string[]>([]);
  const [astronautPos, setAstronautPos] = useState({ x: 0, y: 0 });
  const [heroChar, setHeroChar] = useState<'👨‍🚀' | '👾' | '🤖' | '🐥'>('👨‍🚀');
  const [gridRunning, setGridRunning] = useState(false);

  // General Code / Terminal State
  const [userCode, setUserCode] = useState<string>('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [taskSuccess, setTaskSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal'>('editor');

  // Load starter templates when level changes
  useEffect(() => {
    setTaskSuccess(false);
    setConsoleLogs([
      `🌌 Initializing ${course.title} — Level ${currentLevel}/${course.totalLevels}`,
      `⚡ Python 3.12 WebAssembly Engine: ${pyodideReady ? 'Active & Ready' : 'Loading...'}`,
      'Ready for telemetry transmission.',
    ]);

    if (course.key === 'explorer') {
      setExplorerSequence([]);
      setAstronautPos({ x: 0, y: 0 });
    } else if (course.key === 'navigator') {
      if (currentLevel === 1) {
        setUserCode('# Mission 1: Logical Restoration\n# Repair engines and life support\nship.repair_engine()\nship.reboot_life_support()\nprint("Status:", ship.get_status())');
      } else if (currentLevel === 2) {
        setUserCode('# Mission 2: Orbital Escape\n# Escape velocity is 200 km/s (40 km/s per second)\nship.thrust(5)\nprint("Current Velocity:", ship.velocity, "km/s")');
      } else {
        setUserCode('# Mission 3: Hyperdrive Warp Jump\nship.activate_hyperdrive()\nprint("Warp Status:", ship.warp)');
      }
    } else if (course.key === 'commander') {
      setUserCode('<h1>Colony Alpha</h1>\n<p>Defense Grid Active</p>');
    } else if (course.key === 'architect') {
      setUserCode('def filter_oxygen(room_id, efficiency):\n    """Filter atmospheric toxins in the space station"""\n    print(f"Purifying Room {room_id} at {efficiency * 100}% efficiency")\n    return efficiency >= 0.8\n\n# Test filtration system\nstatus = filter_oxygen("Bridge", 0.95)\nprint("System Operational:", status)');
    } else if (course.key === 'data_analytic') {
      setUserCode('# Telemetry Dataset Analysis\nsensors = [24.5, 28.1, 19.3, 31.2, 22.0]\naverage_temp = sum(sensors) / len(sensors)\nprint(f"Station Average Temperature: {average_temp:.2f}°C")');
    } else if (course.key === 'ai_ml') {
      setUserCode('# Perceptron Activation Function\ndef activate(x):\n    return 1 if x >= 0.5 else 0\n\ninput_signal = 0.82\nprediction = activate(input_signal)\nprint("Perceptron Output:", prediction)');
    } else if (course.key === 'prompt_eng') {
      setUserCode('You are an expert navigation AI. Analyze orbital anomalies and calculate safe trajectory.');
    } else if (course.key === 'robotics') {
      setUserCode('# Autonomous Obstacle Avoidance Routine\nrobot.read_ultrasonic()\nrobot.set_motor_speed(100)\nif robot.distance < 20:\n    robot.turn_right()\nprint(f"Robot Distance: {robot.distance} cm, Heading: {robot.heading}")');
    } else {
      setUserCode('# Enter your Python solution here:\nprint("CodeVerse Mission Active")');
    }
  }, [currentLevel, course, pyodideReady]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#38bdf8', '#f59e0b', '#10b981'],
    });
  };

  // Run Mission Verification with Real WebAssembly Python
  const handleRunVerification = async () => {
    setGridRunning(true);
    setActiveTab('terminal');
    setConsoleLogs((prev) => [...prev, '> [WASM] Transmitting cadet code to Python runtime...']);

    let passed = false;

    if (course.key === 'explorer') {
      // 5x5 Grid Puzzle Simulation
      let curX = 0;
      let curY = 0;
      for (const cmd of explorerSequence) {
        if (cmd === 'UP' && curY > 0) curY--;
        if (cmd === 'DOWN' && curY < 4) curY++;
        if (cmd === 'LEFT' && curX > 0) curX--;
        if (cmd === 'RIGHT' && curX < 4) curX++;
        if (cmd === 'JUMP') curX = Math.min(4, curX + 2);
        setAstronautPos({ x: curX, y: curY });
        await new Promise((r) => setTimeout(r, 220));
      }
      passed = astronautPos.x === 4 && astronautPos.y === 2;
    } else {
      // Python WebAssembly Environment
      let setupPython = `
class Spaceship:
    def __init__(self):
        self.engine = 0
        self.life_support = 10
        self.velocity = 0
        self.warp = False
    def repair_engine(self):
        self.engine = 100
    def reboot_life_support(self):
        if self.engine == 100:
            self.life_support = 100
    def thrust(self, seconds):
        self.velocity += seconds * 40
    def activate_hyperdrive(self):
        self.warp = True
    def get_status(self):
        return f"Engine: {self.engine}%, Life Support: {self.life_support}%, Velocity: {self.velocity} km/s"

ship = Spaceship()

class Robot:
    def __init__(self):
        self.distance = 15
        self.heading = "NORTH"
        self.speed = 0
    def read_ultrasonic(self):
        return self.distance
    def set_motor_speed(self, speed):
        self.speed = speed
    def turn_right(self):
        self.heading = "EAST"

robot = Robot()
`;

      const pyResult = await runPython(userCode, setupPython);

      if (pyResult.output) {
        setConsoleLogs((prev) => [...prev, pyResult.output]);
      }

      if (pyResult.error) {
        setConsoleLogs((prev) => [
          ...prev,
          `⚠️ Python Exception Traceback:`,
          pyResult.error || '',
          '❌ Check your Python syntax and try again.',
        ]);
        passed = false;
      } else {
        passed = true;
      }
    }

    setGridRunning(false);

    if (passed) {
      setTaskSuccess(true);
      triggerConfetti();
      setConsoleLogs((prev) => [
        ...prev,
        '═══════════════════════════════════════════',
        '✅ MISSION VERIFICATION PASSED!',
        `⭐ +${course.levelReward} XP Awarded to Cadet Telemetry!`,
      ]);

      const nextLvl = currentLevel + 1;
      if (nextLvl <= course.totalLevels) {
        await advanceTrackLevel(course.key, nextLvl);
      } else {
        await completeTrack(course.key);
        setConsoleLogs((prev) => [
          ...prev,
          `🏆 CONGRATULATIONS! You have mastered ${course.title}!`,
          `🏅 Earned ${course.shortName} Space Wings Badge (+${course.courseReward} XP)!`,
        ]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Top Bar ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-4">
          <Link
            href="/#missions"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{course.icon}</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{course.title}</h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>{course.age}</span> • <span>+{course.levelReward} XP/Level</span> •{' '}
              <span className="text-amber-400 font-bold">+{course.courseReward} XP Bonus</span>
            </p>
          </div>
        </div>

        {/* Level Navigation Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">Level:</span>
          <div className="flex gap-1.5 overflow-x-auto max-w-xs p-1 bg-slate-950 rounded-xl border border-slate-800">
            {Array.from({ length: course.totalLevels }, (_, i) => i + 1).map((lvl) => {
              const isCurrent = currentLevel === lvl;
              const isUnlocked = lvl <= Math.max(savedLevel, 1);

              return (
                <button
                  key={lvl}
                  onClick={() => isUnlocked && setCurrentLevel(lvl)}
                  disabled={!isUnlocked}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : isUnlocked
                      ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-950 text-slate-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Workspace Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Briefing */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${course.color}15`,
                  color: course.color,
                  borderColor: `${course.color}30`,
                }}
              >
                Level {currentLevel} of {course.totalLevels}
              </span>
              {taskSuccess && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <CheckCircle size={14} /> Completed
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-white">Mission Objective</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {course.key === 'explorer' &&
                `Use directional command blocks and jumps to guide your ${heroChar} across the nebula grid to the target beacon (⭐).`}
              {course.key === 'navigator' &&
                'Execute Python spaceship commands to restore reactor engine power, reboot life support, and achieve escape velocity.'}
              {course.key === 'commander' &&
                'Construct the frontier outpost UI in HTML/CSS and test real-time server communications.'}
              {course.key === 'architect' &&
                'Implement modular Python architecture patterns to filter atmospheric anomalies and return verified status.'}
              {course.key === 'data_analytic' &&
                'Analyze sensor telemetry data in Python, computing average array statistics and filtering safe thresholds.'}
              {course.key === 'ai_ml' &&
                'Write perceptron activation logic to classify space station neural signals into binary decisions.'}
              {course.key === 'prompt_eng' &&
                'Craft an unambiguous AI navigation system prompt adhering strictly to flight safety guardrails.'}
              {course.key === 'robotics' &&
                'Program the autonomous rover state machine to process ultrasonic distance telemetry and navigate obstacles.'}
              {!['explorer', 'navigator', 'commander', 'architect', 'data_analytic', 'ai_ml', 'prompt_eng', 'robotics'].includes(
                course.key
              ) && `Master level ${currentLevel} concepts in ${course.title} and transmit your code solution.`}
            </p>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="font-bold text-slate-400 uppercase tracking-wider">Flight Checklist:</div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-indigo-400">✓</span> Valid Python 3.12 syntax / command sequence
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-indigo-400">✓</span> Error-free WebAssembly execution
              </div>
            </div>
          </div>

          {/* Explorer Hero Picker */}
          {course.key === 'explorer' ? (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase">Select Hero:</div>
              <div className="flex gap-2">
                {(['👨‍🚀', '👾', '🤖', '🐥'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setHeroChar(ch)}
                    className={`w-12 h-12 rounded-xl text-2xl border transition cursor-pointer flex items-center justify-center ${
                      heroChar === ch
                        ? 'bg-indigo-600/30 border-indigo-500 shadow-md scale-105'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Pyodide WebAssembly Status Pill */
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-300">
                <Cpu size={15} className={pyodideReady ? 'text-emerald-400' : 'text-amber-400 animate-spin'} />
                <span>Python 3.12 WebAssembly Engine</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">{statusMessage}</div>
            </div>
          )}
        </div>

        {/* Right Panel: Interactive Canvas / Code Editor */}
        <div className="lg:col-span-8 space-y-6">
          {course.key === 'explorer' ? (
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
              <div className="flex justify-center">
                <div className="grid grid-cols-5 gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                  {Array.from({ length: 25 }, (_, idx) => {
                    const x = idx % 5;
                    const y = Math.floor(idx / 5);
                    const isAstronaut = astronautPos.x === x && astronautPos.y === y;
                    const isGoal = x === 4 && y === 2;

                    return (
                      <div
                        key={idx}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex items-center justify-center text-2xl transition-all duration-200 ${
                          isAstronaut
                            ? 'bg-indigo-600/40 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                            : isGoal
                            ? 'bg-amber-500/20 border-amber-500/50 animate-pulse'
                            : 'bg-slate-900/60 border-slate-800/80'
                        }`}
                      >
                        {isAstronaut ? heroChar : isGoal ? '⭐' : ''}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Command Sequence Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Command Sequence:
                  </span>
                  <button
                    onClick={() => setExplorerSequence([])}
                    className="text-xs text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear Sequence
                  </button>
                </div>

                <div className="min-h-[48px] p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap gap-1.5 items-center">
                  {explorerSequence.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">Click buttons below to add movement steps...</span>
                  ) : (
                    explorerSequence.map((cmd, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs"
                      >
                        {cmd}
                      </span>
                    ))
                  )}
                </div>

                {/* Command Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {['UP', 'DOWN', 'LEFT', 'RIGHT', 'JUMP'].map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => setExplorerSequence((prev) => [...prev, cmd])}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer"
                    >
                      +{cmd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      activeTab === 'editor'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code2 size={14} /> Python Editor
                  </button>
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      activeTab === 'terminal'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <TerminalIcon size={14} /> Console / Output
                  </button>
                </div>
                <span className="hidden sm:inline text-slate-500">// {course.key}_mission.py</span>
              </div>

              {activeTab === 'editor' ? (
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={11}
                  className="w-full p-4 rounded-2xl bg-slate-950 font-mono text-sm text-cyan-300 border border-slate-800 focus:outline-none focus:border-indigo-500 transition resize-none shadow-inner leading-relaxed"
                  placeholder="Type your Python solution here..."
                />
              ) : (
                <div className="h-64 p-4 rounded-2xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 overflow-y-auto space-y-1.5 leading-relaxed">
                  {consoleLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.includes('✅')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('⭐') || log.includes('🏆')
                          ? 'text-amber-400 font-bold'
                          : log.includes('❌') || log.includes('⚠️')
                          ? 'text-rose-400 font-bold'
                          : log.startsWith('>')
                          ? 'text-indigo-400'
                          : 'text-slate-300'
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setTaskSuccess(false);
                if (course.key === 'explorer') setAstronautPos({ x: 0, y: 0 });
              }}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition cursor-pointer"
            >
              <RotateCcw size={15} /> Reset
            </button>

            <button
              onClick={handleRunVerification}
              disabled={gridRunning}
              className="flex-1 max-w-xs py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-extrabold text-white text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play size={16} fill="currentColor" />
              <span>{gridRunning ? 'Executing Python...' : 'Run Mission'}</span>
            </button>

            {taskSuccess && currentLevel < course.totalLevels && (
              <button
                onClick={() => setCurrentLevel((lvl) => lvl + 1)}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <span>Next Level</span> <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
