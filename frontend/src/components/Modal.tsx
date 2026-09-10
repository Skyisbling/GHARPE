"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = "" };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm sm:max-w-md",
    md: "max-w-[calc(100vw-2rem)] sm:max-w-lg",
    lg: "max-w-[calc(100vw-2rem)] sm:max-w-2xl",
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`bg-surface-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[92vh] sm:max-h-[90vh] overflow-y-auto animate-scale-in`}>
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border sticky top-0 bg-surface-card z-10">
          <h2 className="text-lg sm:text-xl font-bold text-ink truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-ink-muted hover:text-ink transition-colors cursor-pointer shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}
