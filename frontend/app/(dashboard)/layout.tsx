"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <section className="flex h-screen relative">
      {/* Toggle button for mobile */}
      {/*  <button
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button> */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <section className="flex-1 p-5 overflow-y-auto">{children}</section>
    </section>
  );
}
