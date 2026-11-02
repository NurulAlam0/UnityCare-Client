"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  CirclePlus,
  LogOut,
  Moon,
  Sun,
  UsersRound,
  Wrench,
} from "lucide-react";

import logo from "@/assets/UnityCare logo.png";
import { toast } from "@/components/ui/toast";
import { signOut, useSession } from "@/lib/auth-client";

function toggleTheme() {
  const root = document.documentElement;
  const next = !root.classList.contains("dark");
  root.classList.toggle("dark", next);
  window.localStorage.setItem("theme", next ? "dark" : "light");
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the profile dropdown when clicking (or pressing Escape) anywhere outside it
  useEffect(() => {
    if (!isMenuOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  async function handleLogout() {
    try {
      const result = await signOut();
      if (result.error) {
        throw new Error(result.error.message || "Unable to log out.");
      }

      setIsMenuOpen(false);
      toast.add({
        type: "success",
        title: "Logged out",
        description: "You have been signed out.",
      });
      router.replace("/");
      router.refresh();
    } catch (logoutError) {
      toast.add({
        type: "error",
        title: "Logout failed",
        description:
          logoutError instanceof Error
            ? logoutError.message
            : "Unable to log out. Please try again.",
      });
    }
  }

  const userName = session?.user.name || "UnityCare member";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-[#ebe7e0] bg-[#fffdf8] dark:border-white/10 dark:bg-[#0c1a16]">
      <nav className="mx-auto grid h-16 w-full max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        {/* Brand lockup — click scrolls to top */}
        <Link
          href="/"
          onClick={(event) => {
            if (pathname === "/") {
              // Already on the home page: smooth-scroll to the top instead of re-navigating
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-2.5 justify-self-start"
        >
          <span className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
            <Image
              src={logo}
              alt="UnityCare logo"
              fill
              sizes="40px"
              className="object-cover"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold text-[#0b8f68] dark:text-[#4ecf9f]">
              UnityCare
            </span>
            <span className="mt-1 text-[10px] font-medium tracking-[0.12em] text-gray-500 dark:text-gray-400">
              COMMUNITY ACTION
            </span>
          </span>
        </Link>

        {/* Centered nav link */}
        <Link
          href="/events"
          className="hidden items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#0ea477] md:flex dark:text-gray-300"
        >
          <CalendarDays className="size-4" />
          Upcoming Events
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-self-end">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid size-9 place-items-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/10"
          >
            <Moon className="size-4 dark:hidden" />
            <Sun className="hidden size-4 dark:block" />
          </button>
          {!isPending &&
            (session ? (
              <div className="flex items-center gap-2">
                <div ref={menuRef} className="group relative">
                  <button
                    type="button"
                    title={userName}
                    aria-label={`Profile menu for ${userName}`}
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className="inline-flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={userName}
                        width={36}
                        height={36}
                        unoptimized
                        className="size-9 rounded-full object-cover ring-1 ring-black/10"
                      />
                    ) : (
                      <span className="grid size-9 place-items-center rounded-full bg-[#0ea477] text-sm font-semibold text-white">
                        {userInitial}
                      </span>
                    )}
                    <ChevronDown
                      aria-hidden="true"
                      className={`mr-0.5 size-4 text-gray-500 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Hover tooltip for user display name */}
                  {!isMenuOpen && (
                    <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-0.5 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:bg-white dark:text-gray-900">
                      {userName}
                    </div>
                  )}

                  {isMenuOpen && (
                    <div
                      role="menu"
                      aria-label="Account menu"
                      className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-[#10221c]"
                    >
                      <div className="border-b border-gray-100 px-4 py-3 dark:border-white/10">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {userName}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/events/create"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                      >
                        <CirclePlus className="size-4 text-[#0ea477]" />
                        Create Event
                      </Link>
                      <Link
                        href="/events/manage"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                      >
                        <Wrench className="size-4 text-violet-500" />
                        Manage Events
                      </Link>
                      <Link
                        href="/events/joined"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                      >
                        <UsersRound className="size-4 text-[#0ea477]" />
                        Joined Events
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 border-t border-gray-100 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:border-white/10 dark:hover:bg-red-500/10"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/register"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0ea477] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0b8a64]"
              >
                Sign up
              </Link>
            ))}
        </div>
      </nav>
    </header>
  );
}
