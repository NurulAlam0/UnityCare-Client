"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { publicBackendRequest } from "@/lib/backend-api";

type EventRecord = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorName?: string;
  creatorEmail?: string;
  participantsCount?: number;
};

type RecentEventsResponse = {
  success: boolean;
  events: EventRecord[];
};

function formatEventDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Upcoming";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RecentUpcomingEvents() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    publicBackendRequest<RecentEventsResponse>("/recent-events")
      .then((response) => {
        if (!active) return;
        if (response.success && Array.isArray(response.events)) {
          setEvents(response.events);
        }
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Could not load recent upcoming events.",
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="border-t border-gray-100 bg-white py-14 transition-colors dark:border-white/10 dark:bg-[#0c1a16] sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Recent Upcoming Events
            </h2>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
              Latest 6 community drives scheduled in your city. Get involved today.
            </p>
          </div>
          <Link
            href="/events"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0ea477] transition hover:text-[#0b8a64] dark:text-[#4ecf9f]"
          >
            View All Events
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden rounded-2xl border-gray-100 p-0 shadow-sm dark:border-white/10"
              >
                <Skeleton className="aspect-[16/9] w-full rounded-none" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="mt-2.5 h-3.5 w-1/2 rounded-md" />
                  <Skeleton className="mt-2.5 h-9 w-full rounded-md" />
                  <Skeleton className="mt-4 h-8 w-full rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : error || events.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-10 text-center dark:border-white/10 dark:bg-white/5">
            <Sparkles className="mx-auto size-8 text-emerald-600" />
            <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">
              {error ? "Unable to load events" : "No upcoming events right now"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {error
                ? error
                : "Be the first to organize a drive or check back soon!"}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button
                render={<Link href="/events/create" />}
                className="bg-[#0ea477] text-white hover:bg-[#0b8a64]"
              >
                Create an Event
              </Button>
              <Button
                render={<Link href="/events" />}
                variant="outline"
              >
                Browse All Events
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card
                key={event._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-[#10221c]"
              >
                {/* Thumbnail with overlay badges */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Category Badge */}
                  <Badge className="absolute left-3 top-3 border-0 bg-white/95 text-[11px] font-semibold text-emerald-800 shadow-sm backdrop-blur-sm dark:bg-emerald-950/90 dark:text-emerald-200">
                    {event.eventType}
                  </Badge>

                  {/* Date Badge */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg bg-black/75 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    <CalendarDays className="size-3.5 text-emerald-300" />
                    {formatEventDate(event.eventDate)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-1 text-[15px] font-bold text-gray-900 transition-colors group-hover:text-[#0ea477] dark:text-white dark:group-hover:text-[#4ecf9f]">
                    {event.title}
                  </h3>

                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <MapPin className="size-3.5 shrink-0 text-[#0ea477]" />
                    <span className="line-clamp-1">{event.location}</span>
                  </p>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {event.description}
                  </p>

                  {/* Organizer row */}
                  <div className="mt-auto flex items-center gap-1.5 border-t border-gray-100 pt-2.5 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
                    <UserRound className="size-3.5 text-[#0ea477]" />
                    <span className="truncate">
                      {event.creatorName || "Community Organizer"}
                    </span>
                  </div>

                  {/* Action Button */}
                  <Button
                    render={<Link href={`/events/${event._id}`} />}
                    className="mt-3 h-9 w-full bg-[#0ea477] text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b8a64]"
                  >
                    View Event
                    <ArrowRight className="ml-1 size-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

