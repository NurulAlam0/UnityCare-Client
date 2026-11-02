import {
  CalendarCheck,
  Compass,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const features = [
  {
    icon: UsersRound,
    iconBg: "bg-teal-50 dark:bg-teal-950/50 text-[#0ea477] dark:text-[#4ecf9f]",
    title: "Community-Led Drives",
    description:
      "Every citizen can organize cleanups, winter drives, and food distributions in their local area in minutes.",
  },
  {
    icon: CalendarCheck,
    iconBg: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
    title: "One-Click Participation",
    description:
      "Join verified social initiatives with a single click and coordinate directly with local volunteer leaders.",
  },
  {
    icon: ShieldCheck,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
    title: "Creator Controls",
    description:
      "Manage, update, and track participation for your own initiatives with built-in creator authorization.",
  },
  {
    icon: Compass,
    iconBg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
    title: "Upcoming Only Discovery",
    description:
      "Strict future-date filters guarantee you will always discover upcoming active initiatives that need volunteers.",
  },
];

export function PlatformFeatures() {
  return (
    <section className="bg-[#fbfaf8] py-16 transition-colors dark:bg-[#0c1a16] sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.16em] text-[#0ea477] uppercase dark:text-[#4ecf9f]">
            PLATFORM FEATURES
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Built for Grassroots Action
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
            A frictionless platform connecting compassionate citizens with direct local community initiatives.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-[#10221c]"
              >
                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${feature.iconBg}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

