"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Menu, Search, UserIcon, Bell, Mail, Crown, Settings, LogOut, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ResultsCard from "./cards/ResultsCard";
import { Plant } from "@/types/plants";
import { searchEverything } from "../lib/utils";
import { authUserLinks, navLinks } from "@/constants/navLinks";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { UserResult } from "@/types/users";
import useAuth from "@/redux/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [plantSuggestions, setPlantSuggestions] = useState<Plant[]>([]);
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState<UserResult[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { user, LogoutUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { theme, toggleTheme } = useTheme();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (suppressSuggestions) {
        setIsPopoverOpen(false);
        return;
      }
      if (!debouncedQuery) {
        setPlantSuggestions([]);
        setUserSuggestions([]);
        setIsPopoverOpen(false);
        return;
      }

      setIsLoading(true);
      setIsPopoverOpen(true);

      try {
        const { plants, users } = await searchEverything(debouncedQuery);
        setPlantSuggestions(plants);
        setUserSuggestions(users);
        setIsPopoverOpen(plants.length > 0 || users.length > 0);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setIsPopoverOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, suppressSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      setIsPopoverOpen(false);
      setPlantSuggestions([]);
      setUserSuggestions([]);
      setDebouncedQuery("");
      setSuppressSuggestions(true);
      setSearchQuery("");
      setTimeout(() => setSuppressSuggestions(false), 600);
      setSheetOpen(false);
      router.push(`/plants?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const hasSuggestions =
    plantSuggestions.length > 0 || userSuggestions.length > 0;

  return (
    <header className="bg-zinc-50 dark:bg-[#2b2a2a] w-full h-full py-3 px-4 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200 dark:border-[#3a3a3a]">
      {/* Logo - Responsive sizing */}
      <Link href="/" className="flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="text-emerald-800 dark:text-[#ecfaec]">My</span>
          <span className="bg-gradient-to-r from-[#dab9df] to-[#e5b3ec] bg-clip-text text-transparent">
            Floral
          </span>
          <span className="text-[#81a308]">Vault</span>
        </h1>
      </Link>

      {/* Searchbar - Responsive width and positioning */}
      <div className="hidden sm:flex flex-1 max-w-xl mx-4 lg:mx-8 relative">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search plants, users, tags, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => hasSuggestions && setIsPopoverOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              onBlur={() => setTimeout(() => setIsPopoverOpen(false), 100)}
              className="w-full pr-10 rounded-2xl bg-gray-100 dark:bg-white border-0 focus-visible:ring-2 focus-visible:ring-[#81a308] text-zinc-900"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Suggestions dropdown */}
          {isPopoverOpen && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute top-full mt-1 w-full bg-white dark:bg-[#3a3a3a] rounded-lg shadow-xl border border-gray-200 dark:border-[#4a4a4a] overflow-hidden z-50"
            >
              {isLoading ? (
                <div className="p-3 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#81a308]"></div>
                  <span className="ml-2 text-zinc-700 dark:text-white text-sm">Loading...</span>
                </div>
              ) : (
                <div className="max-h-[70vh] overflow-y-auto">
                  {plantSuggestions.length > 0 && (
                    <div className="py-1">
                      <p className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 sticky top-0">
                        Plants
                      </p>
                      {plantSuggestions.map((plant) => (
                        <div
                          key={plant.id}
                          className="hover:bg-gray-100 dark:hover:bg-[#4a4a4a] transition-colors my-2"
                          onClick={() => setIsPopoverOpen(false)}
                        >
                          <ResultsCard plant={plant} compact />
                        </div>
                      ))}
                    </div>
                  )}

                  {userSuggestions.length > 0 && (
                    <div className="py-1">
                      <p className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 sticky top-0">
                        Users
                      </p>
                      {userSuggestions.map((user) => (
                        <div
                          key={user.id}
                          className="hover:bg-gray-100 dark:hover:bg-[#4a4a4a] transition-colors my-2"
                          onClick={() => setIsPopoverOpen(false)}
                        >
                          <ResultsCard user={user} compact />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-6">
        {navLinks.map((link) => {
          if (link.protected && !user) return null;
          const href =
            link.label === "Albums" && user
              ? `/profiles/${user.username}/collections`
              : link.href;

          return (
            <Link key={link.href} href={href}>
              <span className="text-zinc-700 dark:text-white/90 hover:text-[#81a308] transition-colors text-sm md:text-base">
                {link.label}
              </span>
            </Link>
          );
        })}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-zinc-600" />
          )}
        </button>

        {user ? (
          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <DropdownMenuTrigger asChild onClick={() => setUserMenuOpen((o) => !o)}>
              <Avatar className="cursor-pointer hover:group">
                <AvatarImage
                  src={user.avatarUrl || "/default-avatar.png"}
                />
                <AvatarFallback className="bg-[#81a308] text-white">
                  {user?.firstName?.slice(0, 1).toLocaleUpperCase()}
                  {user?.lastName?.slice(0, 1).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="flex flex-col bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white cursor-pointer rounded-xl w-64 mt-1 mr-5 border border-gray-200 dark:border-zinc-800 p-1.5 scrollbar-none">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl || "/default-avatar.png"} />
                  <AvatarFallback className="bg-[#81a308] text-white">
                    {user?.firstName?.slice(0, 1).toLocaleUpperCase()}
                    {user?.lastName?.slice(0, 1).toLocaleUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.username}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">@{user?.username}</p>
                </div>
              </div>

              <DropdownMenuItem onClick={() => setUserMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-[#81a308]/10 focus:bg-[#81a308]/10 hover:text-[#81a308] focus:text-[#81a308] transition-colors">
                <Link
                  href={`/profiles/${user.username}`}
                  className="flex items-center gap-3 w-full cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setUserMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-[#81a308]/10 focus:bg-[#81a308]/10 hover:text-[#81a308] focus:text-[#81a308] transition-colors">
                <Link
                  href="/notifications"
                  className="flex items-center gap-3 w-full cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setUserMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-[#81a308]/10 focus:bg-[#81a308]/10 hover:text-[#81a308] focus:text-[#81a308] transition-colors">
                <Link
                  href="/messages"
                  className="flex items-center gap-3 w-full cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  Messages
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setUserMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-[#81a308]/10 focus:bg-[#81a308]/10 hover:text-[#81a308] focus:text-[#81a308] transition-colors">
                <Link
                  href="/membership"
                  className="flex items-center gap-3 w-full cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  Membership
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setUserMenuOpen(false)} className="px-4 py-2 rounded-lg hover:bg-[#81a308]/10 focus:bg-[#81a308]/10 hover:text-[#81a308] focus:text-[#81a308] transition-colors">
                <Link
                  href="/settings"
                  className="flex items-center gap-3 w-full cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="px-4 py-2 rounded-lg hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer transition-colors"
                onClick={() => { setUserMenuOpen(false); LogoutUser(); }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={`/login?redirect=${pathname}`}>
            <Button className="inline-flex bg-[#81a308] hover:bg-[#6c8a0a] active:bg-[#5a7508] text-white rounded-full px-5 py-2 text-sm md:text-base font-medium shadow-sm hover:shadow-md hover:shadow-[#81a308]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              Login
            </Button>
          </Link>
        )}
      </nav>

      <div className="flex lg:hidden items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-zinc-600" />
          )}
        </button>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3a]"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-white dark:bg-[#1a1a1a] text-zinc-900 dark:text-white border-l border-gray-200 dark:border-[#2a2a2a] p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle className="text-2xl">
                <span className="text-emerald-800 dark:text-[#ecfaec]">My</span>
                <span className="bg-gradient-to-r from-[#dab9df] to-[#e5b3ec] bg-clip-text text-transparent">
                  Floral
                </span>
                <span className="text-[#81a308]">Vault</span>
              </SheetTitle>
            </SheetHeader>

            <form onSubmit={handleSearch}>
              <div className="relative px-4">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 rounded-full bg-gray-100 dark:bg-[#2a2a2a] text-zinc-900 dark:text-white border border-gray-200 dark:border-[#3a3a3a] placeholder-gray-500 focus-visible:ring-1 focus-visible:ring-[#81a308]"
                />
                <Search className="absolute right-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </form>

            <div className="mt-6 px-3 space-y-0.5">
              {user && (
                <div className="pb-4 border-b border-[#2a2a2a]">
                    <SheetClose asChild>
                    <Link href={`/profiles/${user.username}`}>
                      <div className="flex items-center py-3 px-4 rounded-xl hover:bg-[#81a308]/10 hover:text-[#81a308] transition-colors">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage
                            src={user.avatarUrl || "/default-avatar.png"}
                          />
                          <AvatarFallback className="bg-[#81a308] text-white text-sm">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[15px] font-medium">My Profile</span>
                      </div>
                    </Link>
                  </SheetClose>
                  {authUserLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link href={link.href}>
                        <div className="py-3 px-4 rounded-xl text-[15px] font-medium text-gray-200 hover:bg-[#81a308]/10 hover:text-[#81a308] transition-colors">
                          {link.label}
                        </div>
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              )}

              {navLinks.map((link) => {
                if (link.protected && !user) return null;
                const href =
                  link.label === "Albums" && user
                    ? `/profiles/${user.username}/collections`
                    : link.href;

                return (
                  <SheetClose asChild key={link.href}>
                    <Link href={href}>
                      <div className="py-3 px-4 rounded-xl text-[15px] font-medium text-zinc-700 dark:text-gray-200 hover:bg-[#81a308]/10 hover:text-[#81a308] transition-colors">
                        {link.label}
                      </div>
                    </Link>
                  </SheetClose>
                );
              })}

              {user ? (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2a2a2a]">
                  <div
                    onClick={LogoutUser}
                    className="py-3 px-4 rounded-xl text-[15px] font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer mt-2"
                  >
                    Logout
                  </div>
                </div>
              ) : (
                <div className="px-1 mt-6">
                  <SheetClose asChild>
                    <Link href={`/login?redirect=${pathname}`}>
                      <Button className="w-full bg-[#81a308] hover:bg-[#6c8a0a] active:bg-[#5a7508] text-white rounded-full py-2.5 text-[15px] font-semibold shadow-sm hover:shadow-md hover:shadow-[#81a308]/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]">
                        Login
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
