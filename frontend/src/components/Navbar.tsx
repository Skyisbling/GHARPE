"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Settings, Menu, X, Sun, Moon, Globe, LogIn, LogOut, ChevronDown, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { user, logout, setRedirectTo } = useAuth();
  const settingsRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services"), authRequired: true },
    { href: "/register", label: t("nav.register") },
    { href: "/help", label: t("nav.help") },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === lang);

  useEffect(() => { setMobileOpen(false); setSettingsOpen(false); }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleServicesClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setRedirectTo("/services");
      router.push("/login");
    }
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    if (pathname === "/services") {
      router.push("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-40 glass" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="GharPe Home">
            <Image src="/logo-v2.png" alt="GharPe" width={40} height={40} className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover" priority />
            <span className="hidden sm:inline text-xl font-bold text-ink group-hover:text-brand-400 transition-colors">
              Ghar<span className="text-brand-400">Pe</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={link.authRequired ? handleServicesClick : undefined}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-brand-500/15 text-brand-300 shadow-[0_0_12px_rgba(124,58,237,0.1)]"
                    : "text-ink-secondary hover:text-ink hover:bg-white/[0.04]"
                }`}
              >{link.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div ref={settingsRef} className="relative">
              <button onClick={() => { setSettingsOpen(!settingsOpen); setLangOpen(false); }}
                className="p-2 rounded-xl hover:bg-white/[0.05] text-ink-secondary hover:text-ink transition-colors cursor-pointer"
                aria-label={t("nav.settings")} aria-expanded={settingsOpen}>
                <Settings size={18} />
              </button>

              {settingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-64 max-w-[16rem] bg-surface-card border border-border rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {theme === "dark" ? <Moon size={16} className="text-brand-400" /> : <Sun size={16} className="text-accent-orange" />}
                        <span className="text-sm font-medium text-ink">{t("nav.darkMode")}</span>
                      </div>
                      <button onClick={toggleTheme}
                        className={`relative inline-flex items-center rounded-full transition-colors duration-200 cursor-pointer ${
                          theme === "dark" ? "bg-brand-400" : "bg-border"
                        }`}
                        style={{ width: '28px', height: '14px', minHeight: '14px' }}
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
                        <span className={`inline-block h-2 w-2 rounded-full bg-white shadow-sm transition-transform duration-200 ${theme === "dark" ? "translate-x-[14px]" : "translate-x-[3px]"}`} />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-b border-border">
                    <button onClick={() => setLangOpen(!langOpen)} className="w-full flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Globe size={16} className="text-ink-muted" />
                        <span className="text-sm font-medium text-ink">{t("nav.language")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-ink-muted">{currentLang?.nativeLabel}</span>
                        <ChevronDown size={14} className={`text-ink-muted transition-transform ${langOpen ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                    {langOpen && (
                      <div className="mt-2 space-y-1">
                        {LANGUAGES.map((l) => (
                          <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                              lang === l.code ? "bg-brand-500/15 text-brand-300 font-medium" : "text-ink-secondary hover:bg-white/[0.04]"
                            }`}>
                            {l.nativeLabel} <span className="text-xs text-ink-muted ml-1">({l.label})</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* User info when logged in */}
                  {user && (
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-500/15 flex items-center justify-center">
                          <User size={14} className="text-brand-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-ink truncate">{user.name}</div>
                          <div className="text-xs text-ink-muted truncate">{user.email}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {user ? (
              <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={handleLogout} icon={<LogOut size={16} />}>
                Logout
              </Button>
            ) : (
              <Link href="/login" className="hidden md:inline-flex">
                <Button variant="ghost" size="sm" icon={<LogIn size={16} />}>{t("nav.login")}</Button>
              </Link>
            )}

            <Link
              href={user ? "/services" : "/login"}
              onClick={!user ? (e) => { e.preventDefault(); setRedirectTo("/services"); router.push("/login"); } : undefined}
              className="hidden md:inline-flex"
            >
              <Button variant="primary" size="sm">{t("nav.book")}</Button>
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)}                className="md:hidden p-2 rounded-xl hover:bg-white/[0.05] text-ink-secondary cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border glass animate-fade-in-up max-h-[calc(100vh-4rem)] overflow-y-auto" style={{ animationDuration: "0.3s" }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={link.authRequired ? handleServicesClick : undefined}
                className={`block px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                  pathname === link.href ? "bg-brand-500/15 text-brand-300" : "text-ink-secondary hover:bg-white/[0.04]"
                }`}>{link.label}</Link>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-brand-500/10 rounded-xl">
                  <User size={16} className="text-brand-400" />
                  <span className="text-sm font-medium text-ink truncate">{user.name}</span>
                </div>
                <Button variant="danger" className="w-full" onClick={handleLogout} icon={<LogOut size={16} />}>Logout</Button>
              </>
            ) : (
              <Link href="/login" className="block">
                <Button variant="primary" className="w-full" icon={<LogIn size={16} />}>{t("nav.login")}</Button>
              </Link>
            )}
            <Link href={user ? "/services" : "/login"}
              onClick={!user ? (e) => { e.preventDefault(); setRedirectTo("/services"); router.push("/login"); } : undefined}
              className="block">
              <Button variant="outline" className="w-full">{t("nav.book")}</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
