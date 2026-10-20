"use client";

import React, { useState } from "react";
import { TelemetryPoint } from "@/lib/types";
import { Activity, ShieldCheck, ShieldAlert } from "lucide-react";

interface TrafficChartProps {
  data: TelemetryPoint[];
}

export function TrafficChart({ data }: TrafficChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<TelemetryPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="cyber-card p-6 flex items-center justify-center h-72 text-text-secondary text-sm">
        No telemetry stream available
      </div>
    );
  }

  // Calculate SVG heights and scales
  const maxRps = Math.max(...data.map((d) => d.totalRps), 250000);
  const width = 800;
  const height = 240;
  const padding = 40;

  const getX = (idx: number) => padding + (idx / (data.length - 1)) * (width - padding * 2);
  const getY = (val: number) => height - padding - (val / maxRps) * (height - padding * 2);

  // SVG path generation
  const totalPoints = data.map((d, i) => `${getX(i)},${getY(d.totalRps)}`).join(" ");
  const cleanPoints = data.map((d, i) => `${getX(i)},${getY(d.cleanRps)}`).join(" ");
  const blockedPoints = data.map((d, i) => `${getX(i)},${getY(d.blockedRps)}`).join(" ");

  const totalArea = `${totalPoints} ${getX(data.length - 1)},${height - padding} ${getX(0)},${height - padding}`;
  const blockedArea = `${blockedPoints} ${getX(data.length - 1)},${height - padding} ${getX(0)},${height - padding}`;

  return (
    <div className="cyber-card p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-sm font-bold tracking-tight text-text-primary">
              INGESTION STREAM & ATTACK MITIGATION (RPS)
            </h3>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time edge collector telemetry: Legitimate vs Filtered volumetric attack traffic
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success"></span>
            <span className="text-text-secondary">Clean Traffic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-status-critical"></span>
            <span className="text-text-secondary">Mitigated Attack</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan"></span>
            <span className="text-text-secondary">Total Ingestion</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-64 overflow-visible font-mono text-[10px]"
        >
          <defs>
            <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F87171" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F87171" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = height - padding - pct * (height - padding * 2);
            const rpsVal = Math.round((pct * maxRps) / 1000);
            return (
              <g key={pct}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#1E293B"
                  strokeDasharray="4 4"
                />
                <text x={padding - 6} y={y + 3} textAnchor="end" fill="#64748B">
                  {rpsVal}k
                </text>
              </g>
            );
          })}

          {/* Fill Areas */}
          <polygon points={totalArea} fill="url(#totalGrad)" />
          <polygon points={blockedArea} fill="url(#blockedGrad)" />

          {/* Lines */}
          <polyline
            fill="none"
            stroke="#22D3EE"
            strokeWidth="2"
            points={totalPoints}
          />
          <polyline
            fill="none"
            stroke="#34D399"
            strokeWidth="2"
            points={cleanPoints}
          />
          <polyline
            fill="none"
            stroke="#F87171"
            strokeWidth="2.5"
            points={blockedPoints}
          />

          {/* Data point hover circles */}
          {data.map((point, idx) => {
            const cx = getX(idx);
            const cy = getY(point.totalRps);
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r="3.5"
                className="fill-brand-cyan hover:r-6 hover:fill-status-critical transition-all cursor-pointer"
                onMouseEnter={() => setHoveredPoint(point)}
              />
            );
          })}
        </svg>

        {/* Hovered point inspection tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 p-3 rounded-lg bg-elevated/95 border border-brand-cyan/40 shadow-glow text-xs font-mono space-y-1">
            <div className="text-text-primary font-bold">{hoveredPoint.timestamp}</div>
            <div className="flex items-center gap-2 text-status-success">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Clean: {hoveredPoint.cleanRps.toLocaleString()} RPS</span>
            </div>
            <div className="flex items-center gap-2 text-status-critical">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Blocked: {hoveredPoint.blockedRps.toLocaleString()} RPS</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
