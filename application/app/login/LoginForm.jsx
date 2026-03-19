"use client"
import DotLoader from "../../components/DotLoader"
import { signIn } from "next-auth/react"
import Image from "next/image"
import React, { useState } from "react"

const Login = () => {
  const [error, setError] = useState(null)
  const [load, setLoad] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoad(true)


    const form = e.currentTarget
    console.log(form)
    const res = await signIn("credentials", {
      email: form.email.value,
      password: form.password.value,
      redirect: false,
      callbackUrl: "/",
    })

    if (res?.error) {
      setError("Invalid credentials entered")
      setLoad(false)
    } else {
      setLoad(false)
      window.location.href = res?.url ?? "/"
    }
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
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob" />
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-cyan-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-4000" />
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500">
                  not harder.
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                The intelligent hub for your lab outputs and project reports. Fast, reliable, and tailored entirely for students.
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
              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-4 rounded-[2rem] shadow-sm border border-white/60">
                <Image src="/mitsprint.png" alt="M" width={48} height={48} className="rounded-xl shadow-sm" />
                <div className="w-[2px] h-10 bg-slate-300" />
                <Image src="/college_logo.png" alt="College" width={120} height={40} className="object-contain" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 text-center">
                MITS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">PRINT</span>
              </h1>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_16px_60px_rgb(0,0,0,0.1)] hover:-translate-y-1 relative overflow-hidden group">

              {/* Decorative inner glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl -mx-24 -my-24 transition-all duration-700 group-hover:scale-150 group-hover:from-purple-400/30 group-hover:to-blue-400/30 pointer-events-none" />

              <div className="relative z-10">
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Welcome back</h2>
                  <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">College Email</label>
                    <div className="relative">
                      <input
                        name="email"
                        required
                        type="email"
                        placeholder="admno@mgits.ac.in"
                        className="w-full bg-white/60 hover:bg-white/80 border border-slate-200/80 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 outline-none transition-all duration-300 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-white/60 hover:bg-white/80 border border-slate-200/80 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 outline-none transition-all duration-300 font-medium"
                      />
                    </div>
                  </div>

                  <div className="h-6 -my-2 flex items-center">
                    {error && (
                      <div className="flex items-center gap-2 text-red-500 animate-in fade-in slide-in-from-top-1 ml-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={load}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-4 font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] shadow-xl shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed group/btn hover:shadow-slate-900/30"
                  >
                    {load ? (
                      <DotLoader />
                    ) : (
                      <>
                        Sign In
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
