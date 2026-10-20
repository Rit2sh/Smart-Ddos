"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, ArrowRight, Menu, X, BookOpen, HelpCircle, Layers, DollarSign, Compass, Info } from "lucide-react";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-panel border border-brand-cyan/40 text-brand-cyan shadow-glow group-hover:border-brand-cyan transition-colors">
            <Shield className="w-5 h-5 text-brand-cyan" />
          </div>
          <span className="text-base font-bold tracking-tight text-text-primary">
            SMART DDOS <span className="text-xs px-1.5 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-mono font-semibold">SHIELD</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-text-secondary">
          <Link href="/how-it-works" className="hover:text-brand-cyan transition-colors">
            How It Works
          </Link>
          <Link href="/learn/ddos" className="hover:text-brand-cyan transition-colors">
            Learn DDoS
          </Link>
          <Link href="/why-protection" className="hover:text-brand-cyan transition-colors">
            Why Protection
          </Link>
          <Link href="/features" className="hover:text-brand-cyan transition-colors">
            Features
          </Link>
          <Link href="/guides" className="hover:text-brand-cyan transition-colors">
            Guides
          </Link>
          <Link href="/pricing" className="hover:text-brand-cyan transition-colors">
            Pricing
          </Link>
          <Link href="/faq" className="hover:text-brand-cyan transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Auth & CTAs */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow"
          >
            <span>Protect My Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/signup"
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-brand-cyan text-background"
          >
            Get Started
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary bg-panel border border-border-subtle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border-subtle bg-panel/95 backdrop-blur-lg px-4 py-4 space-y-3">
          <nav className="grid grid-cols-2 gap-2 text-xs font-medium text-text-secondary">
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-elevated hover:text-brand-cyan transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-brand-cyan" />
              <span>How It Works</span>
            </Link>
            <Link
              href="/learn/ddos"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-elevated hover:text-brand-cyan transition-colors flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-brand-cyan" />
              <span>Learn DDoS</span>
            </Link>
            <Link
              href="/why-protection"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-elevated hover:text-brand-cyan transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-brand-cyan" />
              <span>Why Protection</span>
            </Link>
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-elevated hover:text-brand-cyan transition-colors flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-brand-cyan" />
              <span>Features</span>
            </Link>
            <Link
              href="/guides"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-elevated hover:text-brand-cyan transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-brand-cyan" />
              <span>Guides</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-elevated hover:text-brand-cyan transition-colors flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4 text-brand-cyan" />
              <span>Pricing</span>
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-elevated hover:text-brand-cyan transition-colors flex items-center gap-2 col-span-2"
            >
              <HelpCircle className="w-4 h-4 text-brand-cyan" />
              <span>Frequently Asked Questions</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-text-secondary hover:text-text-primary"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-cyan text-background"
            >
              Protect My Website
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
