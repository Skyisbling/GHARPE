"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Shield,
  ArrowLeft,
} from "lucide-react";

import Badge from "@/components/Badge";
import RatingStars from "@/components/RatingStars";
import {
  serviceCategories,
  cooperatives,
  type Worker,
  reviews,
} from "@/data/workers";
import { Reveal, StaggerReveal } from "@/hooks/useScrollReveal";

const API_URL = "http://127.0.0.1:5000";

type ApiWorker = Worker;

function WorkerCard({
  worker,
  onView,
}: {
  worker: Worker;
  onView: (w: Worker) => void;
}) {
  const coop = cooperatives.find((c) => c.id === worker.cooperativeId);

  const skills = Array.isArray(worker.skills) ? worker.skills : [];

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-5 hover:border-brand-500/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.06)] transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-brand-300">
            {worker.avatarInitials}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onView(worker)}
              className="font-semibold text-ink hover:text-brand-400 transition-colors cursor-pointer text-left"
            >
              {worker.name}
            </button>

            {worker.verified && (
              <Badge variant="verified" icon>
                Verified
              </Badge>
            )}
          </div>

          <div className="text-sm text-ink-secondary mt-0.5">
            {serviceCategories.find((c) => c.id === worker.category)?.label ??
              worker.category}
          </div>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-muted">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {worker.location}
            </span>

            <span>{worker.yearsExperience} yrs exp</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg font-bold text-ink">
            ₹{worker.startingPrice}
          </div>
          <div className="text-xs text-ink-muted">starting</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 text-xs bg-brand-500/10 rounded-full text-ink-secondary border border-brand-500/15"
          >
            {skill}
          </span>
        ))}

        {skills.length > 3 && (
          <span className="px-2 py-0.5 text-xs bg-white/5 rounded-full text-ink-muted">
            +{skills.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          {coop && (
            <span className="text-xs text-ink-muted flex items-center gap-1">
              <Shield size={12} className="text-brand-400" />
              {coop.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <RatingStars rating={worker.rating} size={12} />
          <span className="text-xs text-ink-muted">
            ({worker.reviewCount})
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <a href={`tel:${worker.phone}`} className="flex-1">
          <span className="inline-flex items-center justify-center gap-2 w-full px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 gradient-brand text-white hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] cursor-pointer min-h-[36px]">
            <Phone size={14} />
            Call Now
          </span>
        </a>

        <button
          className="px-3.5 py-2 text-xs font-semibold rounded-xl text-ink-secondary hover:text-ink hover:bg-white/5 transition-all duration-200 cursor-pointer"
          onClick={() => onView(worker)}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

function WorkerProfile({
  worker,
  onBack,
}: {
  worker: Worker;
  onBack: () => void;
}) {
  const coop = cooperatives.find((c) => c.id === worker.cooperativeId);

  const skills = Array.isArray(worker.skills) ? worker.skills : [];
  const certifications = Array.isArray(worker.certifications)
    ? worker.certifications
    : [];
  const availableDays = Array.isArray(worker.availableDays)
    ? worker.availableDays
    : [];

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-ink-secondary hover:text-ink transition-colors cursor-pointer"
      >
        <ArrowLeft size={18} />
        Back to results
      </button>

      <div className="bg-surface-card border border-border rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-brand-300">
              {worker.avatarInitials}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-2xl font-bold text-ink">{worker.name}</h2>

              {worker.verified && (
                <Badge variant="verified" icon>
                  Verified
                </Badge>
              )}
            </div>

            <p className="text-ink-secondary mb-2">
              {serviceCategories.find((c) => c.id === worker.category)
                ?.label ?? worker.category}
            </p>

            <div className="flex items-center gap-4 text-sm text-ink-muted mb-3 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {worker.location}
              </span>

              <span>{worker.yearsExperience} years experience</span>

              {worker.emergencyAvailable && (
                <Badge variant="warning" icon>
                  <Clock size={12} />
                  Emergency Available
                </Badge>
              )}
            </div>

            <RatingStars
              rating={worker.rating}
              size={16}
              showValue
            />

            <span className="text-sm text-ink-muted ml-1">
              ({worker.reviewCount} reviews)
            </span>

            {coop && (
              <div className="mt-2 text-sm text-ink-muted flex items-center gap-1">
                <Shield size={14} className="text-brand-400" />
                {coop.name}
              </div>
            )}
          </div>

          <div className="md:text-right shrink-0">
            <div className="text-3xl font-bold text-ink">
              ₹{worker.startingPrice}
            </div>

            <div className="text-sm text-ink-muted mb-3">
              starting price
            </div>

            <a href={`tel:${worker.phone}`}>
              <span className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 gradient-brand text-white glow-purple-strong hover:shadow-[0_0_50px_rgba(124,58,237,0.4)] cursor-pointer min-h-[48px]">
                <Phone size={18} />
                Call Now
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="bg-surface-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-ink mb-3">About</h3>

        <p className="text-sm text-ink-secondary leading-relaxed">
          {worker.bio || "No description available."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-ink mb-3">Skills</h3>

          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-sm bg-brand-500/10 text-brand-300 rounded-lg border border-brand-500/15"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-ink-muted">
                No skills listed.
              </span>
            )}
          </div>
        </div>

        <div className="bg-surface-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-ink mb-3">
            Certifications
          </h3>

          <ul className="space-y-2">
            {certifications.length > 0 ? (
              certifications.map((certification) => (
                <li
                  key={certification}
                  className="flex items-center gap-2 text-sm text-ink-secondary"
                >
                  <CheckCircle
                    size={14}
                    className="text-accent-green shrink-0"
                  />
                  {certification}
                </li>
              ))
            ) : (
              <li className="text-sm text-ink-muted">
                No certifications listed.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-surface-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-ink mb-3">
          Availability
        </h3>

        <div className="flex flex-wrap gap-2">
          {availableDays.length > 0 ? (
            availableDays.map((day) => (
              <span
                key={day}
                className="px-3 py-1.5 text-sm bg-accent-green/10 text-accent-green rounded-lg border border-accent-green/20"
              >
                {day}
              </span>
            ))
          ) : (
            <span className="text-sm text-ink-muted">
              Availability not provided.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [viewingWorker, setViewingWorker] = useState<Worker | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://127.0.0.1:5000/api/workers"
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch workers: ${response.status}`
          );
        }

        const data = await response.json();

        setWorkers(data);
      } catch (err) {
        console.error("Failed to fetch workers:", err);
        setError(
          "Unable to load workers. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  if (viewingWorker) {
    return (
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <WorkerProfile
            worker={viewingWorker}
            onBack={() => setViewingWorker(null)}
          />
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
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-ink">
            Find a Verified Worker
          </h1>

          <p className="text-ink-secondary max-w-xl">
            Browse cooperative-verified professionals for all your
            household and institutional needs.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-alt to-transparent" />
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading && (
            <div className="py-16 text-center">
              <div className="text-lg font-semibold text-ink">
                Loading workers...
              </div>

              <p className="text-sm text-ink-muted mt-2">
                Fetching verified workers from the server.
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="py-16 text-center">
              <div className="text-lg font-semibold text-ink">
                Could not load workers
              </div>

              <p className="text-sm text-red-400 mt-2">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-5 px-5 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-ink-secondary">
                  <strong className="text-ink">
                    {workers.length}
                  </strong>{" "}
                  verified workers available
                </p>
              </div>

              {workers.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-lg font-semibold text-ink">
                    No workers found
                  </div>

                  <p className="text-sm text-ink-muted mt-2">
                    There are currently no workers available.
                  </p>
                </div>
              ) : (
                <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workers.map((worker) => (
                    <WorkerCard
                      key={worker.id}
                      worker={worker}
                      onView={(selectedWorker) =>
                        setViewingWorker(selectedWorker)
                      }
                    />
                  ))}
                </StaggerReveal>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}