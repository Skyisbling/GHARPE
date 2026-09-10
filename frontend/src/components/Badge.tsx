import { CheckCircle, AlertCircle, Info } from "lucide-react";

interface BadgeProps {
  variant?: "success" | "warning" | "info" | "neutral" | "verified";
  children: React.ReactNode;
  icon?: boolean;
  className?: string;
}

export default function Badge({ variant = "neutral", children, icon = false, className = "" }: BadgeProps) {
  const variants = {
    success: "bg-accent-green/10 text-accent-green border border-accent-green/20",
    warning: "bg-accent-orange/10 text-accent-orange border border-accent-orange/20",
    info: "bg-accent-blue/10 text-accent-blue border border-accent-blue/20",
    neutral: "bg-white/5 text-ink-secondary border border-border",
    verified: "bg-accent-green/10 text-accent-green border border-accent-green/20",
  };

  const icons = {
    success: <CheckCircle size={12} />,
    warning: <AlertCircle size={12} />,
    info: <Info size={12} />,
    neutral: null,
    verified: <CheckCircle size={12} />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full ${variants[variant]} ${className}`}>
      {icon && icons[variant]}
      {children}
    </span>
  );
}
