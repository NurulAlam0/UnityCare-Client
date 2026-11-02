"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  HeartHandshake,
  LoaderCircle,
  LogIn,
  MapPin,
  Share2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { backendRequest, publicBackendRequest } from "@/lib/backend-api";

type EventRecord = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  participantsCount: number;
  isJoined?: boolean;
  organizer?: {
    name?: string;
    email?: string;
    image?: string | null;
  };
};

type EventResponse = {
  success: boolean;
  event: EventRecord;
};

type JoinResponse = {
  success: boolean;
  participantsCount?: number;
  isJoined?: boolean;
};

type JoinStatusResponse = {
  success: boolean;
  joined: boolean;
};

function formatEventDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EventDetailsClient() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = useSession();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isUpdatingRegistration, setIsUpdatingRegistration] = useState(false);

  // Load event publicly — no login required
  const loadEvent = useCallback(async () => {
    const response = await publicBackendRequest<EventResponse>(`/events/${eventId}`);
    if (!response.event) {
      throw new Error("The server did not return this event.");
    }
    return response.event;
  }, [eventId]);

  // Fetch join status only when session is ready
  const loadJoinStatus = useCallback(async () => {
    try {
      const joinStatus = await backendRequest<JoinStatusResponse>(`/events/${eventId}/join-status`);
      return joinStatus.joined;
    } catch {
      return false;
    }
  }, [eventId]);

  useEffect(() => {
    if (isSessionPending) return;

    let active = true;

    async function fetchAll() {
      try {
        const loadedEvent = await loadEvent();
        if (!active) return;

        // If logged in, also fetch join status
        let isJoined = false;
        if (session) {
          isJoined = await loadJoinStatus();
        }

        if (active) {
          setEvent({ ...loadedEvent, isJoined });
          setLoadError("");
        }
      } catch (error: unknown) {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Could not load this event.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void fetchAll();

    return () => {
      active = false;
    };
  }, [isSessionPending, session, loadEvent, loadJoinStatus]);

  function retryLoadingEvent() {
    setIsLoading(true);
    setLoadError("");
    loadEvent()
      .then(async (loadedEvent) => {
        let isJoined = false;
        if (session) {
          isJoined = await loadJoinStatus();
        }
        setEvent({ ...loadedEvent, isJoined });
        setLoadError("");
      })
      .catch((error: unknown) => {
        setLoadError(
          error instanceof Error ? error.message : "Could not load this event.",
        );
      })
      .finally(() => setIsLoading(false));
  }

  async function handleRegistration() {
    if (!event || isUpdatingRegistration) return;

    // If not logged in, redirect to login
    if (!session) {
      router.push("/login");
      return;
    }

    setIsUpdatingRegistration(true);
    try {
      if (event.isJoined) {
        await backendRequest<{ success: boolean }>(
          `/events/${event._id}/leave`,
          { method: "DELETE" },
        );

        setEvent((current) =>
          current
            ? {
              ...current,
              isJoined: false,
              participantsCount: Math.max(0, current.participantsCount - 1),
            }
            : current,
        );
        toast.add({
          type: "success",
          title: "You left the event",
          description: "You are no longer registered for this initiative.",
        });
      } else {
        const result = await backendRequest<JoinResponse>(
          `/events/${event._id}/join`,
          { method: "POST" },
        );
        if (result.success === false) {
          throw new Error("The server could not add you to this event.");
        }

        setEvent((current) =>
          current
            ? {
              ...current,
              isJoined: result.isJoined ?? true,
              participantsCount:
                result.participantsCount ?? current.participantsCount + 1,
            }
            : current,
        );
        toast.add({
          type: "success",
          title: "You joined the event! 🎉",
          description: "Thanks for supporting this community initiative.",
        });
      }
    } catch (error) {
      toast.add({
        type: "error",
        title: event.isJoined ? "Could not leave event" : "Could not join event",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsUpdatingRegistration(false);
    }
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.add({
        type: "success",
        title: "Event link copied",
        description: "Share it with someone who would like to help.",
      });
    } catch {
      toast.add({
        type: "error",
        title: "Could not copy link",
        description: "Please copy the event URL from your browser.",
      });
    }
  }

  const organizerName = event?.organizer?.name || "Community Organizer";
  const organizerEmail = event?.organizer?.email;
  const organizerImage = event?.organizer?.image;

  return (
    <section className="min-h-full flex-1 bg-[#f5f8fa] px-4 py-6 dark:bg-[#101b18] sm:px-6 sm:py-9">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/events"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Upcoming Events
        </Link>

        {isSessionPending || isLoading ? (
          <Card className="items-center gap-3 px-6 py-16 text-center">
            <LoaderCircle className="size-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading event...</p>
          </Card>
        ) : loadError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load event</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              {loadError}
              <Button variant="outline" size="sm" onClick={retryLoadingEvent}>
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : event ? (
          <Card className="gap-0 rounded-2xl border-border/70 bg-card py-0 shadow-sm">
            <div className="relative h-64 overflow-hidden bg-muted sm:h-[360px]">
              <Image
                src={event.thumbnail}
                alt={event.title}
                fill
                unoptimized
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
              <Badge className="absolute left-5 top-5 border-0 bg-white/95 text-emerald-800 hover:bg-white sm:left-7 sm:top-7">
                {event.eventType}
              </Badge>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {event.title}
                </h1>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4 text-emerald-300" />
                    {event.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4 text-emerald-300" />
                    {formatEventDate(event.eventDate)}
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="space-y-6 px-5 py-5 sm:px-7 sm:py-7">
              <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <UsersRound className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {event.participantsCount ?? 0}{" "}
                      {(event.participantsCount ?? 0) === 1
                        ? "Volunteer"
                        : "Volunteers"}{" "}
                      Joined
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.isJoined
                        ? "You are registered for this initiative"
                        : session
                          ? "Sign up to join hands for this drive"
                          : "Log in to join this community drive"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 sm:shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-lg"
                    aria-label="Copy event link"
                    onClick={handleShare}
                  >
                    <Share2 className="size-4" />
                  </Button>

                  {/* Show Join / Leave / Login button */}
                  {!session ? (
                    <Button
                      onClick={() => router.push("/login")}
                      className="min-w-36 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <LogIn className="size-4" />
                      Login to Join
                    </Button>
                  ) : event.isJoined ? (
                    <Button
                      onClick={handleRegistration}
                      disabled={isUpdatingRegistration}
                      className="min-w-44 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isUpdatingRegistration ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      {isUpdatingRegistration
                        ? "Leaving..."
                        : "Joined (Click to Leave)"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleRegistration}
                      disabled={isUpdatingRegistration}
                      className="min-w-32 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isUpdatingRegistration ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <HeartHandshake className="size-4" />
                      )}
                      {isUpdatingRegistration ? "Joining..." : "Join Event"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_250px]">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    About this Social Initiative
                  </h2>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Volunteer Guidelines
                    </h3>
                    <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Please arrive 15 minutes before the scheduled time at
                        the designated location.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Wear comfortable clothing suitable for physical social
                        work and distribution.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Bring any pre-coordinated relief packages or
                        distribution items if requested.
                      </li>
                    </ul>
                  </div>
                </div>

                <Card className="h-fit gap-3 rounded-xl py-0 shadow-none ring-1 ring-border">
                  <CardHeader className="px-4 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Initiative Organizer
                    </p>
                  </CardHeader>
                  <CardContent className="flex items-center gap-3 px-4 pb-4">
                    {organizerImage ? (
                      <Image
                        src={organizerImage}
                        alt=""
                        width={40}
                        height={40}
                        unoptimized
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {organizerName.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {organizerName}
                      </p>
                      {organizerEmail && (
                        <p className="truncate text-xs text-muted-foreground">
                          {organizerEmail}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <div className="flex items-center gap-2 border-t px-4 py-3 text-xs text-muted-foreground">
                    <ShieldCheck className="size-4 text-primary" />
                    UnityCare community member
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
