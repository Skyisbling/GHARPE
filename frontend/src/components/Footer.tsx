"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function FacebookIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>; }
function TwitterIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }
function InstagramIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>; }
function LinkedinIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>; }

const socialLinks = [
  { href: "#", label: "Facebook", Icon: FacebookIcon },
  { href: "#", label: "Twitter", Icon: TwitterIcon },
  { href: "#", label: "Instagram", Icon: InstagramIcon },
  { href: "#", label: "LinkedIn", Icon: LinkedinIcon },
];

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/register", label: t("nav.register") },
    { href: "/help", label: t("nav.help") },
  ];

  const emailPlaceholder = t("footer.emailPlaceholder");

  return (
    <footer className="bg-surface-alt border-t border-border mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo-v2.png" alt="GharPe" width={36} height={36} className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-cover" />
              <span className="text-base sm:text-lg font-bold text-ink">Ghar<span className="text-brand-400">Pe</span></span>
            </Link>
            <p className="text-sm text-ink-secondary leading-relaxed">{t("footer.desc")}</p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} aria-label={social.label}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] border border-border flex items-center justify-center text-ink-muted hover:text-brand-400 hover:border-brand-500/30 hover:bg-brand-500/10 transition-all duration-200">
                  <social.Icon />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-ink-secondary hover:text-brand-400 transition-colors duration-200">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-ink-secondary">
                <Mail size={16} className="mt-0.5 text-brand-400 shrink-0" />
                <div><div className="font-medium text-ink">gharpe.help@gmail.com</div><div className="text-xs text-ink-muted">{t("footer.response")}</div></div>
              </li>
              <li className="flex items-start gap-3 text-sm text-ink-secondary">
                <MapPin size={16} className="mt-0.5 text-brand-400 shrink-0" />
                <div><div className="font-medium text-ink">{t("footer.address")}</div><div className="text-xs text-ink-muted">{t("footer.city")}</div></div>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">{t("footer.newsletter")}</h3>
            <p className="text-sm text-ink-secondary mb-4">{t("footer.newsletterDesc")}</p>
            <div className="flex gap-2">
              <input type="email" placeholder={emailPlaceholder}
                className="flex-1 min-w-0 px-3 py-2 text-sm border border-border rounded-xl bg-surface-muted text-ink placeholder-ink-muted focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all duration-200" />
              <button className="gradient-brand px-4 py-2 text-white text-sm font-medium rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all cursor-pointer whitespace-nowrap">
                {t("footer.subscribe")}
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-ink-muted flex items-center gap-2"><Sun size={14} /> / <Moon size={14} /> {t("footer.toggleHint")}</p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-muted">© {new Date().getFullYear()} GharPe — {t("footer.desc").substring(0, 40)}...</p>
          <div className="flex gap-4 text-xs text-ink-muted">
            <a href="#" className="hover:text-brand-400 transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-brand-400 transition-colors">{t("footer.terms")}</a>
            <a href="#" className="hover:text-brand-400 transition-colors">{t("footer.bylaws")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
