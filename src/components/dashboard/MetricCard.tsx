import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "cyan" | "blue" | "success" | "warning" | "critical";
  trend?: {
    value: string;
    isPositive?: boolean;
    label: string;
  };
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "cyan",
  trend,
}: MetricCardProps) {
  const variantStyles = {
    cyan: "border-brand-cyan/20 text-brand-cyan bg-brand-cyan/10",
    blue: "border-brand-blue/20 text-brand-blue bg-brand-blue/10",
    success: "border-status-success/20 text-status-success bg-status-success/10",
    warning: "border-status-warning/20 text-status-warning bg-status-warning/10",
    critical: "border-status-critical/20 text-status-critical bg-status-critical/10",
  };

  return (
    <div className="cyber-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-text-secondary">
          {title}
        </span>
        <div className={`p-2 rounded-lg border ${variantStyles[variant]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-text-primary">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-text-secondary">
            {subtitle}
          </p>
        )}
      </div>

      {trend && (
        <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-mono">
          <span className={`font-semibold ${trend.isPositive ? "text-status-success" : "text-status-critical"}`}>
            {trend.value}
          </span>
          <span className="text-text-secondary/70">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
