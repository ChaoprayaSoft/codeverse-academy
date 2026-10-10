'use client';

import React from 'react';

export default function SpaceBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#070a13]">
      {/* Dynamic Nebulae */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/10 blur-[140px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[40%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-purple-600/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: '2.5s' }} />

      {/* Grid Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  );
}
