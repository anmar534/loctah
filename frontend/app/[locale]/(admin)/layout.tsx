"use client";

import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import AdminHeader from "@/components/layout/AdminHeader";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsCount] = useState(3); // TODO: Replace with real data from API/context
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close sidebar on escape key
  useEffect(() => {
    if (!sidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            ref={drawerRef}
            className="fixed inset-y-0 right-0 z-50 w-64 transform transition-transform duration-300 md:hidden bg-card"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="flex flex-1 flex-col">
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(true)} 
          isSidebarOpen={sidebarOpen}
          notificationsCount={notificationsCount}
        />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
