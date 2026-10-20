"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams?.get("oauth_error");

  const [email, setEmail] = useState("secops@shield-enterprise.io");
  const [password, setPassword] = useState("SecOps2026!Protected");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(oauthError || null);

  useEffect(() => {
    if (oauthError) {
      setError(oauthError);
    }
  }, [oauthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/app");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
      setLoading(false);
    }
  };

  const setDemoLead = () => {
    setEmail("secops@shield-enterprise.io");
    setPassword("SecOps2026!Protected");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background cyber-grid">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-panel border border-brand-cyan/40 text-brand-cyan shadow-glow">
            <Shield className="w-5 h-5 text-brand-cyan" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">
            SMART DDOS <span className="text-brand-cyan">SHIELD</span>
          </span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Sign In to Security Console
        </h1>
        <p className="text-xs text-text-secondary">
          Access your private DDoS telemetry dashboard, alerts, and policies.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="cyber-card p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 rounded-lg bg-status-critical/15 border border-status-critical/30 text-status-critical text-xs space-y-1 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Authentication Notice:</span> {error}
              </div>
            </div>
          )}

          {/* Social OAuth Providers */}
          <div className="space-y-3">
            <a
              href="/api/auth/oauth/google"
              className="w-full py-2.5 px-4 rounded-lg bg-panel border border-border-subtle hover:border-brand-cyan/50 text-text-primary font-medium text-xs flex items-center justify-center gap-2.5 transition-all hover:bg-elevated"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </a>

            <a
              href="/api/auth/oauth/github"
              className="w-full py-2.5 px-4 rounded-lg bg-panel border border-border-subtle hover:border-brand-cyan/50 text-text-primary font-medium text-xs flex items-center justify-center gap-2.5 transition-all hover:bg-elevated"
            >
              <svg className="w-4 h-4 fill-current text-text-primary" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Continue with GitHub</span>
            </a>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border-subtle w-full" />
            <span className="bg-panel px-3 text-[11px] font-mono uppercase text-text-secondary absolute">
              Or sign in with password
            </span>
          </div>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="p-3 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 text-xs text-brand-cyan space-y-1">
            <div className="font-semibold flex items-center justify-between">
              <span>Demo SecOps Lead Profile</span>
              <button
                type="button"
                onClick={setDemoLead}
                className="underline hover:text-white"
              >
                Auto-fill
              </button>
            </div>
            <div className="font-mono text-[11px] text-text-secondary">
              secops@shield-enterprise.io / SecOps2026!Protected
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-text-secondary">
                Operator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-panel border border-border-subtle focus:border-brand-cyan focus:outline-none text-text-primary text-sm transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-text-secondary">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-cyan hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-panel border border-border-subtle focus:border-brand-cyan focus:outline-none text-text-primary text-sm transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-xs bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{loading ? "Authenticating Session..." : "Sign In to Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-border-subtle text-center text-xs text-text-secondary">
            Don&apos;t have a workspace?{" "}
            <Link href="/signup" className="text-brand-cyan hover:underline font-medium">
              Create an Account & Protect a Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-brand-cyan">Loading portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
