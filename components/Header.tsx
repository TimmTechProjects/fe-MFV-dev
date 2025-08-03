"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ResultsCard from "./cards/ResultsCard";
import { Plant } from "@/types/plants";
import { searchEverything } from "../lib/utils";
import { authUserLinks, navLinks } from "@/constants/navLinks";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { UserResult } from "@/types/users";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [plantSuggestions, setPlantSuggestions] = useState<Plant[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<UserResult[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname() || "/";

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
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
  }, [debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/the-vault/results?query=${encodeURIComponent(trimmed)}`);
      setIsPopoverOpen(false);
    }
  };

  const hasSuggestions =
    plantSuggestions.length > 0 || userSuggestions.length > 0;

  return (
    <header className="bg-[#2b2a2a] w-full h-full py-3 px-4 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Logo - Responsive sizing */}
      <Link href="/" className="flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl text-white font-bold tracking-tight">
          <span className="text-[#ecfaec]">My</span>
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
              className="w-full pr-10 rounded-2xl bg-white border-0 focus-visible:ring-2 focus-visible:ring-[#81a308]"
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
              className="absolute top-full mt-1 w-full bg-[#3a3a3a] rounded-lg shadow-xl border border-[#4a4a4a] overflow-hidden z-50"
            >
              {isLoading ? (
                <div className="p-3 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#81a308]"></div>
                  <span className="ml-2 text-white text-sm">Loading...</span>
                </div>
              ) : (
                <div className="max-h-[70vh] overflow-y-auto">
                  {plantSuggestions.length > 0 && (
                    <div className="py-1">
                      <p className="px-3 py-1 text-xs text-gray-400  sticky top-0">
                        Plants
                      </p>
                      {plantSuggestions.map((plant) => (
                        <div
                          key={plant.id}
                          className="hover:bg-[#4a4a4a] transition-colors  my-2 "
                          onClick={() => setIsPopoverOpen(false)}
                        >
                          <ResultsCard plant={plant} compact />
                        </div>
                      ))}
                    </div>
                  )}

                  {userSuggestions.length > 0 && (
                    <div className="py-1">
                      <p className="px-3 py-1 text-xs text-gray-400   sticky top-0">
                        Users
                      </p>
                      {userSuggestions.map((user) => (
                        <div
                          key={user.id}
                          className="hover:bg-[#4a4a4a] transition-colors my-2"
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
          const href =
            link.label === "My Collection" && user
              ? `/profiles/${user.username}/collections`
              : link.href;

          return (
            <Link key={link.href} href={href}>
              <span className="text-white hover:text-[#81a308] transition-colors text-sm md:text-base">
                {link.label}
              </span>
            </Link>
          );
        })}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:group">
                <AvatarImage
                  src={user.avatarUrl || "https://github.com/shadcn.png"}
                />
                <AvatarFallback className="bg-white">
                  {user?.firstName?.slice(0, 1).toLocaleUpperCase()}
                  {user?.lastName?.slice(0, 1).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="flex flex-col bg-[#2b2a2a] text-white justify-center cursor-pointer rounded-2xl w-48 mt-1 mr-5 scrollbar-none">
              <DropdownMenuItem>
                <Link
                  href={`/profiles/${user.username}`}
                  className="cursor-pointer"
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              {user &&
                authUserLinks.map((link) => (
                  <DropdownMenuItem key={link.href}>
                    <Link href={link.href} className="hover:text-[#dab9df]">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 flex items-center justify-center">
                          {link.icon && (
                            <Image
                              src={link.icon}
                              alt={link.label}
                              width={16}
                              height={16}
                              className="invert"
                            />
                          )}
                        </div>

                        <span>{link.label}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              <DropdownMenuItem>
                <Link href="/membership" className="hover:text-[#dab9df]">
                  Membership
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="hover:text-[#dab9df]">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:text-red-400"
                onClick={logout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={`/login?redirect=${pathname}`}>
            <Button className="bg-[#81a308] hover:bg-[#6c8a0a] text-white rounded-xl px-4 py-2 text-sm md:text-base">
              Login
            </Button>
          </Link>
        )}
      </nav>

      {/* Mobile Navigation */}
      <div className="flex lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#3a3a3a]"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-[#2b2a2a] text-white border-l border-[#4a4a4a]"
          >
            <SheetHeader>
              <SheetTitle className="text-2xl text-white">
                <span className="text-[#ecfaec]">My</span>
                <span className="bg-gradient-to-r from-[#dab9df] to-[#e5b3ec] bg-clip-text text-transparent">
                  Floral
                </span>
                <span className="text-[#81a308]">Vault</span>
              </SheetTitle>
            </SheetHeader>

            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative px-2">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 rounded-xl bg-white text-black border-0"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 " />
              </div>
            </form>

            {/* Mobile Menu Links */}
            <div className="">
              {navLinks.map((link) => {
                const href =
                  link.label === "My Collection" && user
                    ? `/profiles/${user.username}/collections`
                    : link.href;

                return (
                  <Link key={link.href} href={href}>
                    <div className="py-1  mb-1 px-3 rounded-lg hover:bg-[#3a3a3a] transition-colors">
                      {link.label}
                    </div>
                  </Link>
                );
              })}

              {user ? (
                <>
                  <div className="pt-4 border-t border-[#4a4a4a]">
                    <Link href={`/profiles/${user.username}`}>
                      <div className="flex items-center py-2 px-3 rounded-lg hover:bg-[#3a3a3a] transition-colors">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage
                            src={user.avatarUrl || "/default-avatar.png"}
                          />
                          <AvatarFallback className="bg-white text-[#2b2a2a] text-sm">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>My Profile</span>
                      </div>
                    </Link>
                    {authUserLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <div className="py-2 px-3 rounded-lg hover:bg-[#3a3a3a] transition-colors">
                          {link.label}
                        </div>
                      </Link>
                    ))}
                    <div
                      onClick={logout}
                      className="py-2 px-3 rounded-lg hover:bg-[#3a3a3a] text-red-400 transition-colors cursor-pointer"
                    >
                      Logout
                    </div>
                  </div>
                </>
              ) : (
                <Link href={`/login?redirect=${pathname}`}>
                  <Button className="w-full bg-[#81a308] hover:bg-[#6c8a0a] text-white rounded-xl py-2 mt-4">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
