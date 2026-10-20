"use client";

import React, { useEffect, useState } from "react";
import { Users, UserPlus, Shield, CheckCircle2, Trash2, Edit2, X, AlertTriangle, Check } from "lucide-react";
import { UserRole } from "@/lib/types";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  added: string;
  status: "ACTIVE" | "INVITED";
  isCurrentUser: boolean;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("ANALYST");
  const [inviting, setInviting] = useState(false);

  // Edit Role State
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("ANALYST");

  const loadTeam = async () => {
    try {
      const res = await fetch("/api/v1/team");
      const data = await res.json();
      if (data.members) {
        setMembers(data.members);
      }
    } catch {
      setError("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          role: inviteRole,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback(`Invitation dispatched to ${inviteEmail} as ${inviteRole}`);
        setShowInviteModal(false);
        setInviteName("");
        setInviteEmail("");
        loadTeam();
      } else {
        setError(data.error || "Failed to invite operator");
      }
    } catch {
      setError("Error communicating with team service");
    } finally {
      setInviting(false);
      setTimeout(() => {
        setFeedback(null);
        setError(null);
      }, 5000);
    }
  };

  const handleUpdateRole = async (email: string) => {
    setError(null);
    try {
      const res = await fetch("/api/v1/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback(`Role updated to ${newRole} for ${email}`);
        setEditingEmail(null);
        loadTeam();
      } else {
        setError(data.error || "Failed to update role");
      }
    } catch {
      setError("Error updating role");
    } finally {
      setTimeout(() => {
        setFeedback(null);
        setError(null);
      }, 5000);
    }
  };

  const handleRemoveMember = async (email: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${email}?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/v1/team?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback(`Access revoked for ${email}`);
        loadTeam();
      } else {
        setError(data.error || "Failed to remove member");
      }
    } catch {
      setError("Error removing member");
    } finally {
      setTimeout(() => {
        setFeedback(null);
        setError(null);
      }, 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <span>TEAM MEMBERS & RBAC ACCESS CONTROL</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-brand-cyan/20 text-brand-cyan">
              {members.length} MEMBERS
            </span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Manage granular operator permissions: Owner, Security Administrator, Analyst, and Read-Only Viewer.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-cyan text-background hover:bg-brand-cyan/90 transition-all shadow-glow font-mono"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Security Operator</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-status-success/15 border border-status-success/40 text-xs font-mono text-status-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-status-critical/15 border border-status-critical/40 text-xs font-mono text-status-critical flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cyber-card p-6 w-full max-w-md space-y-4 border-brand-cyan/40 bg-surface">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-cyan" />
                <span>Invite Security Operator</span>
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-text-secondary uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle font-mono text-xs text-text-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-text-secondary uppercase">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="operator@shield-enterprise.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle font-mono text-xs text-text-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-text-secondary uppercase">Assigned RBAC Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg bg-panel border border-border-subtle font-mono text-xs text-text-primary"
                >
                  <option value="OWNER">OWNER — Full Admin & Billing</option>
                  <option value="SECURITY_ADMIN">SECURITY_ADMIN — Policy & Asset Management</option>
                  <option value="ANALYST">ANALYST — Investigation & Mitigation</option>
                  <option value="VIEWER">VIEWER — Read-Only Telemetry</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-panel border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-cyan text-background text-xs font-bold font-mono hover:bg-brand-cyan/90 disabled:opacity-50"
                >
                  {inviting ? "Inviting..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div className="cyber-card p-6 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-text-muted font-mono text-xs">Loading team roster...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border-subtle text-text-secondary text-[11px]">
                  <th className="pb-3 font-medium">OPERATOR</th>
                  <th className="pb-3 font-medium">ASSIGNED ROLE</th>
                  <th className="pb-3 font-medium">PERMISSIONS SUMMARY</th>
                  <th className="pb-3 font-medium">STATUS</th>
                  <th className="pb-3 font-medium text-right">MANAGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50">
                {members.map((member) => (
                  <tr key={member.email} className="hover:bg-elevated/40 transition-colors">
                    <td className="py-3.5">
                      <div className="font-sans font-bold text-text-primary text-sm flex items-center gap-2">
                        <span>{member.name}</span>
                        {member.isCurrentUser && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-cyan/20 text-brand-cyan">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary font-mono">{member.email}</div>
                    </td>
                    <td className="py-3.5">
                      {editingEmail === member.email ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value as UserRole)}
                            className="px-2 py-1 rounded bg-panel border border-brand-cyan font-mono text-xs text-text-primary"
                          >
                            <option value="OWNER">OWNER</option>
                            <option value="SECURITY_ADMIN">SECURITY_ADMIN</option>
                            <option value="ANALYST">ANALYST</option>
                            <option value="VIEWER">VIEWER</option>
                          </select>
                          <button
                            onClick={() => handleUpdateRole(member.email)}
                            className="p-1 rounded bg-status-success/20 text-status-success hover:bg-status-success/30"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingEmail(null)}
                            className="p-1 rounded bg-panel text-text-muted hover:text-text-primary"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            member.role === "OWNER"
                              ? "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40"
                              : member.role === "SECURITY_ADMIN"
                              ? "bg-brand-blue/20 text-brand-blue border border-brand-blue/40"
                              : member.role === "ANALYST"
                              ? "bg-status-warning/20 text-status-warning border border-status-warning/40"
                              : "bg-elevated text-text-secondary border border-border-subtle"
                          }`}
                        >
                          {member.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-text-secondary font-sans text-xs">
                      {member.role === "OWNER" && "Full administrative control, billing, API keys, and asset destruction."}
                      {member.role === "SECURITY_ADMIN" && "Asset registration, policy enforcement, mitigation triggers."}
                      {member.role === "ANALYST" && "Incident investigation, mitigation execution, telemetry inspection."}
                      {member.role === "VIEWER" && "Read-only access to dashboards, reports, and threat graphs."}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          member.status === "ACTIVE"
                            ? "bg-status-success/15 text-status-success"
                            : "bg-status-warning/15 text-status-warning"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      {!member.isCurrentUser && (
                        <>
                          <button
                            onClick={() => {
                              setEditingEmail(member.email);
                              setNewRole(member.role);
                            }}
                            className="text-xs text-brand-cyan hover:underline font-mono inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member.email)}
                            className="text-xs text-status-critical hover:underline font-mono inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Revoke</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
