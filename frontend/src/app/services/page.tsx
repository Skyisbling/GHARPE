"use client";

import { useState } from "react";
import {
  MapPin, Clock, Phone,
  CheckCircle, Shield, ArrowLeft,
} from "lucide-react";
import Badge from "@/components/Badge";
import RatingStars from "@/components/RatingStars";
import { workers, serviceCategories, cooperatives, type Worker, reviews } from "@/data/workers";
import { Reveal, StaggerReveal } from "@/hooks/useScrollReveal";

function WorkerCard({ worker, onView }: { worker: Worker; onView: (w: Worker) => void }) {
  const coop = cooperatives.find((c) => c.id === worker.cooperativeId);
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-5 hover:border-brand-500/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.06)] transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-brand-300">{worker.avatarInitials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => onView(worker)} className="font-semibold text-ink hover:text-brand-400 transition-colors cursor-pointer text-left">{worker.name}</button>
            {worker.verified && <Badge variant="verified" icon>Verified</Badge>}
          </div>
          <div className="text-sm text-ink-secondary mt-0.5">{serviceCategories.find((c) => c.id === worker.category)?.label}</div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-muted">
            <span className="flex items-center gap-1"><MapPin size={12} />{worker.location}</span>
            <span>{worker.yearsExperience} yrs exp</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold text-ink">₹{worker.startingPrice}</div>
          <div className="text-xs text-ink-muted">starting</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {worker.skills.slice(0, 3).map((s) => (
          <span key={s} className="px-2 py-0.5 text-xs bg-brand-500/10 rounded-full text-ink-secondary border border-brand-500/15">{s}</span>
        ))}
        {worker.skills.length > 3 && <span className="px-2 py-0.5 text-xs bg-white/5 rounded-full text-ink-muted">+{worker.skills.length - 3}</span>}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          {coop && <span className="text-xs text-ink-muted flex items-center gap-1"><Shield size={12} className="text-brand-400" />{coop.name}</span>}
        </div>
        <div className="flex items-center gap-2">
          <RatingStars rating={worker.rating} size={12} />
          <span className="text-xs text-ink-muted">({worker.reviewCount})</span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <a href={`tel:${worker.phone}`} className="flex-1">
          <span className="inline-flex items-center justify-center gap-2 w-full px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 gradient-brand text-white hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] cursor-pointer min-h-[36px]">
            <Phone size={14} /> Call Now
          </span>
        </a>
        <button className="px-3.5 py-2 text-xs font-semibold rounded-xl text-ink-secondary hover:text-ink hover:bg-white/5 transition-all duration-200 cursor-pointer" onClick={() => onView(worker)}>View Profile</button>
      </div>
    </div>
  );
}

function WorkerProfile({ worker, onBack }: { worker: Worker; onBack: () => void }) {
  const coop = cooperatives.find((c) => c.id === worker.cooperativeId);
  const workerReviews = reviews.filter((r) => r.workerId === worker.id);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-ink-secondary hover:text-ink transition-colors cursor-pointer"><ArrowLeft size={18} /> Back to results</button>
      <div className="bg-surface-card border border-border rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-brand-300">{worker.avatarInitials}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-2xl font-bold text-ink">{worker.name}</h2>
              {worker.verified && <Badge variant="verified" icon>Verified</Badge>}
            </div>
            <p className="text-ink-secondary mb-2">{serviceCategories.find((c) => c.id === worker.category)?.label}</p>
            <div className="flex items-center gap-4 text-sm text-ink-muted mb-3 flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={14} />{worker.location}</span>
              <span>{worker.yearsExperience} years experience</span>
              {worker.emergencyAvailable && <Badge variant="warning" icon><Clock size={12} /> Emergency Available</Badge>}
            </div>
            <RatingStars rating={worker.rating} size={16} showValue />
            <span className="text-sm text-ink-muted ml-1">({worker.reviewCount} reviews)</span>
            {coop && <div className="mt-2 text-sm text-ink-muted flex items-center gap-1"><Shield size={14} className="text-brand-400" /> {coop.name}</div>}
          </div>
          <div className="md:text-right shrink-0">
            <div className="text-3xl font-bold text-ink">₹{worker.startingPrice}</div>
            <div className="text-sm text-ink-muted mb-3">starting price</div>
            <a href={`tel:${worker.phone}`}>
              <span className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 gradient-brand text-white glow-purple-strong hover:shadow-[0_0_50px_rgba(124,58,237,0.4)] cursor-pointer min-h-[48px]">
                <Phone size={18} /> Call Now
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="bg-surface-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-ink mb-3">About</h3>
        <p className="text-sm text-ink-secondary leading-relaxed">{worker.bio}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-ink mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((s) => <span key={s} className="px-3 py-1.5 text-sm bg-brand-500/10 text-brand-300 rounded-lg border border-brand-500/15">{s}</span>)}
          </div>
        </div>
        <div className="bg-surface-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-ink mb-3">Certifications</h3>
          <ul className="space-y-2">
            {worker.certifications.map((c) => <li key={c} className="flex items-center gap-2 text-sm text-ink-secondary"><CheckCircle size={14} className="text-accent-green shrink-0" /> {c}</li>)}
          </ul>
        </div>
      </div>
      <div className="bg-surface-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-ink mb-3">Availability</h3>
        <div className="flex flex-wrap gap-2">
          {worker.availableDays.map((d) => <span key={d} className="px-3 py-1.5 text-sm bg-accent-green/10 text-accent-green rounded-lg border border-accent-green/20">{d}</span>)}
        </div>
      </div>
      {workerReviews.length > 0 && (
        <div className="bg-surface-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-ink mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {workerReviews.map((rev) => (
              <div key={rev.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-ink text-sm">{rev.author}</span>
                  <RatingStars rating={rev.rating} size={12} />
                </div>
                <p className="text-sm text-ink-secondary">{rev.text}</p>
                <span className="text-xs text-ink-muted mt-1 block">{rev.location} · {rev.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  const [viewingWorker, setViewingWorker] = useState<Worker | null>(null);

  if (viewingWorker) {
    return (
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <WorkerProfile worker={viewingWorker} onBack={() => setViewingWorker(null)} />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden py-10 md:py-14">
        <div className="absolute inset-0 bg-[#08090D]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-ink">Find a Verified Worker</h1>
          <p className="text-ink-secondary max-w-xl">Browse cooperative-verified professionals for all your household and institutional needs.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-alt to-transparent" />
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-ink-secondary"><strong className="text-ink">{workers.length}</strong> verified workers available</p>
          </div>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((w) => <WorkerCard key={w.id} worker={w} onView={(worker) => setViewingWorker(worker)} />)}
          </StaggerReveal>
        </div>
      </section>
    </>
  );
}
