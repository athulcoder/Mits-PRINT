"use client";
import { LuLogOut } from "react-icons/lu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { CiMenuBurger } from "react-icons/ci";
import { TfiClose } from "react-icons/tfi";
import Image from "next/image";
import { navItems } from "../constants/navItem";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[70px]">

          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              <span className="text-red-600">MITS</span> <span className="text-slate-900">PRINT</span>
            </h1>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(({ label, url, icon: Icon }) => (
              <Link key={label} href={url} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors group">
                <Icon size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                {label}
              </Link>
            ))}
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
            {status === "loading" ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
            ) : session?.user ? (
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">

                {/* Name & Email (Always visible now) */}
                <div className="flex flex-col items-end max-w-[110px] sm:max-w-none">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight truncate w-full text-right">
                    {session.user.name ?? "User"}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wide truncate w-full text-right">
                    {session.user.email}
                  </p>
                </div>

                {/* Profile Pic */}
                <div className="shrink-0">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profile"}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm ring-1 ring-red-100">
                      {session.user.name?.[0] || "U"}
                    </div>
                  )}
                </div>

                <div className="w-[1px] h-8 bg-gray-200 hidden sm:block mx-1" />

                {/* Logout Button (Desktop Only) */}
                <button
                  onClick={() => signOut()}
                  className="hidden sm:flex items-center justify-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all focus:outline-none shrink-0"
                  title="Logout"
                >
                  <LuLogOut size={22} />
                </button>
              </div>
            ) : null}
          </div>

        </div>
      </div>

      {/* Mobile Nav Links - horizontally scrollable for very small screens */}
      <div className="sm:hidden border-t border-gray-100 bg-gray-50/50 px-4 py-3 overflow-x-auto hide-scrollbar">
        <ul className="flex items-center gap-6 min-w-max">
          {navItems.map(({ label, url, icon: Icon }) => (
            <li key={label}>
              <Link href={url} className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-green-600 transition-colors">
                <Icon size={16} className="text-green-500" />
                {label}
              </Link>
            </li>
          ))}

          {/* Mobile Logout Button in Subnav */}
          {session?.user && (
            <li>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-green-600 transition-colors focus:outline-none"
              >
                <LuLogOut size={16} className="text-green-500" />
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Custom styles to hide scrollbar in mobile nav */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
