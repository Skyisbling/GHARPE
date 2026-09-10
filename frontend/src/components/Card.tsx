import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = "", hover = false, glass = false, glow = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-300 ${
        glass
          ? "glass"
          : "bg-surface-card border border-border"
      } ${
        hover
          ? "hover:border-brand-500/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] cursor-pointer hover:-translate-y-1"
          : ""
      } ${
        glow ? "glow-purple" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
