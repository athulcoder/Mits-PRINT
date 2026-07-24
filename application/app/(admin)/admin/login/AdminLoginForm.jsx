'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate/Handle admin login process
      if (!email || !password) {
        setError('Please enter both email and password.');
        setLoading(false);
        return;
      }

      // Navigate to admin dashboard on success
      setTimeout(() => {
        setLoading(false);
        router.push('/admin/dash');
      }, 600);
    } catch (err) {
      console.error(err);
      setError('An error occurred during login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#ECEFFB] p-4 sm:p-6 md:p-10 font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-3xl p-7 sm:p-11 shadow-2xl shadow-indigo-100/80 border border-slate-100/80 my-auto">
        
        {/* Brand Logo from Public Folder */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 relative flex-shrink-0">
            <Image
              src="/mitsprint.png"
              alt="MITS Print Logo"
              width={48}
              height={48}
              className="object-contain rounded-xl"
              priority
            />
          </div>
          <div className="h-7 w-[1.5px] bg-slate-200" />
          <div className="h-8 relative w-32 flex-shrink-0">
            <Image
              src="/college_logo.png"
              alt="College Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome back !
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal">
            Enter to get unlimited access to data & information.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your mail address"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-sm sm:text-base transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3.5 pr-12 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-sm sm:text-base transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-500" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between pt-1 text-sm flex-wrap gap-3">
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-900 font-semibold select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
              }}
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Forgot your password ?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] text-white font-semibold text-base rounded-2xl shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-8"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            <span>Log In</span>
          </button>
        </form>
      </div>
    </div>
  );
}
