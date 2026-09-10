"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { User, Briefcase, MapPin, Upload, CheckCircle, X, Camera, FileText, Clock } from "lucide-react";
import Button from "@/components/Button";
import FormInput, { FormSelect } from "@/components/FormInput";
import { serviceCategories } from "@/data/workers";

type Tab = "customer" | "worker";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "customer", label: "Register as Customer", icon: User },
  { id: "worker", label: "Register as Worker", icon: Briefcase },
];

// ── Skills by profession ──
const skillsByProfession: Record<string, string[]> = {
  electrician: ["Wiring", "Inverter Setup", "MCB Replacement", "LED Installation", "Generator Repair", "Industrial Wiring", "Solar Panel Installation", "CCTV Setup", "Appliance Repair"],
  plumber: ["Pipe Fitting", "Leak Repair", "Bathroom Renovation", "Water Tank Cleaning", "Drainage Repair", "Water Tank Installation", "Pipeline Installation"],
  carpenter: ["Furniture Making", "Kitchen Cabinets", "Door Installation", "Wooden Flooring", "Furniture Repair", "Custom Furniture", "Woodwork", "Shelving"],
  painter: ["Interior Painting", "Exterior Painting", "Texture Work", "Waterproofing", "Wall Treatment", "Paint Consultation"],
  "domestic-help": ["Cooking", "Laundry", "House Cleaning", "Child Care", "Elderly Companion", "Errands", "Kitchen Management"],
  caregiver: ["Elderly Care", "Patient Handling", "Physiotherapy Support", "Medication Management", "Post-Surgery Care", "Night Shift Care"],
  driver: ["Personal Driving", "Long Distance", "Office Commute", "Airport Transfers", "Outstation Trips", "Delivery"],
  gardener: ["Lawn Maintenance", "Landscaping", "Plant Care", "Irrigation Systems", "Vertical Gardens", "Pruning"],
  cleaner: ["Deep Cleaning", "Carpet Cleaning", "Post-Construction Cleanup", "Sanitization", "Office Cleaning", "Window Cleaning", "Sofa & Upholstery"],
  technician: ["AC Repair", "Washing Machine", "Refrigerator", "Geyser Installation", "Microwave Repair", "RO Purifier", "Electrical Appliances"],
};

const professions = serviceCategories.map((c) => ({ value: c.id, label: c.label }));
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayLabels: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
const idTypes = ["Aadhaar Card", "PAN Card", "Voter ID", "Driving Licence", "Passport", "Other Government ID"];
const availabilityTypes = ["Full Time", "Part Time", "On Demand", "Emergency Services"];
const indianStates = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh", "Puducherry", "Andaman & Nicobar", "Dadra & Nagar Haveli", "Lakshadweep"];

// ── Image Upload Component ──
function ImageUpload({ label, accept, preview, onUpload, onRemove, error }: { label: string; accept: string; preview: string | null; onUpload: (file: File) => void; onRemove: () => void; error?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert("File size must be under 5MB"); return; }
      onUpload(file);
    }
  };
  return (
    <div>
      <label className="block text-sm font-medium text-ink-secondary mb-1">{label} <span className="text-accent-pink">*</span></label>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt={label} className="w-24 h-24 rounded-xl object-cover border border-border" />
          <button type="button" onClick={onRemove} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-pink text-white flex items-center justify-center cursor-pointer" aria-label="Remove image"><X size={14} /></button>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-brand-500/30 transition-colors cursor-pointer">
          <Upload size={24} className="text-ink-muted mx-auto mb-2" />
          <p className="text-sm text-ink-secondary">Click to upload or drag and drop</p>
          <p className="text-xs text-ink-muted mt-1">JPG, PNG up to 5MB</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      {error && <p className="text-xs text-accent-pink mt-1">{error}</p>}
    </div>
  );
}

// ── Customer Form (with real geolocation) ──
function CustomerForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", language: "English", password: "", confirmPassword: "", terms: false });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState<"" | "success" | "error">("");
  const [geoMessage, setGeoMessage] = useState("");

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) errs.phone = "Enter a valid 10-digit phone number";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Must be at least 8 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!form.terms) errs.terms = "You must accept the terms";
    return errs;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); const errs = validate(); setErrors(errs); if (Object.keys(errs).length > 0) return; setLoading(true); await new Promise((r) => setTimeout(r, 1500)); setLoading(false); onSuccess(); };

  // ── Real browser geolocation ──
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      setGeoMessage("Location detection is not supported by this browser. Please enter your location manually.");
      return;
    }
    setGeoLoading(true);
    setGeoStatus("");
    setGeoMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode using OpenStreetMap Nominatim (free, no API key)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "Accept": "application/json" } }
          );
          if (!res.ok) throw new Error("Geocoding failed");
          const data = await res.json();
          const addr = data.address || {};

          // Build a readable address from the components
          const parts: string[] = [];
          if (addr.house_number) parts.push(addr.house_number);
          if (addr.road) parts.push(addr.road);
          if (addr.neighbourhood || addr.suburb) parts.push(addr.neighbourhood || addr.suburb);
          if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);
          if (addr.state) parts.push(addr.state);
          if (addr.postcode) parts.push(addr.postcode);

          const fullAddress = parts.length > 0 ? parts.join(", ") : data.display_name || "";

          setForm((f) => ({ ...f, address: fullAddress }));
          setGeoStatus("success");
          setGeoMessage("Location detected ✓");
        } catch {
          // Geocoding failed but we got coords — show coordinates as fallback
          const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setForm((f) => ({ ...f, address: fallback }));
          setGeoStatus("success");
          setGeoMessage("Location detected ✓ (coordinates shown — address lookup partially failed)");
        }
        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        setGeoStatus("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoMessage("Location permission was denied. Please allow location access or enter your location manually.");
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoMessage("Unable to detect your location. Please enter your location manually.");
            break;
          case error.TIMEOUT:
            setGeoMessage("Location detection timed out. Please try again or enter your location manually.");
            break;
          default:
            setGeoMessage("Unable to detect your location. Please enter your location manually.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormInput label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="Enter your full name" required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput label="Phone Number" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} placeholder="9876543210" required />
        <FormInput label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} placeholder="you@example.com" required />
      </div>
      <div>
        <FormInput label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={errors.address} placeholder="Enter your address" required />
        <button
          type="button"
          onClick={handleGeolocation}
          disabled={geoLoading}
          className={`mt-1.5 text-sm flex items-center gap-1.5 cursor-pointer transition-colors disabled:cursor-not-allowed ${geoLoading ? "text-ink-muted" : "text-brand-400 hover:text-brand-300"}`}
        >
          {geoLoading ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
              Detecting your location…
            </>
          ) : (
            <>
              <MapPin size={14} />
              Use my current location
            </>
          )}
        </button>
        {geoStatus === "success" && <p className="text-xs text-accent-green mt-1">{geoMessage}</p>}
        {geoStatus === "error" && <p className="text-xs text-accent-pink mt-1">{geoMessage}</p>}
      </div>
      <FormSelect label="Preferred Language" value={form.language} onChange={(v) => setForm({ ...form, language: v })} options={[{value:"English",label:"English"},{value:"Hindi",label:"हिन्दी"},{value:"Tamil",label:"தமிழ்"},{value:"Kannada",label:"ಕನ್ನಡ"}]} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} placeholder="Min 8 characters" required />
        <FormInput label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} error={errors.confirmPassword} placeholder="Re-enter password" required />
      </div>
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} className="mt-1 rounded border-border text-brand-400 focus:ring-brand-400" />
          <span className="text-sm text-ink-secondary">I agree to the <a href="#" className="text-brand-400 hover:underline">Terms</a> and <a href="#" className="text-brand-400 hover:underline">Privacy Policy</a></span>
        </label>
        {errors.terms && <p className="text-xs text-accent-pink mt-1">{errors.terms}</p>}
      </div>
      <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
    </form>
  );
}

// ── Worker Form (complete rewrite) ──
function WorkerForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"form" | "review">("form");

  // Personal
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Professional
  const [profession, setProfession] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [certFile, setCertFile] = useState<string | null>(null);

  // Availability
  const [availableDays, setAvailableDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [availabilityType, setAvailabilityType] = useState("Full Time");

  // Service Area
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [serviceRadius, setServiceRadius] = useState("10");

  // Identity
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idProof, setIdProof] = useState<string | null>(null);

  const toggleSkill = (s: string) => setSkills((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const toggleDay = (d: string) => setAvailableDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  const availableSkills = profession ? (skillsByProfession[profession] || []) : [];

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) errs.phone = "Enter a valid 10-digit phone number";
    if (!profession) errs.profession = "Select your profession";
    if (skills.length === 0) errs.skills = "Select at least one skill";
    if (!experience) errs.experience = "Years of experience required";
    if (availableDays.length === 0) errs.days = "Select at least one day";
    if (!city.trim()) errs.city = "City is required";
    if (!state.trim()) errs.state = "State is required";
    if (!idType) errs.idType = "Select ID type";
    if (!idNumber.trim()) errs.idNumber = "ID number is required";
    return errs;
  }, [name, phone, profession, skills, experience, availableDays, city, state, idType, idNumber]);

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep("review");
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    onSuccess();
  };

  const maskId = (id: string) => id.length > 4 ? "•".repeat(id.length - 4) + id.slice(-4) : id;

  if (step === "review") {
    return (
      <div className="space-y-6">
        <button onClick={() => setStep("form")} className="text-sm text-brand-400 hover:text-brand-300 cursor-pointer">&larr; Back to edit</button>
        <h3 className="text-lg font-bold text-ink">Review Your Information</h3>

        <ReviewSection title="Personal Information">
          <ReviewItem label="Name" value={name} />
          <ReviewItem label="Phone" value={`+91 ${phone}`} />
          {email && <ReviewItem label="Email" value={email} />}
          <ReviewItem label="Profile Photo" value={profilePhoto ? "✓ Uploaded" : "Not uploaded"} />
        </ReviewSection>

        <ReviewSection title="Professional Profile">
          <ReviewItem label="Profession" value={professions.find((p) => p.value === profession)?.label || profession} />
          <ReviewItem label="Skills" value={skills.join(", ")} />
          <ReviewItem label="Experience" value={`${experience} years`} />
          <ReviewItem label="Certifications" value={certFile ? "✓ Uploaded" : "Not uploaded"} />
        </ReviewSection>

        <ReviewSection title="Availability">
          <ReviewItem label="Available Days" value={availableDays.map((d) => dayLabels[d]).join(", ")} />
          <ReviewItem label="Working Hours" value={`${startTime} to ${endTime}`} />
          <ReviewItem label="Type" value={availabilityType} />
        </ReviewSection>

        <ReviewSection title="Service Area">
          <ReviewItem label="City" value={city} />
          <ReviewItem label="State" value={state} />
          {district && <ReviewItem label="District" value={district} />}
          {pinCode && <ReviewItem label="PIN Code" value={pinCode} />}
          <ReviewItem label="Service Radius" value={`Within ${serviceRadius} km`} />
        </ReviewSection>

        <ReviewSection title="Identity Verification">
          <ReviewItem label="ID Type" value={idType} />
          <ReviewItem label="ID Number" value={maskId(idNumber)} />
          <ReviewItem label="ID Proof" value={idProof ? "✓ Uploaded" : "Not uploaded"} />
          <p className="text-xs text-ink-muted mt-2">Your government ID will be used for worker verification.</p>
        </ReviewSection>

        <Button onClick={handleSubmit} loading={loading} className="w-full" size="lg">Submit Registration</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleReview} className="space-y-8">
      {/* Section 1: Personal Information */}
      <FormSection num={1} title="Personal Information">
        <FormInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="e.g., Rahul Sharma" required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} placeholder="9876543210" required />
          <FormInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Optional" />
        </div>
        <ImageUpload label="Worker Profile Photo" accept="image/jpeg,image/png" preview={profilePhoto} onUpload={(f) => { const r = new FileReader(); r.onload = (e) => setProfilePhoto(e.target?.result as string); r.readAsDataURL(f); }} onRemove={() => setProfilePhoto(null)} />
      </FormSection>

      {/* Section 2: Professional Profile */}
      <FormSection num={2} title="Professional Profile">
        <FormSelect label="Profession / Job Type" value={profession} onChange={(v) => { setProfession(v); setSkills([]); }} options={professions} placeholder="Select your profession" error={errors.profession} required />
      </FormSection>

      {/* Section 3: Skills & Experience */}
      <FormSection num={3} title="Skills & Experience">
        {profession ? (
          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-2">Select Your Skills <span className="text-accent-pink">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableSkills.map((s) => (
                <button key={s} type="button" onClick={() => toggleSkill(s)} className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer text-left ${skills.includes(s) ? "bg-brand-500/10 border-brand-500/40 text-brand-300" : "border-border text-ink-secondary hover:border-brand-500/30"}`}>{s}</button>
              ))}
            </div>
            {errors.skills && <p className="text-xs text-accent-pink mt-1">{errors.skills}</p>}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">Select a profession above to see available skills.</p>
        )}
        <FormInput label="Years of Experience" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} error={errors.experience} placeholder="e.g., 5" required />
        <ImageUpload label="Certifications (Optional)" accept="image/jpeg,image/png" preview={certFile} onUpload={(f) => { const r = new FileReader(); r.onload = (e) => setCertFile(e.target?.result as string); r.readAsDataURL(f); }} onRemove={() => setCertFile(null)} />
      </FormSection>

      {/* Section 4: Working Hours & Availability */}
      <FormSection num={4} title="Working Hours & Availability">
        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-2">Available Days <span className="text-accent-pink">*</span></label>
          <div className="flex flex-wrap gap-2">
            {days.map((d) => (
              <button key={d} type="button" onClick={() => toggleDay(d)} className={`px-3 py-1.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${availableDays.includes(d) ? "bg-brand-500/10 border-brand-500/40 text-brand-300" : "border-border text-ink-secondary hover:border-brand-500/30"}`}>{dayLabels[d]}</button>
            ))}
          </div>
          {errors.days && <p className="text-xs text-accent-pink mt-1">{errors.days}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput label="Start Time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <FormInput label="End Time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        <FormSelect label="Availability Type" value={availabilityType} onChange={setAvailabilityType} options={availabilityTypes.map((a) => ({ value: a, label: a }))} />
      </FormSection>

      {/* Section 5: Service Area */}
      <FormSection num={5} title="Service Area">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput label="City" value={city} onChange={(e) => setCity(e.target.value)} error={errors.city} placeholder="e.g., Mumbai" required />
          <FormSelect label="State" value={state} onChange={setState} options={indianStates.map((s) => ({ value: s, label: s }))} placeholder="Select state" error={errors.state} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput label="District / Area" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g., Andheri West" />
          <FormInput label="PIN Code" value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="e.g., 400058" />
        </div>
        <FormSelect label="Service Radius" value={serviceRadius} onChange={setServiceRadius} options={[{value:"5",label:"Within 5 km"},{value:"10",label:"Within 10 km"},{value:"15",label:"Within 15 km"},{value:"25",label:"Within 25 km"},{value:"custom",label:"Custom"}]} />
      </FormSection>

      {/* Section 6: Identity Verification */}
      <FormSection num={6} title="Identity Verification">
        <p className="text-xs text-ink-muted -mt-4 mb-2">Your government ID will be used for worker verification.</p>
        <FormSelect label="Government ID Type" value={idType} onChange={setIdType} options={idTypes.map((t) => ({ value: t, label: t }))} placeholder="Select ID type" error={errors.idType} required />
        <FormInput label="Government ID Number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} error={errors.idNumber} placeholder="Enter your ID number" required />
        <ImageUpload label="Government ID Proof" accept="image/jpeg,image/png" preview={idProof} onUpload={(f) => { const r = new FileReader(); r.onload = (e) => setIdProof(e.target?.result as string); r.readAsDataURL(f); }} onRemove={() => setIdProof(null)} />
      </FormSection>

      <Button type="submit" className="w-full" size="lg">Review & Submit</Button>
    </form>
  );
}

// ── Helper Components ──
function FormSection({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full gradient-brand text-white text-xs flex items-center justify-center font-bold">{num}</div>
        {title}
      </h3>
      <div className="space-y-4 pl-9">{children}</div>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-muted rounded-xl p-4">
      <h4 className="text-sm font-bold text-ink mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-ink-secondary">{label}</span>
      <span className="text-ink font-medium text-right max-w-[60%] break-words">{value}</span>
    </div>
  );
}

// ── Society Form (unchanged) ──

// ── Success State ──
function SuccessState({ tab }: { tab: Tab }) {
  const messages: Record<Tab, { title: string; desc: string }> = {
    customer: { title: "Account Created!", desc: "Welcome to GharPe. Browse services and book verified workers." },
    worker: { title: "Verification Pending", desc: "Your profile has been submitted and is awaiting verification. Our team will review within 3–5 business days." },

  };
  const msg = messages[tab];
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-accent-orange/10 flex items-center justify-center mx-auto mb-4"><Clock size={32} className="text-accent-orange" /></div>
      <h3 className="text-2xl font-bold text-ink mb-2">{msg.title}</h3>
      <p className="text-ink-secondary max-w-md mx-auto">{msg.desc}</p>
    </div>
  );
}

// ── Main Page ──
function RegisterPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("customer");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { const tab = searchParams.get("tab"); if (tab === "worker" || tab === "customer") setActiveTab(tab); }, [searchParams]);

  return (
    <>
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-[#08090D]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(124,58,237,0.1)_0%,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight"><span className="text-ink">Join </span><span className="shimmer-text">GharPe</span></h1>
          <p className="text-ink-secondary max-w-xl mx-auto">Register as a customer or join as a verified worker</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-alt to-transparent" />
      </section>
      <section className="py-10 md:py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex border border-border rounded-2xl overflow-hidden mb-8 bg-surface-card">
            {tabs.map((tab) => (<button key={tab.id} onClick={() => { setActiveTab(tab.id); setSubmitted(false); }} className={`flex-1 px-3 py-3 text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === tab.id ? "gradient-brand text-white shadow-lg shadow-brand-500/20" : "text-ink-secondary hover:bg-white/[0.03]"}`}><tab.icon size={16} /><span className="hidden sm:inline">{tab.label}</span><span className="sm:hidden">{tab.label.split(" ").pop()}</span></button>))}
          </div>
          <div className="bg-surface-card border border-border rounded-2xl p-6 md:p-8">
            {submitted ? <SuccessState tab={activeTab} /> : (<>{activeTab === "customer" && <CustomerForm onSuccess={() => setSubmitted(true)} />}{activeTab === "worker" && <WorkerForm onSuccess={() => setSubmitted(true)} />}</>)}
          </div>
        </div>
      </section>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageContent />
    </Suspense>
  );
}
