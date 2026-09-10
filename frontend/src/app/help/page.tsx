"use client";

import { useState, useMemo, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail, MessageSquare, AlertCircle, Search,
  ChevronDown, CheckCircle, Shield, Heart, X,
} from "lucide-react";
import Button from "@/components/Button";
import { AccordionItem } from "@/components/Accordion";
import FormInput, { FormSelect, FormTextarea } from "@/components/FormInput";
import { faqs } from "@/data/workers";
import { SUPPORT_FLOWS, MAIN_MENU, type FlowOption } from "@/data/supportFlows";
import { Reveal, StaggerReveal } from "@/hooks/useScrollReveal";


function FAQSection() {
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const categories = useMemo(() => [...new Set(faqs.map((f) => f.category))], []);

  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return faqs;
    const q = search.toLowerCase();
    return faqs.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
  }, [search]);

  const groupedFaqs = useMemo(() => {
    const groups: Record<string, typeof faqs> = {};
    filteredBySearch.forEach((f) => { if (!groups[f.category]) groups[f.category] = []; groups[f.category].push(f); });
    return groups;
  }, [filteredBySearch]);

  const toggleCategory = (cat: string) => setOpenCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);

  return (
    <div>
      <div className="relative mb-6">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search frequently asked questions..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-surface-muted text-ink text-sm placeholder-ink-muted focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all duration-200" />
      </div>
      {Object.keys(groupedFaqs).length === 0 ? (
        <div className="bg-surface-card border border-border rounded-2xl p-8 text-center">
          <Search size={32} className="text-ink-muted mx-auto mb-3" />
          <h3 className="text-lg font-bold text-ink mb-1">No results found</h3>
          <p className="text-sm text-ink-secondary">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFaqs).map(([category, items]) => (
            <div key={category}>
              <button onClick={() => toggleCategory(category)} className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-card hover:bg-white/[0.02] border border-border transition-colors cursor-pointer mb-2">
                <h3 className="font-semibold text-ink">{category}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-muted bg-white/5 rounded-full px-2 py-0.5">{items.length}</span>
                  <ChevronDown size={18} className={`text-ink-muted transition-transform ${openCategories.includes(category) || search ? "rotate-180" : ""}`} />
                </div>
              </button>
              {(openCategories.includes(category) || search) && <div className="space-y-2">{items.map((faq) => (<AccordionItem key={faq.id} title={faq.question}><p>{faq.answer}</p></AccordionItem>))}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactOptions({ onOpenComplaint, onOpenChat }: { onOpenComplaint: () => void; onOpenChat: () => void }) {
  const options = [
    { icon: Mail, title: "Email Support", desc: "Response within 24 hours", detail: "gharpe.help@gmail.com", color: "text-accent-green", action: undefined },
    { icon: MessageSquare, title: "Live Chat", desc: "Chat with our support team", detail: "Start Chat", color: "text-brand-400", action: onOpenChat },
    { icon: AlertCircle, title: "Raise a Complaint", desc: "Report issues with bookings", detail: "File Complaint", color: "text-accent-orange", action: onOpenComplaint },
  ];

  return (
    <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((opt) => (
        <div key={opt.title} className="bg-surface-card border border-border rounded-2xl p-5 hover:border-brand-500/20 transition-all duration-300 cursor-pointer" onClick={opt.action}>
          <div className={`w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-3`}><opt.icon size={20} className={opt.color} /></div>
          <h3 className="font-semibold text-ink mb-1">{opt.title}</h3>
          <p className="text-sm text-ink-secondary mb-2">{opt.desc}</p>
          <p className={`text-sm font-medium ${opt.color}`}>{opt.detail}</p>
        </div>
      ))}
    </StaggerReveal>
  );
}

function ComplaintForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", bookingId: "", category: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); await new Promise((r) => setTimeout(r, 1500)); setLoading(false); setSubmitted(true); };

  if (submitted) return (
    <div className="text-center py-8">
      <CheckCircle size={40} className="text-brand-400 mx-auto mb-3" />
      <h3 className="text-xl font-bold text-ink mb-2">Complaint Submitted</h3>
      <p className="text-sm text-ink-secondary mb-4">Our team will review and respond within 48 hours.</p>
      <p className="text-xs text-ink-muted">Ref: CMP-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
      <Button onClick={onClose} className="mt-6" variant="primary">Close</Button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput label="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" required />
      <FormInput label="Booking ID" value={form.bookingId} onChange={(e) => setForm({ ...form, bookingId: e.target.value })} placeholder="e.g., GP-A3B2C1" />
      <FormSelect label="Issue Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={[{value:"service-quality",label:"Service Quality"},{value:"worker-conduct",label:"Worker Conduct"},{value:"pricing",label:"Pricing Dispute"},{value:"safety",label:"Safety Concern"},{value:"cancellation",label:"Cancellation/Refund"},{value:"other",label:"Other"}]} placeholder="Select category" required />
      <FormTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue..." required />
      <Button type="submit" loading={loading} className="w-full" disabled={!form.name || !form.category || !form.description}>Submit Complaint</Button>
    </form>
  );
}

type ChatMsg = { from: "bot" | "user"; text: string; options?: { label: string; action: () => void }[] };

const WELCOME_MSG: ChatMsg = {
  from: "bot",
  text: "Hi! 👋 Welcome to GharPe Support.\n\nI'm here to help you find services, manage bookings, understand payments, resolve account issues and more.\n\nWhat can I help you with?",
};

function ChatWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [history, setHistory] = useState<string[]>([]); // stack of flow IDs for back navigation
  const [typing, setTyping] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ ...WELCOME_MSG, options: buildMainMenu() }]);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Flow navigation ──
  const goToFlow = useCallback((flowId: string) => {
    const flow = SUPPORT_FLOWS[flowId];
    if (!flow) return;
    setHistory((h) => [...h, flowId]);
    const step = flow.steps[0];
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: step.message, options: buildFlowOptions(step.options) }]);
      setTyping(false);
    }, 400);
  }, []);

  const goBack = useCallback(() => {
    setHistory((h) => {
      const newH = [...h];
      newH.pop(); // remove current
      const prevId = newH[newH.length - 1];
      if (prevId) {
        const flow = SUPPORT_FLOWS[prevId];
        if (flow) {
          const step = flow.steps[0];
          setTyping(true);
          setTimeout(() => {
            setMessages((prev) => [...prev, { from: "bot", text: step.message, options: buildFlowOptions(step.options) }]);
            setTyping(false);
          }, 400);
        }
      } else {
        // Back to main menu
        setTyping(true);
        setTimeout(() => {
          setMessages((prev) => [...prev, { ...WELCOME_MSG, options: buildMainMenu() }]);
          setTyping(false);
        }, 400);
      }
      return newH;
    });
  }, []);

  const goMainMenu = useCallback(() => {
    setHistory([]);
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { ...WELCOME_MSG, options: buildMainMenu() }]);
      setTyping(false);
    }, 400);
  }, []);

  const handleNav = useCallback((path: string) => {
    if (path.startsWith("mailto:") || path.startsWith("tel:")) {
      window.location.href = path;
    } else {
      onClose();
      router.push(path);
    }
  }, [onClose, router]);

  // ── Build option buttons with actions ──
  function buildFlowOptions(opts: FlowOption[]): ChatMsg["options"] {
    return opts.map((o) => ({
      label: o.label,
      action: () => {
        if (o.action.type === "navigate") handleNav(o.action.path);
        else if (o.action.type === "flow") goToFlow(o.action.id);
        else if (o.action.type === "mainMenu") goMainMenu();
        else if (o.action.type === "back") goBack();
      },
    }));
  }

  function buildMainMenu(): ChatMsg["options"] {
    return MAIN_MENU.map((o) => ({
      label: o.label,
      action: () => {
        if (o.action.type === "flow") goToFlow(o.action.id);
      },
    }));
  }

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 w-auto sm:w-96 bg-surface-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="gradient-brand text-white p-3 sm:p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><MessageSquare size={18} /><span className="font-semibold text-sm">GharPe Support</span></div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg cursor-pointer" aria-label="Close chat"><X size={16} /></button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-white/70">How can we help you today?</span>
          <span className="text-[10px] text-green-300 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 h-72 sm:h-80 overflow-y-auto p-3 space-y-3 bg-surface-alt">
        {messages.map((msg, i) => (
          <div key={i} className="flex justify-start">
            <div className="max-w-[90%] space-y-2">
              <div className="bg-surface-card border border-border text-ink text-sm rounded-2xl rounded-bl-md px-4 py-3 whitespace-pre-line leading-relaxed">{msg.text}</div>
              {msg.options && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.options.map((opt, j) => (
                    <button
                      key={j}
                      onClick={opt.action}
                      className="px-3 py-1.5 text-xs font-medium rounded-full border border-brand-400/30 text-brand-400 hover:bg-brand-400/10 hover:border-brand-400/50 transition-all cursor-pointer whitespace-nowrap"
                    >{opt.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-surface-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-ink-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-ink-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-ink-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border shrink-0 flex items-center justify-between">
        <button onClick={goMainMenu} className="text-[11px] text-brand-400 hover:text-brand-300 cursor-pointer flex items-center gap-1">🏠 Main Menu</button>
        <span className="text-[10px] text-ink-muted">Powered by GharPe</span>
      </div>
    </div>
  );
}

function WorkerWelfare() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0"><Shield size={24} className="text-brand-400" /></div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-ink mb-2">Worker Welfare & Insurance</h3>
          <p className="text-sm text-ink-secondary leading-relaxed">Every worker on GharPe is covered under the cooperative&apos;s welfare scheme — accident insurance, health coverage, and workmen&apos;s compensation.</p>
          <button onClick={() => setExpanded(!expanded)} className="mt-3 flex items-center gap-1 text-sm font-medium text-brand-400 hover:text-brand-300 cursor-pointer">
            Learn More <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          {expanded && (
            <div className="mt-4 space-y-3 text-sm text-ink-secondary leading-relaxed border-t border-border pt-4">
              <div className="flex items-start gap-3"><Heart size={16} className="text-accent-pink mt-0.5 shrink-0" /><div><strong className="text-ink">Accident Insurance:</strong> Coverage up to ₹5 lakhs for work-related accidents.</div></div>
              <div className="flex items-start gap-3"><Heart size={16} className="text-accent-pink mt-0.5 shrink-0" /><div><strong className="text-ink">Health Coverage:</strong> Annual insurance covering hospitalization and preventive checkups for worker and family.</div></div>
              <div className="flex items-start gap-3"><Heart size={16} className="text-accent-pink mt-0.5 shrink-0" /><div><strong className="text-ink">Workmen&apos;s Compensation:</strong> Compensation for workplace injuries, managed by the cooperative.</div></div>
              <p className="text-ink-muted text-xs mt-2">*Coverage varies by federation. Contact your society for details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HelpPageContent() {
  const searchParams = useSearchParams();
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(() => searchParams.get("chat") === "1");

  return (
    <>
      <section className="relative overflow-hidden py-10 md:py-14">
        <div className="absolute inset-0 bg-[#08090D]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight"><span className="text-ink">Help </span><span className="shimmer-text">& Support</span></h1>
          <p className="text-ink-secondary max-w-xl mx-auto">Find answers to common questions or reach out to our support team</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-alt to-transparent" />
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <Reveal><div><h2 className="text-2xl font-bold text-ink mb-6">Contact Options</h2><ContactOptions onOpenComplaint={() => setComplaintOpen(true)} onOpenChat={() => setChatOpen(true)} /></div></Reveal>
          <Reveal><div><h2 className="text-2xl font-bold text-ink mb-6">Frequently Asked Questions</h2><FAQSection /></div></Reveal>
          <Reveal><WorkerWelfare /></Reveal>
        </div>
      </section>

      {complaintOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md" onClick={(e) => { if (e.target === e.currentTarget) setComplaintOpen(false); }}>
          <div className="bg-surface-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border sticky top-0 bg-surface-card z-10"><h2 className="text-lg sm:text-xl font-bold text-ink">Raise a Complaint</h2><button onClick={() => setComplaintOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-ink-muted hover:text-ink cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Close"><X size={20} /></button></div>
            <div className="p-4 sm:p-5"><ComplaintForm onClose={() => setComplaintOpen(false)} /></div>
          </div>
        </div>
      )}
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

export default function HelpPage() {
  return (
    <Suspense fallback={null}>
      <HelpPageContent />
    </Suspense>
  );
}
