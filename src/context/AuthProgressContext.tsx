'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, UserProgress, UserRole } from '@/types';
import { DEFAULT_PROGRESS, SUPER_ADMINS, COURSES } from '@/lib/constants';

interface AuthProgressContextType {
  user: UserProfile | null;
  progress: UserProgress;
  loading: boolean;
  isNewUser: boolean;
  loginWithGoogleToken: (token: string, payload: any) => Promise<{ success: boolean; isNewUser: boolean }>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  updateProfile: (name: string, color: string, avatar: string) => Promise<void>;
  advanceTrackLevel: (courseKey: string, newLevel: number) => Promise<void>;
  completeTrack: (courseKey: string) => Promise<void>;
  syncCloud: () => Promise<{ success: boolean; message: string }>;
}

const AuthProgressContext = createContext<AuthProgressContextType | undefined>(undefined);

const USER_KEY = 'codeverse_user';
const TOKEN_KEY = 'codeverse_google_token';

function getUserId(email?: string): string {
  if (email) {
    return email.replace(/[^a-zA-Z0-9]/g, '');
  }
  return 'guest';
}

function getProgressKey(email?: string): string {
  return `codeverse_progress_${getUserId(email)}`;
}

export function AuthProgressProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  const getStoredProgress = useCallback((email?: string): UserProgress => {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const data = localStorage.getItem(getProgressKey(email));
      if (!data) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        levels: { ...DEFAULT_PROGRESS.levels, ...(parsed.levels || {}) },
        missions: { ...DEFAULT_PROGRESS.missions, ...(parsed.missions || {}) },
        badges: parsed.badges || [],
      };
    } catch {
      return DEFAULT_PROGRESS;
    }
  }, []);

  const saveLocalProgress = useCallback((newProgress: UserProgress, email?: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getProgressKey(email), JSON.stringify(newProgress));
    setProgress(newProgress);
  }, []);

  // Sync to backend
  const syncWithBackend = useCallback(async (action: string, extraData: any = {}) => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await fetch('/api/codeverse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          email: user?.email,
          ...extraData,
        }),
      });
      return await response.json();
    } catch (err) {
      console.error('API Sync Error:', err);
      return null;
    }
  }, [user]);

  // Load state on initial boot
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedUserStr = localStorage.getItem(USER_KEY);
      if (storedUserStr) {
        const storedUser: UserProfile = JSON.parse(storedUserStr);
        if (storedUser && storedUser.email) {
          const isSuper = SUPER_ADMINS.includes(storedUser.email.toLowerCase().trim());
          if (isSuper) storedUser.role = 'Admin';
          setUser(storedUser);
          const currentProgress = getStoredProgress(storedUser.email);
          setProgress(currentProgress);
        }
      }
    } catch (e) {
      console.error('Error loading stored user:', e);
    } finally {
      setLoading(false);
    }
  }, [getStoredProgress]);

  const loginWithGoogleToken = async (token: string, payload: any) => {
    setLoading(true);
    localStorage.setItem(TOKEN_KEY, token);

    const email = String(payload.email || '').toLowerCase().trim();
    const isSuper = SUPER_ADMINS.includes(email);
    const initialProfile: UserProfile = {
      email,
      name: payload.name || 'Cadet',
      avatar: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || 'C')}&background=6366f1&color=fff`,
      role: isSuper ? 'Admin' : null,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(initialProfile));
    setUser(initialProfile);

    // Query backend for existing profile & progress
    try {
      const res = await fetch('/api/codeverse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'load', email }),
      });

      const data = await res.json();
      let newUserFlag = !isSuper;

      if (data && data.status === 'success') {
        const remoteRole = isSuper ? 'Admin' : (data.role || null);
        if (remoteRole) newUserFlag = false;

        const updatedProfile: UserProfile = {
          ...initialProfile,
          name: data.name || initialProfile.name,
          avatar: data.avatar || initialProfile.avatar,
          color: data.color || '',
          role: remoteRole,
        };

        setUser(updatedProfile);
        localStorage.setItem(USER_KEY, JSON.stringify(updatedProfile));

        if (data.progress) {
          saveLocalProgress(data.progress, email);
        }
      }

      // Handshake login
      await fetch('/api/codeverse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'login',
          name: initialProfile.name,
          avatar: initialProfile.avatar,
          role: initialProfile.role || '',
        }),
      });

      setIsNewUser(newUserFlag);
      setLoading(false);
      return { success: true, isNewUser: newUserFlag };
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      return { success: false, isNewUser: false };
    }
  };

  const logout = async () => {
    try {
      await syncWithBackend('logout');
    } catch {}
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setProgress(DEFAULT_PROGRESS);
    setIsNewUser(false);
  };

  const setUserRole = async (role: UserRole) => {
    if (!user) return;
    const isSuper = SUPER_ADMINS.includes(user.email.toLowerCase().trim());
    const finalRole = isSuper ? 'Admin' : role;
    const updated = { ...user, role: finalRole };
    setUser(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setIsNewUser(false);

    await syncWithBackend('sync', {
      role: finalRole,
      progress,
      name: user.name,
      avatar: user.avatar,
      color: user.color || '',
    });
  };

  const updateProfile = async (name: string, color: string, avatar: string) => {
    if (!user) return;
    const updated = { ...user, name, color, avatar };
    setUser(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));

    await syncWithBackend('sync', {
      name,
      color,
      avatar,
      role: user.role,
      progress,
    });
  };

  const advanceTrackLevel = async (courseKey: string, newLevel: number) => {
    const course = COURSES.find((c) => c.key === courseKey);
    if (!course) return;

    const currentLevel = progress.levels[courseKey] || 1;
    if (newLevel > currentLevel && newLevel <= course.totalLevels + 1) {
      const earnedXp = (newLevel - currentLevel) * course.levelReward;
      const updatedProgress: UserProgress = {
        ...progress,
        xp: progress.xp + earnedXp,
        levels: {
          ...progress.levels,
          [courseKey]: newLevel,
        },
      };

      saveLocalProgress(updatedProgress, user?.email);
      await syncWithBackend('advanceLevel', { courseKey, newLevel });
    }
  };

  const completeTrack = async (courseKey: string) => {
    const course = COURSES.find((c) => c.key === courseKey);
    if (!course) return;

    if (!progress.missions[courseKey]) {
      const badgeName = `${course.shortName} Wings`;
      const badges = progress.badges.includes(badgeName) ? progress.badges : [...progress.badges, badgeName];

      const updatedProgress: UserProgress = {
        ...progress,
        xp: progress.xp + course.courseReward,
        missions: {
          ...progress.missions,
          [courseKey]: true,
        },
        badges,
      };

      saveLocalProgress(updatedProgress, user?.email);
      await syncWithBackend('completeCourse', { courseKey });
    }
  };

  const syncCloud = async () => {
    if (!user) return { success: false, message: 'Not logged in' };
    const res = await syncWithBackend('sync', {
      progress,
      name: user.name,
      avatar: user.avatar,
      color: user.color || '',
      role: user.role || '',
    });

    if (res && res.status === 'success') {
      if (res.progress) {
        saveLocalProgress(res.progress, user.email);
      }
      return { success: true, message: 'Cloud Synced Successfully!' };
    }
    return { success: false, message: 'Sync failed.' };
  };

  return (
    <AuthProgressContext.Provider
      value={{
        user,
        progress,
        loading,
        isNewUser,
        loginWithGoogleToken,
        logout,
        setUserRole,
        updateProfile,
        advanceTrackLevel,
        completeTrack,
        syncCloud,
      }}
    >
      {children}
    </AuthProgressContext.Provider>
  );
}

export function useAuthProgress() {
  const ctx = useContext(AuthProgressContext);
  if (!ctx) {
    throw new Error('useAuthProgress must be used within an AuthProgressProvider');
  }
  return ctx;
}
