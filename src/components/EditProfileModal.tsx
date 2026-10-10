'use client';

import React, { useState, useEffect } from 'react';
import { useAuthProgress } from '@/context/AuthProgressContext';
import { ANIMAL_AVATARS } from '@/lib/constants';
import { X, Check } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateProfile } = useAuthProgress();
  const [name, setName] = useState('');
  const [color, setColor] = useState('6366f1');
  const [selectedAnimal, setSelectedAnimal] = useState('Lion');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      if (user.color) setColor(user.color.replace('#', ''));
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const cleanColor = color.replace('#', '');
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAnimal)}&background=${cleanColor}&color=fff&size=128&font-size=0.6`;
    await updateProfile(name.trim(), cleanColor, avatarUrl);
    setSaving(false);
    onClose();
  };

  const previewAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAnimal)}&background=${color.replace('#', '')}&color=fff&size=128&font-size=0.6`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)] text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>✎</span> Edit Cadet Profile
        </h3>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <img
              src={previewAvatarUrl}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full border-2 border-indigo-500 shadow-md object-cover"
            />
            <div>
              <div className="text-sm text-slate-400">Selected Avatar Preview</div>
              <div className="font-bold text-base text-slate-200">{selectedAnimal} Cadet</div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Cadet Callsign / Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition"
              placeholder="e.g. Commander Nova"
            />
          </div>

          {/* Color Accent Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Badge Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={`#${color.replace('#', '')}`}
                onChange={(e) => setColor(e.target.value.replace('#', ''))}
                className="w-12 h-12 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <span className="text-sm font-mono text-slate-300">#{color.replace('#', '').toUpperCase()}</span>
            </div>
          </div>

          {/* Animal Avatar Grid */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Choose Animal Crest
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-40 overflow-y-auto p-1">
              {ANIMAL_AVATARS.map((animal) => (
                <button
                  type="button"
                  key={animal}
                  onClick={() => setSelectedAnimal(animal)}
                  className={`py-2 px-1 text-xs rounded-xl font-semibold border transition cursor-pointer text-center truncate ${
                    selectedAnimal === animal
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {animal}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2"
            >
              {saving ? 'Saving...' : <><Check size={18} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
