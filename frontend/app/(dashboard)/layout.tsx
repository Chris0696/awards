"use client";

import { useState } from "react";
import Sidebar from "@/app/(dashboard)/Sidebar";
import { MenuIcon } from "lucide-react";

import { SessionProvider } from "./SessionProvider";
import AdditionalUserInfo from "./AdditionalUserInfo";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <AdditionalUserInfo>
        <section className="flex h-screen relative">
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute right-5 top-6 md:hidden"
          >
            <MenuIcon />
          </button>
          <div className="pl-5 py-5">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <section className="flex-1 p-5 overflow-y-auto">{children}</section>
        </section>
      </AdditionalUserInfo>
    </SessionProvider>
  );
}
