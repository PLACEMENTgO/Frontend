"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  userEmail: string | null;
  login: (token: string, userId: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userId: null,
  token: null,
  userEmail: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("userId");
    const e = localStorage.getItem("userEmail");
    if (t) setToken(t);
    if (u) setUserId(u);
    if (e) setUserEmail(e);
  }, []);

  const login = (t: string, u: string, email: string) => {
    localStorage.setItem("token", t);
    localStorage.setItem("userId", u);
    localStorage.setItem("userEmail", email);
    setToken(t);
    setUserId(u);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUserId(null);
    setUserEmail(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, userId, token, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
