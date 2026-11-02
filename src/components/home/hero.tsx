import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Plus, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import parkCleanup from "@/assets/UnityCare Park Cleanup .png";

const avatars = [
  "from-rose-300 to-amber-200",
  "from-amber-200 to-orange-300",
  "from-sky-300 to-indigo-400",
];

const impactPills = [
  { icon: Leaf, label: "Clean Environment", className: "bg-[#d9f0b3] translate-x-0" },
  { icon: Users, label: "Stronger Community", className: "bg-[#edf6da] translate-x-14" },
  { icon: Heart, label: "A Better Tomorrow", className: "bg-[#b5e56b] translate-x-28" },
];

const stats = [
  { value: "280k+", label: "Volunteers" },
  { value: "6k+", label: "Events Organized" },
  { value: "12k+", label: "Lives Impacted" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0f5248] font-heading text-white">
      {/* Photo panel with curved left edge (md+) */}
      <div className="absolute inset-y-0 right-0 left-[57%] z-0 hidden overflow-hidden rounded-l-[12%_50%] md:block">
        <Image
          src={parkCleanup}
          alt="UnityCare volunteers collecting recyclables in a park"
          fill
          priority
          sizes="43vw"
          className="object-cover"
        />
      </div>

      {/* Decorative squares */}
      <div aria-hidden className="absolute right-[2%] top-[74%] hidden h-10 w-10 bg-white md:block" />
      <div aria-hidden className="absolute right-[7%] top-[77%] hidden h-7 w-7 bg-white/40 md:block" />

      {/* Decorative leaf on the curve */}
      <Leaf
        aria-hidden
        className="absolute bottom-12 left-[53%] hidden h-10 w-10 -rotate-12 text-[#74c04d] md:block"
      />

      <div className="relative z-10 flex w-full flex-col justify-center px-6 py-16 sm:px-10 md:min-h-screen lg:w-[58%] lg:px-16">
        {/* Social proof badge */}
        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/10 p-2 pr-6 backdrop-blur-md">
          <div className="flex -space-x-3">
            {avatars.map((gradient) => (
              <span
                key={gradient}
                aria-hidden
                className={cn(
                  "h-9 w-9 rounded-full bg-gradient-to-br ring-2 ring-[#0f5248]",
                  gradient,
                )}
              />
            ))}
          </div>
          <p className="text-sm text-white/90 sm:text-base">
            <span className="font-semibold text-[#b5e56b]">154K+</span> people have joined us
          </p>
        </div>

        {/* Headline */}
        <h1 className="mt-8 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.5rem]">
          Together, We Care.
          <br />
          Together, We
          <br />
          <span className="text-[#b5e56b]">Change Lives.</span>
        </h1>

        <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-white/85">
          Discover meaningful community events, connect with passionate volunteers, and
          make a real difference in the world around you.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href="/events"
            className="group inline-flex items-center gap-3 rounded-full bg-[#b5e56b] px-8 py-4 text-lg font-semibold text-[#0f5248] transition-colors hover:bg-[#a3d95c]"
          >
            Explore Events
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/events/create"
            className="group inline-flex items-center gap-4 text-lg font-medium text-white transition-opacity hover:opacity-95"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0f5248] transition-transform group-hover:scale-105">
              <Plus className="h-6 w-6 stroke-[2.5]" />
            </span>
            Create Event
          </Link>
        </div>

        {/* Stats */}
        <dl className="mt-14 flex flex-wrap items-center">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn("pr-10", i !== 0 && "border-l border-white/20 pl-10")}
            >
              <dd className="text-4xl font-bold lg:text-5xl">{stat.value}</dd>
              <dt className="mt-2 text-white/80">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Floating impact pills (md+) */}
      <div className="absolute bottom-12 left-[58%] z-20 hidden flex-col gap-3 md:flex">
        {impactPills.map(({ icon: Icon, label, className }) => (
          <span
            key={label}
            className={cn(
              "inline-flex w-fit -rotate-6 items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-[#0f5248] shadow-lg",
              className,
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </span>
        ))}
      </div>

      {/* Mobile photo */}
      <div className="relative mx-6 mb-10 h-72 overflow-hidden rounded-3xl sm:mx-10 md:hidden">
        <Image
          src={parkCleanup}
          alt="UnityCare volunteers collecting recyclables in a park"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
