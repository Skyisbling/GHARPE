"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/Button";

function LoginPageContent() {
  const { user, login, redirectTo, setRedirectTo } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      const dest = redirectTo || searchParams.get("redirect") || "/services";
      setRedirectTo(null);
      router.replace(dest);
    }
  }, [user, redirectTo, searchParams, router, setRedirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      const dest = redirectTo || searchParams.get("redirect") || "/services";
      setRedirectTo(null);
      router.replace(dest);
    } else {
      setError("Invalid credentials. Try any email with 6+ character password.");
    }
  };

  // Don't render if already logged in (prevents flash)
  if (user) return null;

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center py-12">
      <div className="absolute inset-0 bg-[#08090D]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />

      <div className="relative w-full max-w-md mx-auto px-4 z-10">
        <div className="bg-surface-card border border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-brand text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
              <LogIn size={24} />
            </div>
            <h1 className="text-2xl font-bold text-ink mb-2">Welcome Back</h1>
            <p className="text-sm text-ink-secondary">Sign in to access GharPe services</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink-secondary">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface-muted text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink-secondary">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-surface-muted text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-ink-secondary">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Register
              </Link>
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-ink-muted text-center">
              Demo: use any email and a password with 6+ characters
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
