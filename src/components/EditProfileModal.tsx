'use client';

import React, { useState, useEffect } from 'react';
import { useAuthProgress } from '@/context/AuthProgressContext';
import { X, Check, Sparkles } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CUTE_ANIMALS = [
  { id: 'panda', name: 'Panda', emoji: '🐼', defaultColor: '10b981' },
  { id: 'fox', name: 'Fox', emoji: '🦊', defaultColor: 'f97316' },
  { id: 'cat', name: 'Kitten', emoji: '🐱', defaultColor: 'ec4899' },
  { id: 'dog', name: 'Puppy', emoji: '🐶', defaultColor: 'eab308' },
  { id: 'lion', name: 'Lion', emoji: '🦁', defaultColor: 'f59e0b' },
  { id: 'bear', name: 'Bear', emoji: '🐻', defaultColor: '8b5cf6' },
  { id: 'bunny', name: 'Bunny', emoji: '🐰', defaultColor: 'a855f7' },
  { id: 'koala', name: 'Koala', emoji: '🐨', defaultColor: '06b6d4' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯', defaultColor: 'f43f5e' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', defaultColor: '38bdf8' },
  { id: 'monkey', name: 'Monkey', emoji: '🐵', defaultColor: 'e11d48' },
  { id: 'frog', name: 'Frog', emoji: '🐸', defaultColor: '84cc16' },
  { id: 'owl', name: 'Owl', emoji: '🦉', defaultColor: '6366f1' },
  { id: 'dragon', name: 'Dragon', emoji: '🐲', defaultColor: '14b8a6' },
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄', defaultColor: 'd946ef' },
  { id: 'duck', name: 'Duckling', emoji: '🐥', defaultColor: 'fbbf24' },
];

export function getAnimalAvatarSvg(emoji: string, bgColor: string): string {
  const cleanColor = bgColor.startsWith('#') ? bgColor : `#${bgColor}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <radialGradient id="g" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stop-color="${cleanColor}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#070a13" stop-opacity="0.98"/>
      </radialGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="${cleanColor}" flood-opacity="0.6"/>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#g)" stroke="${cleanColor}" stroke-width="3"/>
    <circle cx="50" cy="50" r="41" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" stroke-dasharray="6 3"/>
    <text x="50" y="65" font-size="50" text-anchor="middle" filter="url(#glow)">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateProfile } = useAuthProgress();
  const [name, setName] = useState('');
  const [color, setColor] = useState('6366f1');
  const [selectedAnimal, setSelectedAnimal] = useState(CUTE_ANIMALS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      if (user.color) setColor(user.color.replace('#', ''));

      // Find matching animal if present in avatar or default to Panda
      const found = CUTE_ANIMALS.find((a) => user.avatar?.includes(encodeURIComponent(a.emoji)) || user.avatar?.includes(a.name));
      if (found) setSelectedAnimal(found);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const cleanColor = color.replace('#', '');
    const avatarUrl = getAnimalAvatarSvg(selectedAnimal.emoji, cleanColor);
    await updateProfile(name.trim(), cleanColor, avatarUrl);
    setSaving(false);
    onClose();
  };

  const previewAvatarUrl = getAnimalAvatarSvg(selectedAnimal.emoji, color);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-indigo-500/40 shadow-[0_0_60px_rgba(99,102,241,0.25)] text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-black mb-1 flex items-center gap-2 tracking-tight">
          <span>✨</span> Customize Cadet Identity
        </h3>
        <p className="text-slate-400 text-xs mb-5">Choose your space animal crest and personalized callsign.</p>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <img
              src={previewAvatarUrl}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full shadow-lg border border-white/20 transition-all duration-200 scale-105"
            />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Cadet Crest Preview</div>
              <div className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
                <span>{selectedAnimal.emoji}</span>
                <span>{name.trim() || 'Cadet'} the {selectedAnimal.name}</span>
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Cadet Name / Callsign
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-indigo-500 transition"
              placeholder="e.g. Commander Nova"
            />
          </div>

          {/* Color Accent Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Badge Aura Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={`#${color.replace('#', '')}`}
                onChange={(e) => setColor(e.target.value.replace('#', ''))}
                className="w-11 h-11 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                #{color.replace('#', '').toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => setColor(selectedAnimal.defaultColor)}
                className="text-[11px] text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Use Animal Color
              </button>
            </div>
          </div>

          {/* Cute Animals Selection Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Choose Your Cute Space Animal (16 Options)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1 pr-2">
              {CUTE_ANIMALS.map((animal) => {
                const isSelected = selectedAnimal.id === animal.id;
                return (
                  <button
                    type="button"
                    key={animal.id}
                    onClick={() => {
                      setSelectedAnimal(animal);
                      setColor(animal.defaultColor);
                    }}
                    className={`p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 shadow-md scale-105'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <span className="text-2xl">{animal.emoji}</span>
                    <span className={`text-[11px] font-bold truncate max-w-full ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                      {animal.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 font-bold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-extrabold text-white shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? 'Saving...' : <><Check size={18} /> Apply Crest</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
