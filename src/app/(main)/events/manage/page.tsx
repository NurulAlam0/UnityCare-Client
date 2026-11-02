"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  CalendarDays,
  MapPin,
  Pencil,
  Plus,
  Trash2,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { backendRequest } from "@/lib/backend-api";
import { useSession } from "@/lib/auth-client";

const eventTypes = [
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
  participantsCount: number;
};

type EventsResponse = { success: boolean; events: EventRecord[] };

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

function dateInputValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export default function ManageEventsPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [editType, setEditType] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<EventRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEvents = useCallback(
    () => backendRequest<EventsResponse>("/my-events"),
    [],
  );

  useEffect(() => {
    if (isSessionPending) return;
    if (!session) return;
    let active = true;
    loadEvents()
      .then((response) => {
        if (!active) return;
        setEvents(response.events);
        setLoadError("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(
          error instanceof Error ? error.message : "Could not load your events.",
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isSessionPending, loadEvents, refreshKey, session]);

  async function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingEvent) return;

    const formData = new FormData(event.currentTarget);
    setIsSaving(true);
    try {
      await backendRequest(`/events/${editingEvent._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          eventType: editType,
          thumbnail: formData.get("thumbnail"),
          location: formData.get("location"),
          eventDate: formData.get("eventDate"),
        }),
      });

      setEditingEvent(null);
      toast.add({
        type: "success",
        title: "Event updated",
        description: "Your changes have been saved.",
      });
      setRefreshKey((key) => key + 1);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not update event",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingEvent) return;

    setIsDeleting(true);
    try {
      await backendRequest(`/events/${deletingEvent._id}`, {
        method: "DELETE",
      });
      setEvents((current) =>
        current.filter((event) => event._id !== deletingEvent._id),
      );
      toast.add({
        type: "success",
        title: "Event deleted",
        description: "Your event has been removed.",
      });
      setDeletingEvent(null);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not delete event",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="min-h-full flex-1 bg-[#f5f8fa] px-4 py-8 dark:bg-[#101b18] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-[#0b8f68] dark:text-[#4ecf9f]">
              Your community work
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Manage My Events
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              View and manage the community events you have created.
            </p>
          </div>
          <Button
            render={<Link href="/events/create" />}
            className="bg-[#0b8f68] text-white hover:bg-[#087758]"
          >
            <Plus />
            Create Event
          </Button>
        </div>

        {isSessionPending || (Boolean(session) && isLoading) ? (
          <div className="rounded-xl border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            Loading your events...
          </div>
        ) : !session ? (
          <Card className="items-center gap-3 px-6 py-12 text-center">
            <h2 className="text-lg font-semibold">Sign in to manage your events</h2>
            <p className="text-sm text-muted-foreground">
              Your events are private to your account.
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
            <AlertTitle>Unable to load events</AlertTitle>
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
        ) : events.length === 0 ? (
          <Card className="items-center gap-3 px-6 py-12 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-[#e7f5ef] text-[#0b8f68] dark:bg-[#16382d] dark:text-[#4ecf9f]">
              <CalendarDays className="size-6" />
            </div>
            <h2 className="text-lg font-semibold">No events yet</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Events you create will appear here, where you can edit or remove them.
            </p>
            <Button
              render={<Link href="/events/create" />}
              className="mt-2 bg-[#0b8f68] text-white hover:bg-[#087758]"
            >
              <Plus />
              Create your first event
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card
                key={event._id}
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
                  <div className="mt-4 flex items-center gap-1.5 border-t pt-3 text-sm text-muted-foreground">
                    <UsersRound className="size-4 text-emerald-600" />
                    {event.participantsCount ?? 0} joined
                  </div>
                  <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
                    <Button
                      variant="secondary"
                      render={<Link href={`/events/${event._id}`} />}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      aria-label={`Edit ${event.title}`}
                      onClick={() => {
                        setEditingEvent(event);
                        setEditType(event.eventType);
                      }}
                    >
                      <Pencil />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      aria-label={`Delete ${event.title}`}
                      onClick={() => setDeletingEvent(event)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(editingEvent)}
        onOpenChange={(open) => {
          if (!open && !isSaving) setEditingEvent(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title">Event title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  required
                  maxLength={100}
                  defaultValue={editingEvent.title}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-type">Event type</Label>
                  <Select value={editType} onValueChange={(value) => {
                    if (typeof value === "string") setEditType(value);
                  }}>
                    <SelectTrigger id="edit-type" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-date">Event date</Label>
                  <Input
                    id="edit-date"
                    name="eventDate"
                    type="date"
                    required
                    defaultValue={dateInputValue(editingEvent.eventDate)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  name="location"
                  required
                  maxLength={160}
                  defaultValue={editingEvent.location}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
                <Input
                  id="edit-thumbnail"
                  name="thumbnail"
                  type="url"
                  required
                  defaultValue={editingEvent.thumbnail}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  required
                  minLength={20}
                  maxLength={2000}
                  rows={4}
                  defaultValue={editingEvent.description}
                />
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  onClick={() => setEditingEvent(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#0b8f68] text-white hover:bg-[#087758]"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deletingEvent)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeletingEvent(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingEvent?.title} and its participant registrations will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
