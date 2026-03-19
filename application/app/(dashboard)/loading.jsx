"use client";
import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center px-4 font-sans bg-gray-50/30">
      
      {/* Modern SaaS Loader */}
      <div className="relative flex items-center justify-center">
        {/* Animated glowing backdrop */}
        <div className="absolute w-24 h-24 bg-green-400/20 rounded-full blur-2xl animate-pulse" />
        
        {/* Floating Card */}
        <div className="relative w-20 h-20 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.25rem] flex items-center justify-center border border-gray-100 transform transition-all animate-[bounce_3s_ease-in-out_infinite]">
          {/* Smooth custom spinner */}
          <div className="w-8 h-8 rounded-full border-[3.5px] border-green-50 border-t-green-500 animate-[spin_0.8s_ease-in-out_infinite]" />
        </div>
      </div>
      
      <div className="mt-8 space-y-2 animate-pulse">
        <h3 className="text-[1.1rem] font-bold text-gray-800 tracking-tight">
          Preparing your workspace
        </h3>
        <p className="text-[13px] text-gray-500 font-semibold uppercase tracking-wider">
          Just a moment please...
        </p>
      </div>

    </div>
  );
}