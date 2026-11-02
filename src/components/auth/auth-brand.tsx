"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import logo from "@/assets/UnityCare logo.png";

const brandCopy = {
  login: {
    headline: "Welcome Back!",
    subtext: "Login to your UnityCare account",
  },
  register: {
    headline: "Join UnityCare!",
    subtext: "Create your account and start making a difference",
  },
} as const;

export function AuthBrand() {
  const pathname = usePathname();
  const copy = pathname.startsWith("/register") ? brandCopy.register : brandCopy.login;

  return (
    <aside className="relative isolate overflow-hidden bg-gradient-to-br from-[#157a45] via-[#1e9155] to-[#31a75f] px-6 py-10 sm:px-12 lg:flex lg:flex-col lg:justify-center lg:px-14 lg:py-16">
      {/* Decorative circles */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-20 size-72 rounded-full bg-white/5" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-white/[0.07]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-32 size-80 rounded-full bg-white/5" />

      <div className="relative flex flex-col items-center text-center">
        {/* Logo lockup */}
        <Link href="/" className="flex items-center gap-3">
          <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-white/95 shadow-sm ring-1 ring-black/5 sm:size-16">
            <Image
              src={logo}
              alt="UnityCare logo"
              fill
              sizes="64px"
              className="object-contain p-1"
              priority
            />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Unity<span className="text-[#a7e8b8]">Care</span>
            </span>
            <span className="mt-1.5 text-xs font-medium tracking-wide text-white/80 sm:text-sm">
              Better Care. Healthier Life.
            </span>
          </span>
        </Link>

        {/* Headline */}
        <h2 className="mt-10 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:mt-14">
          {copy.headline}
        </h2>
        <p className="mt-3 text-base text-white/85 sm:text-lg">{copy.subtext}</p>
      </div>

      {/* Decorative heart + cross, bottom right */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 190"
        className="pointer-events-none absolute -right-8 -bottom-10 size-52 text-white/25 sm:size-64 lg:-right-4 lg:size-72"
      >
        <path
          d="M100 180 C42 138 8 104 8 66 C8 33 33 10 63 10 C80 10 93 19 100 33 C107 19 120 10 137 10 C167 10 192 33 192 66 C192 104 158 138 100 180 Z"
          fill="currentColor"
        />
        {/* Person: head + raised-arms body */}
        <circle cx="88" cy="62" r="11" fill="#157a45" opacity="0.65" />
        <path
          d="M88 76 C77 76 69 84 66 96 L76 100 C79 92 83 88 88 88 C93 88 97 92 100 100 L110 96 C107 84 99 76 88 76 Z"
          fill="#157a45"
          opacity="0.65"
        />
        {/* Medical cross */}
        <path
          d="M133 104 h14 v-14 h16 v14 h14 v16 h-14 v14 h-16 v-14 h-14 Z"
          fill="#157a45"
          opacity="0.65"
        />
      </svg>
    </aside>
  );
}
