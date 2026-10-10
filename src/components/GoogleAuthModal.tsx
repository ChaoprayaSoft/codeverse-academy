'use client';

import React, { useEffect, useRef } from 'react';
import { useAuthProgress } from '@/context/AuthProgressContext';
import { CLIENT_ID } from '@/lib/constants';
import { X, Sparkles } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleAuthModal({ isOpen, onClose }: GoogleAuthModalProps) {
  const { loginWithGoogleToken } = useAuthProgress();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Load Google GSI Script if not loaded
    if (!window.google && !document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogle();
      document.body.appendChild(script);
    } else if (window.google) {
      initGoogle();
    }

    function initGoogle() {
      if (!window.google || !googleBtnRef.current) return;

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response: any) => {
          if (!response.credential) return;

          // Decode JWT payload
          const base64Url = response.credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);

          await loginWithGoogleToken(response.credential, payload);
          onClose();
        },
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'filled_blue',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 280,
      });
    }
  }, [isOpen, loginWithGoogleToken, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#0f172a] border border-indigo-500/40 shadow-[0_0_60px_rgba(99,102,241,0.25)] text-center text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
          <Sparkles size={32} />
        </div>

        <h2 className="text-2xl font-black mb-2 tracking-tight">
          Join <span className="text-gradient">CodeVerse</span>
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Sign in with your Google Account to save mission progress, earn cadet ranks, and collect space badges.
        </p>

        <div className="flex justify-center my-6 min-h-[44px]">
          <div ref={googleBtnRef} />
        </div>

        <div className="text-xs text-slate-500">
          By signing in, you agree to academy flight protocols &amp; mission safety guidelines.
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    google?: any;
  }
}
