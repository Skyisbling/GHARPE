"use client";

import Link from "next/link";
import {
  Target, Eye, UserCheck, ArrowRight,
  TrendingUp, Heart, Shield,
} from "lucide-react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { Reveal, StaggerReveal } from "@/hooks/useScrollReveal";

function MissionVision() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerReveal className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface-card border border-border rounded-2xl p-8 hover:border-brand-500/20 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-5">
              <Target size={28} className="text-brand-400" />
            </div>
            <h2 className="text-2xl font-bold text-ink mb-4">Our Mission</h2>
            <p className="text-ink-secondary leading-relaxed">
              To create a fair, transparent, and dignified marketplace for skilled workers — connecting verified professionals with households and institutions that need their services. We believe every worker deserves fair wages, insurance coverage, and the respect that comes with organized, professional employment.
            </p>
          </div>
          <div className="bg-surface-card border border-border rounded-2xl p-8 hover:border-brand-500/20 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-5">
              <Eye size={28} className="text-brand-400" />
            </div>
            <h2 className="text-2xl font-bold text-ink mb-4">Our Vision</h2>
            <p className="text-ink-secondary leading-relaxed">
              A future where skilled workers are empowered — earning living wages, accessing social security, and delivering quality service. We envision GharPe as the most trusted name in professional services, where community welfare and professional excellence go hand in hand.
            </p>
          </div>
        </StaggerReveal>
      </div>
    </section>
  );
}

function OurStory() {
  return (
    <section className="py-20 bg-surface-alt relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,58,237,0.05)_0%,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="neutral" className="mb-4">Our Story</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-6 tracking-tight">From Cooperative Roots to Digital Future</h2>
            <div className="text-ink-secondary leading-relaxed space-y-4 text-left md:text-center">
              <p>India has millions of skilled workers — electricians, plumbers, carpenters, caregivers, and more — who struggle to find consistent employment, fair pricing, and the recognition they deserve.</p>
              <p>GharPe was born from a simple observation: skilled workers are already verified and capable — but they lack a modern digital platform to connect with demand. By building a technology layer that ensures fairness, accountability, and community welfare, we bring the cooperative spirit into the digital economy.</p>
              <p>Every worker on GharPe is verified through a multi-level process. They are not anonymous gig workers — they are professionals with accountability, insurance, and a commitment to quality service. This is not just a service marketplace. This is a movement towards dignified, fair employment.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


function ImpactNumbers() {
  const stats = [
    { value: "500+", label: "Verified Workers", icon: UserCheck, color: "text-brand-400" },
    { value: "₹2.5 Cr+", label: "Fair Wages Distributed", icon: TrendingUp, color: "text-accent-green" },
    { value: "₹50 Lakhs", label: "Insurance Coverage", icon: Shield, color: "text-accent-blue" },
    { value: "98%", label: "Customer Satisfaction", icon: Heart, color: "text-accent-orange" },
  ];

  return (
    <section className="py-20 bg-surface-alt relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(124,58,237,0.05)_0%,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <Badge variant="neutral" className="mb-4">Impact</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-4 tracking-tight">Our Impact</h2>
            <p className="text-ink-secondary text-lg">Numbers that reflect our commitment to quality and fairness</p>
          </div>
        </Reveal>
        <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface-card border border-border rounded-2xl p-6 text-center hover:border-brand-500/20 transition-all duration-300">
              <stat.icon size={28} className={`${stat.color} mx-auto mb-3`} />
              <div className="text-3xl md:text-4xl font-bold text-ink mb-1">{stat.value}</div>
              <div className="text-sm text-ink-secondary">{stat.label}</div>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

function Leadership() {
  const team = [
    { name: "Bommana Akash Rao", role: "Core & Leader", description: "Leading GharPe's vision and coordinating the team to build a trusted, cooperative service platform for everyone.", initials: "BA" },
    { name: "Sourodeep Saha", role: "Frontend Developer", description: "Designing and developing GharPe's user experience with a focus on clean, responsive, and intuitive interfaces.", initials: "SS" },
    { name: "Misal Kumar", role: "Backend Developer", description: "Building the backend systems and APIs that keep GharPe's platform reliable, secure, and scalable.", initials: "MK" },
    { name: "Debjit Saha", role: "Backend Developer", description: "Working on backend architecture and services to ensure smooth, secure, and efficient platform operations.", initials: "DS" },
    { name: "Aditi Singh", role: "Creative & Design Lead", description: "Shaping GharPe's visual identity and creating simple, engaging experiences that users can trust.", initials: "AS" },
    { name: "Manya Aggarwal", role: "Community & Operations Lead", description: "Helping strengthen the GharPe community and supporting smooth coordination across users, workers, and the team.", initials: "MA" },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <Badge variant="neutral" className="mb-4">Team</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-4 tracking-tight">Meet the Team</h2>
            <p className="text-ink-secondary text-lg">The people building GharPe&apos;s platform</p>
          </div>
        </Reveal>
        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((person) => (
            <div key={person.name} className="bg-surface-card border border-border rounded-2xl p-6 text-center hover:border-brand-500/20 transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-300">{person.initials}</span>
              </div>
              <h3 className="text-lg font-bold text-ink">{person.name}</h3>
              <p className="text-sm font-medium text-brand-400 mb-2">{person.role}</p>
              <p className="text-sm text-ink-secondary leading-relaxed">{person.description}</p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}


function JoinCTA() {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <div className="bg-surface-card border border-border rounded-2xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,58,237,0.08)_0%,transparent_60%)]" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">Ready to Get Started?</h2>
              <p className="text-ink-secondary max-w-2xl mx-auto mb-8 text-lg">
                Join GharPe as a customer or a verified worker. Experience the future of cooperative-powered services.
              </p>
              <Link href="/register">
                <Button variant="glow" size="lg">Get Started <ArrowRight size={18} /></Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[#08090D]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-ink">About </span>
            <span className="shimmer-text">GharPe</span>
          </h1>
          <p className="text-ink-secondary text-lg max-w-2xl mx-auto">
            A platform redefining how skilled workers connect with the people who need them.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-alt to-transparent" />
      </section>
      <MissionVision />
      <OurStory />
      <ImpactNumbers />
      <Leadership />
      <JoinCTA />
    </>
  );
}
