"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glow";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, icon, className = "", children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
      primary: "gradient-brand text-white hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] focus-visible:outline-brand-500",
      secondary: "bg-brand-500/15 text-brand-300 hover:bg-brand-500/25 border border-brand-500/20 focus-visible:outline-brand-500",
      outline: "border border-border text-ink-secondary hover:border-brand-500/50 hover:text-ink hover:bg-brand-500/5 focus-visible:outline-brand-500",
      ghost: "text-ink-secondary hover:text-ink hover:bg-white/5 focus-visible:outline-brand-500",
      danger: "bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 focus-visible:outline-red-500",
      glow: "gradient-brand text-white glow-purple-strong hover:shadow-[0_0_50px_rgba(124,58,237,0.4)] focus-visible:outline-brand-500",
    };

    const sizes = {
      sm: "px-3.5 py-2 text-xs min-h-[36px]",
      md: "px-5 py-2.5 text-sm min-h-[44px]",
      lg: "px-7 py-3.5 text-sm sm:text-base min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon ? icon : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
