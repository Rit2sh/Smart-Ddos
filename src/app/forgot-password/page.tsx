"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background cyber-grid">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-panel border border-brand-cyan/40 text-brand-cyan shadow-glow">
            <Shield className="w-5 h-5 text-brand-cyan" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">
            SMART DDOS <span className="text-brand-cyan">SHIELD</span>
          </span>
        </Link>

        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
          Password Recovery
        </h2>
        <p className="text-xs text-text-secondary">
          Request a cryptographic recovery token for your operator credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="cyber-card p-6 sm:p-8 space-y-6">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-status-success/20 border border-status-success/40 flex items-center justify-center text-status-success">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-text-primary">
                Recovery Challenge Dispatched
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                If an operator account exists for <span className="text-brand-cyan font-mono">{email}</span>, an out-of-band recovery token has been transmitted with a 15-minute expiration window.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-brand-cyan hover:underline pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
              </Link>
            </div>
          ) : (
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
                    placeholder="operator@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-panel border border-border-subtle focus:border-brand-cyan focus:outline-none text-text-primary text-sm transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg font-semibold text-xs bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow"
              >
                Send Recovery Instructions
              </button>

              <div className="pt-4 border-t border-border-subtle text-center text-xs text-text-secondary">
                <Link href="/login" className="text-text-secondary hover:text-brand-cyan transition-colors flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
