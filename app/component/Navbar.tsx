"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();

  const navLinks = [
    { href: "/resumeoptimizer", label: "Resume Optimizer" },
    { href: "/referalfinder", label: "Referral Finder" },
    { href: "/interview", label: "Interview Guide" },
    ...(isLoggedIn ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <span className="text-xl font-bold tracking-tight">PlacementGo</span>
      </Link>

      <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition ${
              pathname === link.href
                ? "text-blue-600 font-semibold"
                : "hover:text-blue-600"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className="text-sm font-semibold hover:text-blue-600 transition">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-200 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-semibold hover:text-blue-600 transition">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Start Free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}