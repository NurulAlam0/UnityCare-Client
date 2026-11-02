import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import logo from "@/assets/UnityCare logo.png";

const chipLinks = [
  { label: "Upcoming Events", href: "/events" },
  { label: "Create Event", href: "/events/create" },
  { label: "Manage Events", href: "/events/manage" },
  { label: "Joined Events", href: "/events/joined" },
];

const contactRows = [
  { icon: Mail, label: "Email us", value: "hello@unitycare.org", href: "mailto:hello@unitycare.org" },
  { icon: Phone, label: "Call us", value: "+880 1700-000000", href: "tel:+8801700000000" },
  { icon: MapPin, label: "Visit us", value: "Dhaka, Bangladesh" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Twitter",
    href: "#",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-transparent bg-white [border-image:linear-gradient(90deg,#0ea477,#7ed957)_1] transition-colors dark:border-white/10 dark:bg-[#0c1a16]">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* Left: brand + description + quick links */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-black/10">
                <Image
                  src={logo}
                  alt="UnityCare logo"
                  fill
                  sizes="36px"
                  className="object-contain p-0.5"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-lg font-bold text-[#0b8f68] dark:text-[#4ecf9f]">
                  UnityCare
                </span>
                <span className="mt-0.5 text-[9px] font-medium tracking-[0.12em] text-gray-500 dark:text-gray-400">
                  COMMUNITY ACTION
                </span>
              </span>
            </Link>

            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-gray-600 dark:text-gray-400">
              A community-driven event management platform empowering everyday
              citizens to create, join, and track impactful social development
              drives.
            </p>

            {/* Quick link chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {chipLinks.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-[#0ea477]/40 hover:bg-[#0ea477]/10 hover:text-[#0b8f68] dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-[#4ecf9f]/40 dark:hover:bg-[#4ecf9f]/10 dark:hover:text-[#4ecf9f]"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: contact + socials */}
          <div>
            <h3 className="text-[11px] font-bold tracking-wider text-gray-900 uppercase dark:text-white">
              Contact Us
            </h3>

            <ul className="mt-3 space-y-2.5">
              {contactRows.map((row) => {
                const Icon = row.icon;
                const content = (
                  <>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#0ea477]/10 text-[#0ea477] dark:bg-[#4ecf9f]/10 dark:text-[#4ecf9f]">
                      <Icon aria-hidden="true" className="size-3.5" />
                    </span>
                    <span className="text-[13px] text-gray-600 transition-colors group-hover:text-[#0b8f68] dark:text-gray-400 dark:group-hover:text-[#4ecf9f]">
                      {row.value}
                    </span>
                  </>
                );

                return (
                  <li key={row.label}>
                    {row.href ? (
                      <a
                        href={row.href}
                        aria-label={row.label}
                        className="group inline-flex items-center gap-2.5"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="group inline-flex items-center gap-2.5">
                        {content}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Social icons */}
            <div className="mt-4 flex items-center gap-2.5">
              {socialLinks.map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full bg-[#0ea477] text-white transition-colors hover:bg-[#0b8f68] dark:bg-[#0ea477] dark:hover:bg-[#4ecf9f] dark:hover:text-[#0c1a16]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-7 flex flex-col items-center justify-between gap-2 border-t border-gray-100 pt-4 text-[12px] text-gray-500 sm:flex-row dark:border-white/10 dark:text-gray-400">
          <p>© 2026 UnityCare. Built with care for community service and social development.</p>
          <p>All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
