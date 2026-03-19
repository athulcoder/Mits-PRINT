"use client"
import DotLoader from "../../components/DotLoader"
import { signIn } from "next-auth/react"
import Image from "next/image"
import React, { useState } from "react"

const Login = () => {
  const [load, setLoad] = useState(false)

  async function handleGoogleLogin() {
    setLoad(true)
    await signIn("google", { callbackUrl: "/" })
  }

  return (
    <>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      <section className="relative w-full min-h-screen overflow-hidden bg-slate-50 flex items-center justify-center font-sans">
        {/* Animated background gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-slate-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-4000" />
        </div>

        {/* Ambient grid overlay */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-16 px-6 py-12">

          {/* Left Branding Side */}
          <div className="hidden lg:flex flex-col items-start w-1/2 space-y-10 pr-10">
            <div className="flex items-center gap-5 bg-white/50 backdrop-blur-md p-5 rounded-[2rem] shadow-sm border border-white/60">
              <Image src="/mitsprint.png" alt="MITS Print" width={64} height={64} className="rounded-2xl shadow-sm" />
              <div className="w-[2px] h-14 bg-slate-300/80 rounded-full" />
              <Image src="/college_logo.png" alt="College Logo" width={160} height={50} className="object-contain" />
            </div>

            <div className="space-y-6 text-slate-800">
              <h1 className="text-6xl font-extrabold tracking-tight leading-[1.1]">
                Print smarter, <br />
                <span className="text-red-600">
                  MITS <span className="text-slate-900">PRINT</span>
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                The intelligent hub for your lab outputs and project reports. Exclusively for Muthoot Institute of Technology and Science.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-slate-500 bg-white/40 backdrop-blur-sm py-2 px-4 rounded-full border border-white/50">
              <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
              Systems Operational
            </div>
          </div>

          {/* Right Login Card Side */}
          <div className="w-full max-w-[440px] lg:w-1/2">
            {/* Mobile Branding (shows only on small screens) */}
            <div className="lg:hidden flex flex-col items-center justify-center mb-10 space-y-6">
              <div className="flex flex-col items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-6 rounded-[2rem] shadow-sm border border-white/60">
                <div className="flex items-center gap-4">
                  <Image src="/mitsprint.png" alt="M" width={48} height={48} className="rounded-xl shadow-sm" />
                  <div className="w-[2px] h-10 bg-slate-300" />
                  <Image src="/college_logo.png" alt="College" width={120} height={40} className="object-contain" />
                </div>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-red-600 text-center">
                MITS <span className="text-slate-900">PRINT</span>
              </h1>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/80 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_16px_60px_rgb(0,0,0,0.1)] hover:-translate-y-1 relative overflow-hidden group">
              
              {/* Decorative inner glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-red-400/10 to-transparent rounded-full blur-3xl -mx-24 -my-24 transition-all duration-700 group-hover:scale-150 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                
                <div className="mb-10 text-center w-full">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Welcome back</h2>
                  <div className="bg-red-50/80 text-red-700 border border-red-100 rounded-xl p-4 mb-3 shadow-sm">
                    <p className="text-sm font-semibold flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Requires @mgits.ac.in Domain
                    </p>
                  </div>
                  <p className="text-slate-500 font-medium">Sign in with your college account to continue to MITS Print.</p>
                </div>

                <div className="w-full space-y-4">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={load}
                    className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl py-4 font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed group/btn"
                  >
                    {load ? (
                      <DotLoader />
                    ) : (
                      <>
                        <svg className="w-6 h-6 group-hover/btn:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
