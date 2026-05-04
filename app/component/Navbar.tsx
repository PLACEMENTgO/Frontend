"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { getUnreadCount } from "../../services/autoapply.service";
import UpgradeModal, { useSubscription } from "./UpgradeModal";
import { Router } from "next/router";

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, logout, userEmail } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { status: subStatus, refresh: refreshSub } = useSubscription();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    getUnreadCount()
      .then(setNotifCount)
      .catch(() => {});
    const interval = setInterval(() => {
      getUnreadCount()
        .then(setNotifCount)
        .catch(() => {});
    }, 60_000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const navLinks = [
    { href: "/resumeoptimizer", label: "Resume Optimizer" },
    { href: "/referalfinder", label: "Referral Finder" },
    { href: "/interview", label: "Interview Guide" },
    { href: "/autoapply", label: "Job Automation" },
    ...(isLoggedIn ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  const isDark = resolvedTheme === "dark";

  const initials = userEmail
    ? userEmail
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <nav className="relative bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              PlacementGo
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  pathname === link.href
                    ? "text-blue-600 font-semibold"
                    : "hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Toggle theme"
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
            )}

            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {/* Notification bell */}
                  <Link
                    href="/autoapply"
                    className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    aria-label="Job Automation notifications"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {notifCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold leading-none">
                        {notifCount > 9 ? "9+" : notifCount}
                      </span>
                    )}
                  </Link>

                  {/* PRO badge (only shown when premium, no upgrade button) */}
                  {subStatus.isPremium ? (
                    <span className="inline-flex items-center gap-1.5 bg-amber-400/10 dark:bg-amber-400/15 border border-amber-400/50 dark:border-amber-400/30 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wide px-3 py-1.5 rounded-full select-none">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      PRO
                    </span>
                  ) : (
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <Link
                        href={"/subscription"}
                        onClick={() => {
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all duration-150"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        Upgrade to PRO
                      </Link>
                    </div>
                  )}

                  {/* Profile avatar + dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen((o) => !o)}
                      aria-label="Open profile menu"
                      aria-expanded={profileOpen}
                      className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-150 flex items-center justify-center text-white text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 select-none"
                    >
                      {initials}
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              {userEmail && (
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                  {userEmail}
                                </p>
                              )}
                              {subStatus.isPremium ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                  <svg
                                    width="9"
                                    height="9"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                  </svg>
                                  PRO Member
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                  Free Plan
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Upgrade nudge (only for free users) */}
                        {!subStatus.isPremium && (
                          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                            <Link
                              href="/subscription"
                              onClick={() => {
                                setProfileOpen(false);
                              }}
                              className="w-full flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all duration-150"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                              </svg>
                              Upgrade to PRO
                            </Link>
                          </div>
                        )}

                        {/* Menu items */}
                        <div className="py-1">
                          <Link
                            href="/settings"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="3" />
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                            Settings
                          </Link>

                          <button
                            onClick={() => {
                              logout();
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
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

            {/* Hamburger (mobile) */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
              {isLoggedIn ? (
                <>
                  {/* User info row */}
                  <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      {userEmail && (
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {userEmail}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {subStatus.isPremium ? "Pro Member" : "Free Plan"}
                      </p>
                    </div>
                    {subStatus.isPremium && (
                      <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-full">
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        PRO
                      </span>
                    )}
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition text-center"
                  >
                    Start Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={() => {
          refreshSub();
          setShowUpgradeModal(false);
        }}
      />
    </>
  );
}
