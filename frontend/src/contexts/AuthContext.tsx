"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  /** Where to redirect after login (e.g. /services) */
  redirectTo: string | null;
  setRedirectTo: (url: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectTo, setRedirectToState] = useState<string | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gharpe-auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser({ name: parsed.name, email: parsed.email });
        }
      }
    } catch {
      // corrupted data — ignore
    }
    setIsLoading(false);
  }, []);

  /** Mock login — accepts any email + password ≥ 6 chars */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    if (!email || !password || password.length < 6) return false;

    const newUser: User = {
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
    };

    setUser(newUser);
    localStorage.setItem("gharpe-auth", JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("gharpe-auth");
  }, []);

  const setRedirectTo = useCallback((url: string | null) => {
    setRedirectToState(url);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, redirectTo, setRedirectTo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
