import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Navbar currentOrg="System Superadmin" userRole="SUPERADMIN" />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background cyber-grid">
          {children}
        </main>
      </div>
    </div>
  );
}
