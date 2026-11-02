"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Search,
  UsersRound,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { publicBackendRequest } from "@/lib/backend-api";

const categories = [
  "All",
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
];

type EventRecord = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  participantsCount?: number;
  status?: string;
};

type EventsResponse = {
  success: boolean;
  events: EventRecord[];
};

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getEventDateKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return getLocalDateKey(date);
}

function formatEventDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [today, setToday] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    publicBackendRequest<EventsResponse>("/events")
      .then((response) => {
        if (!response.success || !Array.isArray(response.events)) {
          throw new Error("The server returned an invalid events response.");
        }
        if (active) {
          setEvents(response.events);
          setToday(getLocalDateKey(new Date()));
          setLoadError("");
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Could not load events.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryKey]);

  const upcomingEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events
      .filter((event) => {
        const eventDate = getEventDateKey(event.eventDate);
        return today && eventDate && eventDate >= today;
      })
      .filter(
        (event) =>
          selectedCategory === "All" || event.eventType === selectedCategory,
      )
      .filter((event) => {
        if (!query) return true;
        return `${event.title} ${event.location} ${event.description}`
          .toLowerCase()
          .includes(query);
      })
      .sort(
        (first, second) =>
          getEventDateKey(first.eventDate).localeCompare(
            getEventDateKey(second.eventDate),
          ),
      );
  }, [events, search, selectedCategory, today]);

  return (
    <section className="min-h-full flex-1 bg-[#f5f8fa] px-4 py-8 dark:bg-[#101b18] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Upcoming Events
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Discover community events created by volunteers and organizers.
              Past events are automatically excluded.
            </p>
          </div>
          <Button
            render={<Link href="/events/create" />}
            nativeButton={false}
            className="shrink-0 bg-[#0b8f68] text-white hover:bg-[#087758]"
          >
            Create Event
          </Button>
        </div>

        <div className="mb-6 flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-center">
          <div
            aria-label="Filter events by category"
            className="flex min-w-0 flex-1 flex-nowrap gap-1.5 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                size="xs"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "shrink-0 rounded-full bg-[#0b8f8b] px-2.5 text-white hover:bg-[#087c78]"
                    : "shrink-0 rounded-full border-gray-200 bg-white px-2.5 text-gray-600 dark:bg-card dark:text-gray-300"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="relative w-full shrink-0 sm:ml-auto sm:w-[220px]">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search events or areas"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events or areas..."
              className="h-10 rounded-full bg-white pl-9 dark:bg-card"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Card key={index} className="gap-0 overflow-hidden p-0">
                <Skeleton className="aspect-[16/9] w-full rounded-none" />
                <div className="space-y-2.5 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : loadError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load events</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              {loadError}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLoading(true);
                  setRetryKey((key) => key + 1);
                }}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : upcomingEvents.length === 0 ? (
          <Card className="items-center gap-3 px-6 py-14 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-[#e7f5ef] text-[#0b8f68] dark:bg-[#16382d] dark:text-[#4ecf9f]">
              <CalendarDays aria-hidden="true" className="size-6" />
            </div>
            <h2 className="text-lg font-semibold">
              {events.length === 0
                ? "No events have been created yet"
                : "No matching upcoming events"}
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              {events.length === 0
                ? "Community events created by organizers will appear here."
                : "Try another category or search term, or create a new event."}
            </p>
            <Button
              render={<Link href="/events/create" />}
              nativeButton={false}
              className="mt-2 bg-[#0b8f68] text-white hover:bg-[#087758]"
            >
              Create an Event
            </Button>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <Card
                key={event._id}
                className="gap-0 overflow-hidden rounded-2xl border-border/70 py-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link
                  href={`/events/${event._id}`}
                  aria-label={`View ${event.title}`}
                  className="relative block aspect-[16/9] bg-muted"
                >
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    priority={index === 0}
                    unoptimized
                    className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                  <Badge className="absolute left-3 top-3 border-0 bg-white/95 text-[11px] font-semibold text-emerald-800 hover:bg-white dark:bg-emerald-950 dark:text-emerald-200">
                    {event.eventType}
                  </Badge>
                </Link>

                <div className="flex flex-1 flex-col p-4">
                  <h2 className="line-clamp-1 text-[15px] font-semibold text-[#247b67] dark:text-[#69d4b0]">
                    {event.title}
                  </h2>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-emerald-600" />
                    <span className="line-clamp-1">{event.location}</span>
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5 shrink-0 text-emerald-600" />
                    {formatEventDate(event.eventDate)}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="mt-auto flex items-center gap-1.5 border-t pt-2.5 text-xs text-muted-foreground">
                    <UsersRound className="size-3.5 text-emerald-600" />
                    {event.participantsCount ?? 0} joined
                  </div>
                  <Button
                    render={<Link href={`/events/${event._id}`} />}
                    nativeButton={false}
                    className="mt-3 h-9 w-full bg-[#0b8f68] text-sm text-white hover:bg-[#087758]"
                  >
                    View &amp; Join Event
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
