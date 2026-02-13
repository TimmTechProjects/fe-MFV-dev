"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import useAuth from "@/redux/hooks/useAuth";
import {
  LayoutDashboard,
  TicketIcon,
  Users,
  BarChart3,
  ShieldAlert,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Tickets", href: "/admin/tickets", icon: TicketIcon },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
        <ShieldAlert className="w-12 h-12 text-zinc-400 mb-3" />
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
          Please log in to access admin panel
        </h2>
        <Link href="/login" className="mt-4 text-[#81a308] hover:underline text-sm">
          Log in
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center">
        <ShieldAlert className="w-12 h-12 text-red-400 mb-3" />
        <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">Access Denied</h2>
        <p className="text-sm text-zinc-500 mt-1">You don&apos;t have permission to access this page.</p>
        <Link href="/" className="mt-4 text-[#81a308] hover:underline text-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-[68px] left-4 z-50 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        <aside
          className={`fixed lg:sticky top-[56px] left-0 z-40 h-[calc(100vh-56px)] w-56 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col py-4 transition-transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="px-4 mb-6">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Admin</h2>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#81a308]/10 text-[#81a308]"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                </Link>
              );
            })}
          </nav>
          <div className="px-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-400">Signed in as</p>
            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
              @{user.username}
            </p>
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
