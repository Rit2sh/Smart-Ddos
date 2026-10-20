import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { DataService } from "@/lib/data-service";
import { UserRole } from "@/lib/types";
import { z } from "zod";

interface TeamMemberRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  added: string;
  status: "ACTIVE" | "INVITED";
}

let teamStore: TeamMemberRecord[] = [
  {
    id: "usr_owner_01",
    name: "Marcus Vance",
    email: "secops@shield-enterprise.io",
    role: "OWNER",
    added: "Sep 2026",
    status: "ACTIVE",
  },
  {
    id: "usr_admin_02",
    name: "Elena Rostova",
    email: "elena.r@shield-enterprise.io",
    role: "SECURITY_ADMIN",
    added: "Oct 2026",
    status: "ACTIVE",
  },
  {
    id: "usr_analyst_03",
    name: "Takahiro Sato",
    email: "takahiro@shield-enterprise.io",
    role: "ANALYST",
    added: "Oct 2026",
    status: "ACTIVE",
  },
  {
    id: "usr_viewer_04",
    name: "Audit Compliance Viewer",
    email: "compliance@shield-enterprise.io",
    role: "VIEWER",
    added: "Oct 2026",
    status: "ACTIVE",
  },
];

const inviteSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["OWNER", "SECURITY_ADMIN", "ANALYST", "VIEWER"]),
});

const updateRoleSchema = z.object({
  email: z.string().email(),
  role: z.enum(["OWNER", "SECURITY_ADMIN", "ANALYST", "VIEWER"]),
});

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    members: teamStore.map((m) => ({
      ...m,
      isCurrentUser: m.email === session.email,
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "canManageTeam")) {
      return NextResponse.json(
        { error: "Forbidden: Only Organization Owners can invite new team members." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = inviteSchema.parse(body);

    const existing = teamStore.find((m) => m.email.toLowerCase() === validated.email.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: "User with this email already belongs to organization." }, { status: 409 });
    }

    const newMember: TeamMemberRecord = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: validated.name,
      email: validated.email.toLowerCase(),
      role: validated.role,
      added: "Just now",
      status: "INVITED",
    };

    teamStore.push(newMember);

    await DataService.recordAuditLog({
      action: "TEAM_MEMBER_INVITED",
      userEmail: session.email,
      resourceType: "TeamMember",
      resourceId: newMember.email,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      details: `Invited ${newMember.email} as ${newMember.role}`,
    });

    return NextResponse.json({ success: true, member: newMember }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to invite member" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "canManageTeam")) {
      return NextResponse.json(
        { error: "Forbidden: Only Organization Owners can change member roles." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, role } = updateRoleSchema.parse(body);

    const member = teamStore.find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Protect last owner
    if (member.role === "OWNER" && role !== "OWNER") {
      const ownerCount = teamStore.filter((m) => m.role === "OWNER").length;
      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: "Cannot demote the sole organization Owner. Designate another Owner first." },
          { status: 400 }
        );
      }
    }

    const oldRole = member.role;
    member.role = role;

    await DataService.recordAuditLog({
      action: "TEAM_MEMBER_ROLE_CHANGED",
      userEmail: session.email,
      resourceType: "TeamMember",
      resourceId: member.email,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      details: `Changed role for ${member.email} from ${oldRole} to ${role}`,
    });

    return NextResponse.json({ success: true, member });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update member role" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "canManageTeam")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
    }

    if (email.toLowerCase() === session.email.toLowerCase()) {
      return NextResponse.json({ error: "Cannot remove your own user account from team." }, { status: 400 });
    }

    const index = teamStore.findIndex((m) => m.email.toLowerCase() === email.toLowerCase());
    if (index === -1) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const removed = teamStore.splice(index, 1)[0];

    await DataService.recordAuditLog({
      action: "TEAM_MEMBER_REMOVED",
      userEmail: session.email,
      resourceType: "TeamMember",
      resourceId: removed.email,
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      details: `Revoked access for ${removed.email} (${removed.role})`,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to remove member" }, { status: 400 });
  }
}
