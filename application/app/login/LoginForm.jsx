"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";

const Login = () => {
  const [load, setLoad] = useState(false);

  async function handleGoogleLogin() {
    setLoad(true);
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] selection:bg-red-100 selection:text-red-900 font-sans px-4 overflow-hidden">
      
      {/* Big SaaS Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[600px] h-[500px] bg-slate-300/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Login Card - Mobile First, Beautiful Border Box */}
      <div className="relative z-10 w-full max-w-[420px] bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-8 sm:p-12 mb-10 transform transition-all hover:shadow-[0_16px_60px_rgb(0,0,0,0.06)]">
        
        {/* Subtle top inner highlight for depth */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

        <div className="flex flex-col items-center text-center space-y-9 relative z-10">
          
          {/* Logos Aligned Nicely */}
          <div className="flex items-center gap-4 bg-white shadow-sm border border-slate-100 px-4 py-3 rounded-2xl transform transition hover:scale-105 duration-300">
            <Image src="/mitsprint.png" alt="MITS Logo" width={46} height={46} className="rounded-[10px]" />
            <div className="w-[1.5px] h-9 bg-slate-100" />
            <Image src="/college_logo.png" alt="College Logo" width={115} height={35} className="object-contain" />
          </div>

          {/* Texts & Taglines */}
          <div className="space-y-4">
            {/* Tagline Badge */}
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-900 shadow-sm">
              <span className="text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                Make the queue in online
              </span>
            </div>
            
            <h1 className="text-[2.5rem] sm:text-5xl font-extrabold tracking-tight leading-none text-slate-900">
              <span className="text-red-600">MITS</span> PRINT
            </h1>
            
            <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-[280px] mx-auto">
              A better way to take lab outputs and project reports print
            </p>
          </div>

          {/* Domain Alert block (optional but nice) */}
          <div className="w-full flex justify-center">
             <div className="w-fit flex items-center gap-1.5 px-3 py-1 bg-red-50/80 border border-red-100 rounded-lg text-red-600 font-semibold text-xs transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
               Requires @mgits.ac.in
             </div>
          </div>

          {/* Action Button with Cool Click Animation */}
          <div className="w-full pt-2">
            <button
              onClick={handleGoogleLogin}
              disabled={load}
              className={`relative w-full overflow-hidden flex items-center justify-center h-[56px] rounded-[1.25rem] font-bold text-base transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                load 
                  ? "bg-slate-50 border-2 border-slate-100 text-transparent cursor-wait scale-[0.97]" 
                  : "bg-white text-slate-700 border-2 border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 shadow-sm hover:shadow-md active:scale-[0.95] group/btn"
              }`}
            >
              {/* Button Text & Icon (Fades out seamlessly on load) */}
              <div className={`absolute inset-0 flex items-center justify-center gap-3 w-full h-full transition-all duration-500 ${load ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <svg className="w-[22px] h-[22px] group-hover/btn:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </div>

              {/* Loading Spinner (Fades in seamlessly on load) */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${load ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                 <svg className="animate-spin h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              </div>

            </button>
          </div>

        </div>
      </div>

      {/* Corporate Copyright Footer */}
      <div className="absolute xl:fixed bottom-6 w-full text-center px-4">
        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
           © Copyright Muthoot Institute of Technology and Science
        </p>
      </div>

    </div>
  );
};

export default Login;
