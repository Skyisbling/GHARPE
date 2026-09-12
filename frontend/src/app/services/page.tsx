"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Shield,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Star,
  X,
  RefreshCw,
} from "lucide-react";

import Badge from "@/components/Badge";
import RatingStars from "@/components/RatingStars";
import {
  serviceCategories,
  cooperatives,
  workers as localWorkers,
  reviews,
  type Worker,
} from "@/data/workers";
import { StaggerReveal } from "@/hooks/useScrollReveal";

const API_URL = "http://127.0.0.1:5000";

type SortOption = "recommended" | "rating" | "experience" | "price";

function normalizeWorker(worker: Partial<Worker>): Worker | null {
  if (!worker.id || !worker.name || !worker.category) {
    return null;
  }

  return {
    id: String(worker.id),
    name: String(worker.name),
    category: String(worker.category),
    skills: Array.isArray(worker.skills)
      ? worker.skills.map(String)
      : [],
    rating: Number(worker.rating) || 0,
    reviewCount: Number(worker.reviewCount) || 0,
    yearsExperience: Number(worker.yearsExperience) || 0,
    cooperativeId: String(worker.cooperativeId || ""),
    location: String(worker.location || "Location not provided"),
    startingPrice: Number(worker.startingPrice) || 0,
    verified: Boolean(worker.verified),
    emergencyAvailable: Boolean(worker.emergencyAvailable),
    availableDays: Array.isArray(worker.availableDays)
      ? worker.availableDays.map(String)
      : [],
    bio: String(worker.bio || ""),
    certifications: Array.isArray(worker.certifications)
      ? worker.certifications.map(String)
      : [],
    avatarInitials: String(
      worker.avatarInitials ||
        worker.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
    ),
    phone: String(worker.phone || ""),
  };
}

function mergeWorkers(apiWorkers: unknown): Worker[] {
  const merged = new Map<string, Worker>();

  // Always start with local workers.
  localWorkers.forEach((worker) => {
    merged.set(worker.id, worker);
  });

  // API workers override matching local workers
  // but do not remove local workers that aren't returned.
  if (Array.isArray(apiWorkers)) {
    apiWorkers.forEach((rawWorker) => {
      const normalized = normalizeWorker(rawWorker as Partial<Worker>);

      if (normalized) {
        merged.set(normalized.id, normalized);
      }
    });
  }

  return Array.from(merged.values());
}

function WorkerCard({
  worker,
  onView,
}: {
  worker: Worker;
  onView: (worker: Worker) => void;
}) {
  const coop = cooperatives.find(
    (cooperative) => cooperative.id === worker.cooperativeId
  );

  const category = serviceCategories.find(
    (categoryItem) => categoryItem.id === worker.category
  );

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
            {category?.label ?? worker.category}
          </div>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-muted flex-wrap">
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

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border gap-3">
        <div className="min-w-0">
          {coop && (
            <span className="text-xs text-ink-muted flex items-center gap-1 truncate">
              <Shield size={12} className="text-brand-400 shrink-0" />
              {coop.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <RatingStars rating={worker.rating} size={12} />

          <span className="text-xs text-ink-muted">
            ({worker.reviewCount})
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        {worker.phone ? (
          <a href={`tel:${worker.phone}`} className="flex-1">
            <span className="inline-flex items-center justify-center gap-2 w-full px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 gradient-brand text-white hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] cursor-pointer min-h-[36px]">
              <Phone size={14} />
              Call Now
            </span>
          </a>
        ) : (
          <button
            disabled
            className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/5 text-ink-muted cursor-not-allowed min-h-[36px]"
          >
            <Phone size={14} />
            No phone
          </button>
        )}

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
  const coop = cooperatives.find(
    (cooperative) => cooperative.id === worker.cooperativeId
  );

  const category = serviceCategories.find(
    (categoryItem) => categoryItem.id === worker.category
  );

  const workerReviews = reviews.filter(
    (review) => review.workerId === worker.id
  );

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
              <h2 className="text-2xl font-bold text-ink">
                {worker.name}
              </h2>

              {worker.verified && (
                <Badge variant="verified" icon>
                  Verified
                </Badge>
              )}
            </div>

            <p className="text-ink-secondary mb-2">
              {category?.label ?? worker.category}
            </p>

            <div className="flex items-center gap-4 text-sm text-ink-muted mb-3 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {worker.location}
              </span>

              <span>
                {worker.yearsExperience} years experience
              </span>

              {worker.emergencyAvailable && (
                <Badge variant="warning" icon>
                  <Clock size={12} />
                  Emergency Available
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <RatingStars
                rating={worker.rating}
                size={16}
                showValue
              />

              <span className="text-sm text-ink-muted">
                ({worker.reviewCount} reviews)
              </span>
            </div>

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

            {worker.phone ? (
              <a href={`tel:${worker.phone}`}>
                <span className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 gradient-brand text-white glow-purple-strong hover:shadow-[0_0_50px_rgba(124,58,237,0.4)] cursor-pointer min-h-[48px]">
                  <Phone size={18} />
                  Call Now
                </span>
              </a>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl bg-white/5 text-ink-muted min-h-[48px]">
                <Phone size={18} />
                No phone available
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-ink mb-3">
          About
        </h3>

        <p className="text-sm text-ink-secondary leading-relaxed">
          {worker.bio || "No description available."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-ink mb-3">
            Skills
          </h3>

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

      <div className="bg-surface-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-ink">
              Customer Reviews
            </h3>

            <p className="text-sm text-ink-muted mt-1">
              Reviews from the cooperative community
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Star
              size={16}
              className="text-accent-orange fill-current"
            />

            <span className="font-bold text-ink">
              {worker.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {workerReviews.length > 0 ? (
          <div className="space-y-4">
            {workerReviews.map((review) => (
              <div
                key={review.id}
                className="border-t border-border pt-4 first:border-t-0 first:pt-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-sm text-ink">
                      {review.author}
                    </div>

                    <div className="text-xs text-ink-muted mt-0.5">
                      {review.location} · {review.date}
                    </div>
                  </div>

                  <RatingStars
                    rating={review.rating}
                    size={12}
                  />
                </div>

                <p className="text-sm text-ink-secondary leading-relaxed mt-3">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-ink-muted">
              No detailed reviews available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [viewingWorker, setViewingWorker] =
    useState<Worker | null>(null);

  const [workers, setWorkers] =
    useState<Worker[]>(localWorkers);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [sortBy, setSortBy] =
    useState<SortOption>("recommended");

  const [emergencyOnly, setEmergencyOnly] =
    useState(false);

  const [showFilters, setShowFilters] =
    useState(false);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setApiError(null);

      const response = await fetch(
        `${API_URL}/api/workers`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      /*
       * IMPORTANT:
       * Do not replace localWorkers with API data.
       *
       * If the backend only returns some workers,
       * the remaining local workers must still appear.
       */
      const mergedWorkers = mergeWorkers(data);

      setWorkers(mergedWorkers);
    } catch (error) {
      console.error(
        "Failed to fetch workers:",
        error
      );

      /*
       * Keep local workers visible even when
       * backend is unavailable.
       */
      setWorkers(localWorkers);

      setApiError(
        "Live server unavailable. Showing available workers from the local directory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const locations = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(
        workers
          .map((worker) => worker.location)
          .filter(Boolean)
      )
    );

    return uniqueLocations.sort();
  }, [workers]);

  const filteredWorkers = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = workers.filter((worker) => {
      const matchesSearch =
        !query ||
        worker.name.toLowerCase().includes(query) ||
        worker.location.toLowerCase().includes(query) ||
        worker.category.toLowerCase().includes(query) ||
        worker.skills.some((skill) =>
          skill.toLowerCase().includes(query)
        );

      const matchesCategory =
        category === "all" ||
        worker.category === category;

      const matchesLocation =
        location === "all" ||
        worker.location === location;

      const matchesEmergency =
        !emergencyOnly ||
        worker.emergencyAvailable;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesEmergency
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;

        case "experience":
          return (
            b.yearsExperience -
            a.yearsExperience
          );

        case "price":
          return (
            a.startingPrice -
            b.startingPrice
          );

        case "recommended":
        default:
          if (a.verified !== b.verified) {
            return a.verified ? -1 : 1;
          }

          return b.rating - a.rating;
      }
    });
  }, [
    workers,
    search,
    category,
    location,
    emergencyOnly,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setLocation("all");
    setEmergencyOnly(false);
    setSortBy("recommended");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "all" ||
    location !== "all" ||
    emergencyOnly ||
    sortBy !== "recommended";

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
      {/* ───────────────── HEADER ───────────────── */}
      <section className="relative overflow-hidden py-10 md:py-14">
        <div className="absolute inset-0 bg-[#08090D]" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-ink">
            Find a Verified Worker
          </h1>

          <p className="text-ink-secondary max-w-xl">
            Browse cooperative-verified professionals
            for all your household and institutional
            needs.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-alt to-transparent" />
      </section>

      {/* ───────────────── SEARCH & FILTERS ───────────────── */}
      <section className="py-6 bg-surface-alt border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search workers, skills, services, or locations..."
                className="w-full bg-surface-card border border-border rounded-xl pl-11 pr-10 py-3 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-brand-500/50 transition-colors"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() =>
                setShowFilters((value) => !value)
              }
              className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface-card text-sm font-semibold text-ink"
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>

            {/* Desktop category */}
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="hidden lg:block bg-surface-card border border-border rounded-xl px-4 py-3 text-sm text-ink outline-none focus:border-brand-500/50"
            >
              <option value="all">
                All Services
              </option>

              {serviceCategories.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </option>
              ))}
            </select>

            {/* Desktop location */}
            <select
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              className="hidden lg:block bg-surface-card border border-border rounded-xl px-4 py-3 text-sm text-ink outline-none focus:border-brand-500/50 max-w-[220px]"
            >
              <option value="all">
                All Locations
              </option>

              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as SortOption
                )
              }
              className="bg-surface-card border border-border rounded-xl px-4 py-3 text-sm text-ink outline-none focus:border-brand-500/50"
            >
              <option value="recommended">
                Recommended
              </option>
              <option value="rating">
                Highest Rated
              </option>
              <option value="experience">
                Most Experienced
              </option>
              <option value="price">
                Lowest Price
              </option>
            </select>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="bg-surface-card border border-border rounded-xl px-4 py-3 text-sm text-ink outline-none"
              >
                <option value="all">
                  All Services
                </option>

                {serviceCategories.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.label}
                  </option>
                ))}
              </select>

              <select
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                className="bg-surface-card border border-border rounded-xl px-4 py-3 text-sm text-ink outline-none"
              >
                <option value="all">
                  All Locations
                </option>

                {locations.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Emergency + clear */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={() =>
                setEmergencyOnly(
                  (value) => !value
                )
              }
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                emergencyOnly
                  ? "bg-accent-pink/10 border-accent-pink/30 text-accent-pink"
                  : "bg-surface-card border-border text-ink-secondary hover:text-ink"
              }`}
            >
              <Clock size={14} />
              Emergency Available
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
              >
                <X size={14} />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ───────────────── WORKERS ───────────────── */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* API status */}
          {apiError && (
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-accent-orange/20 bg-accent-orange/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">
                  {apiError}
                </p>

                <p className="text-xs text-ink-muted mt-1">
                  The page is still usable. You can retry
                  the live server connection anytime.
                </p>
              </div>

              <button
                onClick={fetchWorkers}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-card border border-border text-xs font-semibold text-ink hover:border-brand-500/30 transition-colors"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-sm text-ink-secondary">
                Showing{" "}
                <strong className="text-ink">
                  {filteredWorkers.length}
                </strong>{" "}
                of{" "}
                <strong className="text-ink">
                  {workers.length}
                </strong>{" "}
                workers
              </p>

              {loading && (
                <p className="text-xs text-ink-muted mt-1">
                  Checking for latest worker data...
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Shield
                size={14}
                className="text-brand-400"
              />
              Cooperative verified directory
            </div>
          </div>

          {/* No results */}
          {filteredWorkers.length === 0 ? (
            <div className="py-20 text-center bg-surface-card border border-border rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                <Search
                  size={24}
                  className="text-brand-400"
                />
              </div>

              <h2 className="text-lg font-semibold text-ink">
                No workers found
              </h2>

              <p className="text-sm text-ink-muted mt-2 max-w-md mx-auto">
                Try changing your search, service category,
                location, or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 px-5 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWorkers.map((worker) => (
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
        </div>
      </section>
    </>
  );
}