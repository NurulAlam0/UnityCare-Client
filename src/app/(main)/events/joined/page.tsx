"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  HeartHandshake,
  LogOut,
  MapPin,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { backendRequest } from "@/lib/backend-api";

type JoinedEventItem = {
  _id: string;
  joinedAt: string;
  event: {
    _id: string;
    title: string;
    description: string;
    eventType: string;
    thumbnail: string;
    location: string;
    eventDate: string;
    creatorEmail?: string;
    creatorName?: string;
    status?: string;
    participantsCount?: number;
  };
};

type JoinedEventsResponse = {
  success: boolean;
  joinedEvents: JoinedEventItem[];
};

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

function formatJoinedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function JoinedEventsPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [joinedItems, setJoinedItems] = useState<JoinedEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [leavingItem, setLeavingItem] = useState<JoinedEventItem | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  const loadJoinedEvents = useCallback(
    () => backendRequest<JoinedEventsResponse>("/joined-events"),
    [],
  );

  useEffect(() => {
    if (isSessionPending) return;
    if (!session) return;

    let active = true;
    loadJoinedEvents()
      .then((response) => {
        if (!active) return;
        // Sort by event date ascending (soonest first)
        const sorted = (response.joinedEvents || []).slice().sort((a, b) => {
          const dateA = new Date(a.event?.eventDate ?? 0).getTime();
          const dateB = new Date(b.event?.eventDate ?? 0).getTime();
          return dateA - dateB;
        });
        setJoinedItems(sorted);
        setLoadError("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load your joined events.",
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isSessionPending, loadJoinedEvents, refreshKey, session]);

  async function handleLeave() {
    if (!leavingItem) return;

    setIsLeaving(true);
    try {
      await backendRequest(`/events/${leavingItem.event._id}/leave`, {
        method: "DELETE",
      });

      setJoinedItems((current) =>
        current.filter((item) => item._id !== leavingItem._id),
      );

      toast.add({
        type: "success",
        title: "Left event",
        description: `You have left "${leavingItem.event.title}".`,
      });
      setLeavingItem(null);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not leave event",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLeaving(false);
    }
  }

  return (
    <section className="min-h-full flex-1 bg-[#f5f8fa] px-4 py-8 dark:bg-[#101b18] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-[#0b8f68] dark:text-[#4ecf9f]">
              Community Engagement
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Joined Events
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Review and manage all community initiatives and volunteer drives you have signed up for.
            </p>
          </div>
          <Button
            render={<Link href="/events" />}
            className="bg-[#0b8f68] text-white hover:bg-[#087758]"
          >
            <Sparkles className="size-4" />
            Explore More Events
          </Button>
        </div>

        {/* States */}
        {isSessionPending || (Boolean(session) && isLoading) ? (
          <div className="rounded-xl border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            Loading your joined events...
          </div>
        ) : !session ? (
          <Card className="items-center gap-3 px-6 py-12 text-center">
            <h2 className="text-lg font-semibold">Sign in to view joined events</h2>
            <p className="text-sm text-muted-foreground">
              Your registrations are tied to your UnityCare account.
            </p>
            <Button
              render={<Link href="/login" />}
              className="mt-2 bg-[#0b8f68] text-white hover:bg-[#087758]"
            >
              Sign in
            </Button>
          </Card>
        ) : loadError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load joined events</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              {loadError}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLoading(true);
                  setLoadError("");
                  setRefreshKey((key) => key + 1);
                }}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : joinedItems.length === 0 ? (
          <Card className="items-center gap-3 px-6 py-12 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-[#e7f5ef] text-[#0b8f68] dark:bg-[#16382d] dark:text-[#4ecf9f]">
              <HeartHandshake className="size-6" />
            </div>
            <h2 className="text-lg font-semibold">No joined events yet</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              You haven&apos;t joined any community events yet. Explore upcoming causes and volunteer today!
            </p>
            <Button
              render={<Link href="/events" />}
              className="mt-2 bg-[#0b8f68] text-white hover:bg-[#087758]"
            >
              <UsersRound className="size-4" />
              Browse Upcoming Events
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {joinedItems.map((item) => {
              const event = item.event;
              if (!event) return null;

              return (
                <Card
                  key={item._id}
                  className="gap-0 overflow-hidden rounded-2xl border-border/70 py-0 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] bg-muted">
                    <Image
                      src={event.thumbnail}
                      alt={event.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <Badge className="absolute left-3 top-3 border-0 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200">
                      {event.eventType}
                    </Badge>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/75 px-2.5 py-1.5 text-xs font-medium text-white">
                      <CalendarDays className="size-3.5 text-emerald-300" />
                      {formatEventDate(event.eventDate)}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="line-clamp-1 text-lg font-semibold text-[#247b67] dark:text-[#69d4b0]">
                      {event.title}
                    </h2>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-4 shrink-0 text-emerald-600" />
                      <span className="line-clamp-1">{event.location}</span>
                    </p>

                    <p className="mt-3 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                      {event.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        <HeartHandshake className="size-3.5" />
                        Joined on {formatJoinedDate(item.joinedAt)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        render={<Link href={`/events/${event._id}`} />}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10"
                        onClick={() => setLeavingItem(item)}
                      >
                        <LogOut className="size-4" />
                        Leave Event
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Leave Event Confirmation Dialog */}
      <AlertDialog
        open={Boolean(leavingItem)}
        onOpenChange={(open) => {
          if (!open && !isLeaving) setLeavingItem(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave this event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave &quot;
              {leavingItem?.event?.title}&quot;? You will no longer be listed as a
              participant for this event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLeaving}>Stay Joined</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLeaving}
              onClick={handleLeave}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isLeaving ? "Leaving..." : "Leave Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

