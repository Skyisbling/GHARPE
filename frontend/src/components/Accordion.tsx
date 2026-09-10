"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-surface-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-all duration-200 cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-ink pr-4 text-sm">{title}</span>
        <ChevronDown
          size={16}
          className={`text-ink-muted transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-brand-400" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 text-ink-secondary text-sm leading-relaxed border-t border-border">
          <div className="pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { title: string; content: ReactNode; id: string }[];
}

export default function Accordion({ items }: AccordionProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <AccordionItem key={item.id} title={item.title}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
