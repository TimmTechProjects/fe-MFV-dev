"use client";

import React from "react";
import Link from "next/link";
import { Home, Play, MessageSquare, ShoppingCart, Leaf, PlusCircle } from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}

function NavItem({ icon, label, active = false, onClick, href }: NavItemProps) {
  const className = `flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all text-sm cursor-pointer ${
    active
      ? "font-semibold bg-gray-100 dark:bg-gray-800/40 text-zinc-900 dark:text-white"
      : "font-normal text-zinc-600 dark:text-gray-400"
  }`;

  if (href) {
    return (
      <Link href={href} className={className}>
        <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${className} w-full text-left`}>
      <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

interface LeftSidebarProps {
  activeSection?: "home" | "reels" | "forums" | "marketplace";
  onNavigate?: (section: string) => void;
}

export default function LeftSidebar({ activeSection = "home", onNavigate }: LeftSidebarProps) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onNavigate?.("home");
  };

  return (
    <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800/50 bg-white dark:bg-black overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#81a308] to-emerald-600 flex items-center justify-center shadow-lg shadow-[#81a308]/20">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-zinc-900 dark:text-white">The Vault</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <NavItem
            icon={<Home className="w-5 h-5" />}
            label="Home"
            active={activeSection === "home"}
            onClick={handleScrollToTop}
          />
          <NavItem
            icon={<Play className="w-5 h-5" />}
            label="Reels"
            active={activeSection === "reels"}
            onClick={() => onNavigate?.("reels")}
          />
          <NavItem
            icon={<MessageSquare className="w-5 h-5" />}
            label="Forums"
            href="/forums"
            active={activeSection === "forums"}
          />
          <NavItem
            icon={<ShoppingCart className="w-5 h-5" />}
            label="Marketplace"
            href="/marketplace"
            active={activeSection === "marketplace"}
          />
        </nav>

        {/* Create Post Button */}
        <Link
          href="/forums"
          className="flex items-center justify-center gap-2 w-full bg-[#81a308] hover:bg-[#6c8a0a] text-white font-semibold py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-[#81a308]/25"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create Post</span>
        </Link>

        {/* Quick Stats */}
        <div className="mt-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800/50">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Quick Stats
          </h4>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Your Plants</span>
              <span className="text-zinc-900 dark:text-white font-medium">12</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Collections</span>
              <span className="text-zinc-900 dark:text-white font-medium">3</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Following</span>
              <span className="text-zinc-900 dark:text-white font-medium">24</span>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800/50">
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <span>&middot;</span>
            <Link href="/settings" className="hover:underline">
              Settings
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-2">© 2025 My Floral Vault</p>
        </div>
      </div>
    </aside>
  );
}
