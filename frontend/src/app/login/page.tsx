"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  LogIn,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";

export default function LoginPage() {
  const {
    user,
    login,
    verifyOtp,
    resendOtp,
    redirectTo,
    setRedirectTo,
  } = useAuth();

  const router = useRouter();

  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [step, setStep] =
    useState<
      "credentials" | "otp"
    >("credentials");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // ========================================================
  // REDIRECT IF ALREADY LOGGED IN
  // ========================================================

  useEffect(() => {
    if (!user) return;

    const destination =
      redirectTo ||
      (
        user.role === "worker"
          ? "/worker-dashboard"
          : "/dashboard"
      );

    setRedirectTo(null);

    router.replace(
      destination
    );
  }, [
    user,
    router,
    redirectTo,
    setRedirectTo,
  ]);

  // ========================================================
  // STEP 1 — LOGIN
  // ========================================================

  const send = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const result = await login({
      identifier,
      password,
    });

    setLoading(false);

    if (!result.ok) {
      setError(
        result.error ||
        "Unable to login"
      );

      return;
    }

    setPhone(
      result.phone || ""
    );

    setStep("otp");

    setMessage(
      "OTP generated. For localhost, check the Flask terminal."
    );
  };

  // ========================================================
  // STEP 2 — VERIFY OTP
  // ========================================================

  const verify = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result =
      await verifyOtp(
        phone,
        otp
      );

    setLoading(false);

    if (!result.ok) {
      setError(
        result.error ||
        "Invalid OTP"
      );

      return;
    }

    // AuthContext has already
    // stored the authenticated user.
    //
    // The useEffect above will
    // redirect automatically.
  };

  // ========================================================
  // RESEND OTP
  // ========================================================

  const resend = async () => {
    setError("");
    setMessage("");

    const result =
      await resendOtp(
        phone
      );

    if (result.ok) {
      setMessage(
        "New OTP generated. Check the Flask terminal."
      );
    } else {
      setError(
        result.error ||
        "Unable to resend OTP"
      );
    }
  };

  // ========================================================
  // UI
  // ========================================================

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-12 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[#08090D]" />

      <div className="relative z-10 w-full max-w-md bg-surface-card border border-border rounded-2xl p-8 shadow-2xl">

        {/* HEADER */}

        <div className="text-center mb-7">

          <div className="w-14 h-14 rounded-2xl gradient-brand text-white flex items-center justify-center mx-auto mb-4">

            {step === "otp" ? (
              <ShieldCheck size={24} />
            ) : (
              <LogIn size={24} />
            )}

          </div>

          <h1 className="text-2xl font-bold text-ink">
            {step === "otp"
              ? "Verify your phone"
              : "Welcome back"}
          </h1>

          <p className="text-sm text-ink-muted mt-2">

            {step === "otp"
              ? `Enter the 6-digit OTP sent to ${phone}.`
              : "Login with your email or phone number and password."}

          </p>

        </div>

        {/* ==================================================
            CREDENTIALS
        ================================================== */}

        {step === "credentials" ? (

          <form
            onSubmit={send}
            className="space-y-4"
          >

            <Field
              icon={
                <Mail size={16} />
              }
              type="text"
              value={identifier}
              onChange={setIdentifier}
              placeholder="you@example.com or 9876543210"
              label="Email or phone number"
            />

            <Field
              icon={
                <Lock size={16} />
              }
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Your password"
              label="Password"
            />

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Checking account..."
                : "Continue & send OTP"}
            </Button>

            <p className="text-center text-sm text-ink-muted">

              New here?{" "}

              <Link
                href="/register"
                className="text-brand-300"
              >
                Create an account
              </Link>

            </p>

          </form>

        ) : (

          /* ==================================================
             OTP
          ================================================== */

          <form
            onSubmit={verify}
            className="space-y-4"
          >

            <input
              autoFocus
              required
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(0, 6)
                )
              }
              inputMode="numeric"
              maxLength={6}
              className="w-full text-center tracking-[0.5em] text-2xl rounded-xl border border-border bg-white/5 py-4 text-ink outline-none focus:border-brand-400"
              placeholder="000000"
            />

            {message && (
              <p className="text-sm text-accent-green">
                {message}
              </p>
            )}

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify & login"}
            </Button>

            <button
              type="button"
              onClick={resend}
              className="w-full text-sm text-brand-300"
            >
              Resend OTP
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(
                  "credentials"
                );
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="w-full text-sm text-ink-muted"
            >
              Use different credentials
            </button>

          </form>
        )}

      </div>
    </section>
  );
}


// ==========================================================
// FORM FIELD
// ==========================================================

function Field({
  icon,
  type,
  value,
  onChange,
  placeholder,
  label,
}: {
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <label className="block">

      <span className="text-sm text-ink-secondary">
        {label}
      </span>

      <div className="relative mt-1">

        <span className="absolute left-3 top-3.5 text-ink-muted">
          {icon}
        </span>

        <input
          required
          type={type}
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          className="w-full rounded-xl border border-border bg-white/5 py-3 pl-10 pr-3 text-ink outline-none focus:border-brand-400"
          placeholder={placeholder}
        />

      </div>

    </label>
  );
}