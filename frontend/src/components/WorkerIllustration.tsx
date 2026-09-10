"use client";

import Image from "next/image";

/**
 * Real photographs of service workers for the hero section.
 * Clean photos with NO text overlays — hidden on mobile, visible on desktop+tablet.
 */
const workers = [
  {
    src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop&auto=format&q=80",
    alt: "Professional service worker",
  },
  {
    src: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=400&fit=crop&auto=format&q=80",
    alt: "Skilled tradesperson at work",
  },
  {
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop&auto=format&q=80",
    alt: "Worker in professional setting",
  },
  {
    src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&auto=format&q=80",
    alt: "Technician with tools",
  },
];

export default function WorkerIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:max-w-lg animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      {/* Ambient glow behind photos */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,58,237,0.12)_0%,transparent_70%)] scale-125 blur-2xl" />

      {/* Clean 2×2 photo grid — no text overlays */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {workers.map((worker, i) => (
          <div
            key={i}
            className="relative group rounded-2xl overflow-hidden aspect-square border border-border hover:border-brand-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.12)]"
          >
            <Image
              src={worker.src}
              alt={worker.alt}
              width={400}
              height={400}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="eager"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
