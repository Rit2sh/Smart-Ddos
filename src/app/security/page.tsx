import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ShieldCheck, Lock, FileCheck2, Cpu, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <PublicHeader />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-status-success font-bold flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            ENTERPRISE ASSURANCE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-text-primary">
            Defensive Security Architecture
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Smart DDoS Shield operates under a strict defense-only doctrine with zero decrypted payload persistence and complete origin cloaking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="cyber-card p-8 space-y-3">
            <div className="flex items-center gap-2 text-brand-cyan">
              <Lock className="w-5 h-5" />
              <h3 className="text-base font-bold text-text-primary">Zero Origin Exposure</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your backend servers communicate exclusively with our authenticated edge collectors. All direct public access to your origin IPs is rendered unroutable, eliminating bypass vectors.
            </p>
          </div>

          <div className="cyber-card p-8 space-y-3">
            <div className="flex items-center gap-2 text-status-success">
              <FileCheck2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-text-primary">SOC 2 Type II & ISO 27001</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              All infrastructure, collector operations, and personnel access adhere to rigorous compliance controls. Annual third-party penetration audits are conducted and available under NDA.
            </p>
          </div>

          <div className="cyber-card p-8 space-y-3">
            <div className="flex items-center gap-2 text-status-warning">
              <Cpu className="w-5 h-5" />
              <h3 className="text-base font-bold text-text-primary">Safe Kernel eBPF Execution</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Packet filters are compiled to sandboxed Linux eBPF bytecode verified by the Linux kernel verifier before execution. Zero kernel panics or side-channel risks.
            </p>
          </div>

          <div className="cyber-card p-8 space-y-3">
            <div className="flex items-center gap-2 text-brand-blue">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-bold text-text-primary">Cryptographic Token Challenges</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Domain ownership is mathematically validated using non-reusable expiring SHA-256 tokens before traffic redirection or mitigation enforcement can take place.
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
