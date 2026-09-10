"use client";

import Link from "next/link";
import {
  Zap, Droplets, Hammer, Paintbrush, Home as HomeIcon, Heart, Car, Leaf, Sparkles, Wrench,
  Search, CalendarCheck, UserCheck, CreditCard,
  Shield, HandCoins, BadgeCheck, Tag, MapPin,
  ArrowRight, AlertTriangle, Clock, Building2, Users, TrendingUp, Star,
  CheckCircle, ChevronRight, Quote,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import RatingStars from "@/components/RatingStars";
import { serviceCategories, testimonials } from "@/data/workers";
import { Reveal, StaggerReveal } from "@/hooks/useScrollReveal";
import RobotAssistant from "@/components/RobotAssistant";
import WorkerIllustration from "@/components/WorkerIllustration";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Zap, Droplets, Hammer, Paintbrush, "Home": HomeIcon, Heart, Car, Leaf, Sparkles, Wrench,
};

// ── Hero ──
function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden min-h-[80vh] sm:min-h-[90vh] flex items-center">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#08090D]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(124,58,237,0.12)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(181,108,255,0.06)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(85,184,255,0.04)_0%,transparent_60%)]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="max-w-4xl">
          <Badge variant="info" className="mb-6 !bg-brand-500/10 !text-brand-300 border-brand-500/20">
            {t("hero.badge")}
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
            <span className="text-ink">{t("hero.title1")}</span>
            <br />
            <span className="shimmer-text">{t("hero.title2")}</span>
          </h1>

          <p className="text-lg md:text-xl text-ink-secondary mb-10 max-w-2xl leading-relaxed">
            GharPe connects you with cooperative-verified professionals — electricians, plumbers, carpenters, caregivers, and more. Every worker is insured, skilled, and fairly compensated through India&apos;s Labour Cooperative Federations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/services">
              <Button variant="glow" size="lg" className="w-full sm:w-auto">
                {t("hero.cta1")} <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/register?tab=worker">
              <Button variant="outline" size="lg" className="w-full sm:w-auto !border-border hover:!border-brand-500/40">
                {t("hero.cta2")} <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-6 mt-12 text-sm text-ink-muted">
            <span className="flex items-center gap-2"><Shield size={16} className="text-accent-green" /> Multi-Level Verified</span>
            <span className="flex items-center gap-2"><BadgeCheck size={16} className="text-brand-400" /> Insurance-Backed</span>
            <span className="flex items-center gap-2"><HandCoins size={16} className="text-accent-orange" /> Fair Wage Guaranteed</span>
          </div>
        </div>
        {/* Right side: Worker illustration — hidden on mobile, visible on tablet+ */}
        <div className="hidden md:flex justify-center items-center">
          <WorkerIllustration />
        </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-alt to-transparent" />
    </section>
  );
}

// ── Marquee Bar ──
function FloatingBar() {
  const items = [
    "Verified Cooperative Workers", "Fair Wages Guaranteed", "Insurance-Backed Services",
    "Community Trust", "Transparent Pricing", "24/7 Emergency Support",
    "Cooperative Owned", "Professionally Trained", "ID Verified", "Background Checked",
  ];
  const duplicated = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-4 bg-surface-alt border-y border-border">
      <div className="marquee-track">
        {duplicated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6 text-sm font-medium text-ink-secondary whitespace-nowrap">
            <span className="w-1 h-1 rounded-full bg-brand-500 shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Trust Strip ──
function TrustStrip() {
  const stats = [
    { value: "500+", label: "Verified Workers", color: "text-brand-400" },
    { value: "50+", label: "Cooperative Societies", color: "text-accent-blue" },
    { value: "10,000+", label: "Services Completed", color: "text-accent-green" },
    { value: "4.7★", label: "Average Rating", color: "text-accent-orange" },
  ];

  return (
    <section className="bg-surface-alt border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-ink-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

// ── Popular Categories ──
function CategoriesSection() {
  const { t } = useLanguage();
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,58,237,0.06)_0%,transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <Badge variant="neutral" className="mb-4">Services</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-4 tracking-tight">{t("categories.title")}</h2>
            <p className="text-ink-secondary max-w-2xl mx-auto text-lg">
              Browse verified professionals across a wide range of household and institutional services
            </p>
          </div>
        </Reveal>
        <StaggerReveal className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {serviceCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Wrench;
            return (
              <Link key={cat.id} href={`/services?category=${cat.id}`}>
                <div className="group bg-surface-card border border-border rounded-2xl p-5 text-center hover:border-brand-500/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-500/20 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300">
                    <Icon size={24} className="text-brand-400" />
                  </div>
                  <h3 className="font-semibold text-sm text-ink">{cat.label}</h3>
                  <p className="text-xs text-ink-muted mt-1 line-clamp-2">{cat.description}</p>
                </div>
              </Link>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}

// ── Why Choose Us ──
function WhyChooseUs() {
  const { t } = useLanguage();
  const features = [
    { icon: Shield, title: "Multi-Level Verification", desc: "Every worker is verified through their cooperative federation — ID check, skill assessment, and background verification.", color: "text-brand-400", glow: "shadow-brand-500/10" },
    { icon: HandCoins, title: "Fair Wages for Workers", desc: "Our cooperative model ensures workers earn significantly more than typical gig platform rates. No exploitation.", color: "text-accent-green", glow: "shadow-accent-green/10" },
    { icon: BadgeCheck, title: "Insurance-Backed Workers", desc: "All registered workers are covered under cooperative insurance and welfare schemes at no extra cost.", color: "text-accent-blue", glow: "shadow-accent-blue/10" },
    { icon: Tag, title: "Transparent Pricing", desc: "No hidden charges. See estimated costs before booking with rates set cooperatively for fairness.", color: "text-accent-orange", glow: "shadow-accent-orange/10" },
    { icon: MapPin, title: "Local Cooperative Presence", desc: "Workers are from your local area, vetted by cooperative societies you can trust and know.", color: "text-accent-pink", glow: "shadow-accent-pink/10" },
    { icon: Users, title: "Community-Driven", desc: "Built by the cooperative movement, for the cooperative movement. Every decision prioritizes worker and customer welfare.", color: "text-accent-violet", glow: "shadow-accent-violet/10" },
  ];

  return (
    <section className="py-20 bg-surface-alt relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(124,58,237,0.05)_0%,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <Badge variant="neutral" className="mb-4">Why GharPe</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-4 tracking-tight">{t("why.title")}</h2>
            <p className="text-ink-secondary max-w-2xl mx-auto text-lg">
              A cooperative platform built on trust, fairness, and community — where every worker is a stakeholder, not just a contractor.
            </p>
          </div>
        </Reveal>
        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => (
            <div key={feat.title} className="bg-surface-card border border-border rounded-2xl p-6 hover:border-brand-500/20 transition-all duration-300">
              <div className={`w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4`}>
                <feat.icon size={22} className={feat.color} />
              </div>
              <h3 className="text-base font-bold text-ink mb-2">{feat.title}</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

// ── How It Works ──
function HowItWorks() {
  const { t } = useLanguage();
  const steps = [
    { icon: Search, title: "Search", desc: "Find the service you need from our verified worker directory. Filter by skill, location, and rating." },
    { icon: CalendarCheck, title: "Book", desc: "Choose your preferred date, time, and describe the job. Get upfront pricing before confirming." },
    { icon: UserCheck, title: "Worker Arrives", desc: "A cooperative-verified professional arrives at your doorstep, insured and equipped." },
    { icon: CreditCard, title: "Pay & Rate", desc: "Pay securely through UPI, card, or cash. Rate the service to help the community." },
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(85,184,255,0.05)_0%,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <Badge variant="neutral" className="mb-4">Process</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-4 tracking-tight">How It Works</h2>
            <p className="text-ink-secondary text-lg">Simple, transparent, and trustworthy — in four easy steps</p>
          </div>
        </Reveal>
        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div key={step.title} className="relative text-center">
              {idx < 3 && (
                <div className="hidden lg:block absolute top-10 left-[55%] w-[90%] border-t border-dashed border-border" />
              )}
              <div className="relative z-10 w-14 h-14 rounded-2xl gradient-brand text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-500/20">
                <step.icon size={24} />
              </div>
              <div className="absolute -top-1 right-[calc(50%-32px)] w-6 h-6 rounded-full bg-surface-card border border-border text-brand-400 text-xs font-bold flex items-center justify-center z-20">
                {idx + 1}
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

// ── Who We Serve ──
function WhoWeServe() {
  const { t } = useLanguage();
  const audiences = [
    { icon: HomeIcon, title: "Households", desc: "From minor repairs to deep cleaning, find trusted cooperative workers for every home need.", color: "text-brand-400" },
    { icon: Building2, title: "Institutions", desc: "Offices, schools, hospitals — bulk service contracts with cooperative societies for ongoing maintenance.", color: "text-accent-blue" },
    { icon: Heart, title: "Elderly & Patients", desc: "Compassionate caregivers and patient support workers from verified cooperative backgrounds.", color: "text-accent-pink" },
    { icon: TrendingUp, title: "Cooperative Workers", desc: "Join the digital economy while retaining cooperative benefits — insurance, fair wages, and dignity.", color: "text-accent-green" },
  ];

  return (
    <section className="py-20 bg-surface-alt relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(124,58,237,0.05)_0%,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <Badge variant="neutral" className="mb-4">For Everyone</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-4 tracking-tight">Who We Serve</h2>
            <p className="text-ink-secondary max-w-2xl mx-auto text-lg">
              Whether you&apos;re a household, an institution, or a skilled worker — GharPe is built for you.
            </p>
          </div>
        </Reveal>
        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {audiences.map((a) => (
            <div key={a.title} className="bg-surface-card border border-border rounded-2xl p-6 text-center hover:border-brand-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                <a.icon size={24} className={a.color} />
              </div>
              <h3 className="text-base font-bold text-ink mb-2">{a.title}</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

// ── Impact Numbers ──
function ImpactNumbers() {
  const stats = [
    { value: "₹2.5 Cr+", label: "Fair Wages Distributed", color: "text-accent-green" },
    { value: "₹50 Lakhs", label: "Insurance Coverage", color: "text-accent-blue" },
    { value: "90,000+", label: "Cooperative Societies in India", color: "text-brand-400" },
    { value: "98%", label: "Customer Satisfaction", color: "text-accent-orange" },
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,rgba(124,58,237,0.08)_0%,transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <Badge variant="neutral" className="mb-4">Impact</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-4 tracking-tight">Numbers That Matter</h2>
            <p className="text-ink-secondary text-lg">Real impact on real lives through the cooperative model</p>
          </div>
        </Reveal>
        <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface-card border border-border rounded-2xl p-6 text-center hover:border-brand-500/20 transition-all duration-300">
              <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-sm text-ink-secondary">{stat.label}</div>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

// ── Testimonials ──
function TestimonialsSection() {
  return (
    <section className="py-20 bg-surface-alt relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(181,108,255,0.05)_0%,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <Badge variant="neutral" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-4 tracking-tight">What Our Community Says</h2>
            <p className="text-ink-secondary text-lg">Real stories from workers and customers in the cooperative network</p>
          </div>
        </Reveal>
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-surface-card border border-border rounded-2xl p-6 flex flex-col hover:border-brand-500/20 transition-all duration-300">
              <Quote size={24} className="text-brand-500/30 mb-3" />
              <p className="text-sm text-ink-secondary leading-relaxed flex-1 mb-4">&ldquo;{t.text}&rdquo;</p>
              <RatingStars rating={t.rating} size={12} className="mb-3" />
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-brand-500/15 flex items-center justify-center text-brand-300 font-bold text-xs">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{t.name}</div>
                  <div className="text-xs text-ink-muted">{t.location} · {t.role === "worker" ? "Worker" : "Customer"}</div>
                </div>
              </div>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

// ── Emergency Banner ──
function EmergencyBanner() {
  const { t } = useLanguage();
  return (
    <Reveal>
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-surface-card border border-border p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(255,92,138,0.08)_0%,transparent_60%)]" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-pink/10 flex items-center justify-center shrink-0 animate-pulse">
                  <AlertTriangle size={24} className="text-accent-pink" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-ink">{t("emergency.title")}</h3>
                  <p className="text-ink-secondary text-sm">Book an on-demand emergency service. Verified workers available 24/7.</p>
                </div>
              </div>
              <Link href="/services?emergency=true">
                <Button variant="primary" size="lg" className="shrink-0">
                  <Clock size={18} /> Book Emergency Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

// ── Cooperative Model ──
function CooperativeModel() {
  const chain = [
    { step: "Federations", desc: "Set standards and welfare policies" },
    { step: "Societies", desc: "Recruit and manage local workers" },
    { step: "Verified Workers", desc: "Multi-level verified professionals" },
    { step: "You", desc: "Book with confidence" },
  ];

  return (
    <section className="py-20 bg-surface-alt relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(124,58,237,0.05)_0%,transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <Badge variant="neutral" className="mb-4">Cooperative Model</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-4 tracking-tight">How the Cooperative Chain Works</h2>
            <p className="text-ink-secondary max-w-2xl mx-auto text-lg">
              A structured, accountable system — not a loose collection of anonymous freelancers
            </p>
          </div>
        </Reveal>
        <StaggerReveal className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 max-w-4xl mx-auto">
          {chain.map((item, idx) => (
            <div key={item.step} className="flex items-center gap-4">
              <div className="bg-surface-card border border-border rounded-2xl p-5 text-center w-48 hover:border-brand-500/30 transition-all duration-300">
                <div className="text-xs font-bold text-brand-400 mb-1">Step {idx + 1}</div>
                <h3 className="text-base font-bold text-ink">{item.step}</h3>
                <p className="text-xs text-ink-muted mt-1">{item.desc}</p>
              </div>
              {idx < chain.length - 1 && (
                <ChevronRight size={20} className="text-brand-500/40 shrink-0 hidden md:block" />
              )}
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

// ── CTA ──
function FinalCTA() {
  const { t } = useLanguage();
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-bold text-ink mb-4 tracking-tight">{t("cta.title")}</h2>
          <p className="text-ink-secondary max-w-xl mx-auto mb-10 text-lg">
            Whether you need a skilled professional or want to join our cooperative network, GharPe is here for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/services">
              <Button variant="glow" size="lg" className="w-full sm:w-auto">
                Book a Service <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/register?tab=worker">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Join as a Worker <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-ink-muted">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-accent-green" /> No signup fees</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-accent-green" /> Cancel anytime</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-accent-green" /> 24/7 support</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Home Page ──
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FloatingBar />
      <TrustStrip />
      <CategoriesSection />
      <WhyChooseUs />
      <HowItWorks />
      <WhoWeServe />
      <ImpactNumbers />
      <CooperativeModel />
      <TestimonialsSection />
      <EmergencyBanner />
      <FinalCTA />
      <RobotAssistant />
    </>
  );
}
