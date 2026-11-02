"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Image as ImageIcon,
  MapPin,
  Type,
  LoaderCircle,
  FileText,
} from "lucide-react";

import logo from "@/assets/UnityCare logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { useSession } from "@/lib/auth-client";
import { backendRequest } from "@/lib/backend-api";

const eventTypes = [
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
];

const photoPresets = [
  {
    label: "Winter Clothes",
    url: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Blanket Relief",
    url: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Cleanup",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    label: "Tree Plantation",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
  },
];

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

type FieldErrors = {
  title?: string;
  location?: string;
  imageUrl?: string;
  description?: string;
  eventDate?: string;
};

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = useSession();
  const [eventType, setEventType] = useState(eventTypes[0]);
  const [eventDate, setEventDate] = useState("");
  const [today, setToday] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const currentDate = localDateString(new Date());
    setToday(currentDate);
    setEventDate((date) => date || currentDate);
  }, []);

  function validateFields(data: {
    title: string;
    location: string;
    imageUrl: string;
    description: string;
    eventDate: string;
  }): FieldErrors {
    const errors: FieldErrors = {};

    if (!data.title.trim()) {
      errors.title = "Event title is required.";
    } else if (data.title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters.";
    }

    if (!data.location.trim()) {
      errors.location = "Location is required.";
    } else if (data.location.trim().length < 3) {
      errors.location = "Location must be at least 3 characters.";
    }

    if (!data.imageUrl.trim()) {
      errors.imageUrl = "Thumbnail image URL is required.";
    } else if (!/^https?:\/\/.+/.test(data.imageUrl)) {
      errors.imageUrl = "Must be a valid URL starting with http(s)://";
    }

    if (!data.description.trim()) {
      errors.description = "Description is required.";
    } else if (data.description.trim().length < 20) {
      errors.description = `Description must be at least 20 characters (currently ${data.description.trim().length}).`;
    }

    if (!data.eventDate) {
      errors.eventDate = "Event date is required.";
    } else if (data.eventDate < today) {
      errors.eventDate = "Event date must be today or a future date.";
    }

    return errors;
  }

  function handleBlurField(field: keyof FieldErrors, value: string) {
    const errors = validateFields({
      title: field === "title" ? value : "",
      location: field === "location" ? value : "",
      imageUrl: field === "imageUrl" ? value : imageUrl,
      description: field === "description" ? value : "",
      eventDate: field === "eventDate" ? value : eventDate,
    });
    // Only set error for this specific field
    setFieldErrors((prev) => ({ ...prev, [field]: errors[field] ?? "" }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = (formData.get("title") as string) ?? "";
    const location = (formData.get("location") as string) ?? "";
    const description = (formData.get("description") as string) ?? "";

    const errors = validateFields({ title, location, imageUrl, description, eventDate });
    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      const firstError = Object.values(errors).find(Boolean)!;
      toast.add({
        type: "error",
        title: "Validation failed",
        description: firstError,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await backendRequest("/events", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventType,
          thumbnail: imageUrl.trim(),
          location: location.trim(),
          eventDate,
          creatorEmail: session?.user.email,
          creatorName: session?.user.name,
        }),
      });

      toast.add({
        type: "success",
        title: "Event created! 🎉",
        description: "Your community event has been published.",
      });
      router.push("/events");
    } catch (submitError) {
      toast.add({
        type: "error",
        title: "Could not create event",
        description:
          submitError instanceof Error
            ? submitError.message
            : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClass = (hasError: boolean) =>
    `h-9 pl-9 text-sm ${hasError ? "border-red-400 focus-visible:ring-red-400/30" : ""}`;

  return (
    <section className="min-h-full flex-1 bg-[#f5f8fa] px-4 py-6 dark:bg-[#101b18] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/events"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Upcoming Events
        </Link>

        {isSessionPending ? (
          <Card className="items-center gap-3 px-6 py-16 text-center">
            <LoaderCircle className="size-6 animate-spin text-[#0ea477]" />
            <p className="text-sm text-muted-foreground">Checking authentication...</p>
          </Card>
        ) : !session ? (
          <Card className="items-center gap-3 px-6 py-12 text-center">
            <h2 className="text-lg font-semibold">Sign in to create an event</h2>
            <p className="text-sm text-muted-foreground">
              You must be signed in to create and organize community events.
            </p>
            <Button
              render={<Link href="/login" />}
              className="mt-2 bg-[#0b8f68] text-white hover:bg-[#087758]"
            >
              Sign in
            </Button>
          </Card>
        ) : (
          <Card className="gap-0 rounded-2xl border-border/70 bg-card py-0 shadow-sm">
            <CardHeader className="border-b px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5">
                  <Image
                    src={logo}
                    alt="UnityCare logo"
                    fill
                    sizes="36px"
                    className="object-contain p-1"
                  />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-primary">UnityCare</p>
                  <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground">
                    COMMUNITY ACTION
                  </p>
                </div>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Create a Community Event
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Organize a local relief effort, environmental cleanup, or community support drive.
              </p>
            </CardHeader>

            <CardContent className="px-5 py-5 sm:px-6">
              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                {/* Title */}
                <div>
                  <Label htmlFor="event-title" className="mb-1.5 text-xs font-medium">
                    Event Title <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Type
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="event-title"
                      name="title"
                      required
                      maxLength={100}
                      placeholder="e.g. Winter Clothes Distribution — Mirpur 10, Dhaka"
                      className={fieldClass(Boolean(fieldErrors.title))}
                      onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                        handleBlurField("title", e.target.value)
                      }
                    />
                  </div>
                  {fieldErrors.title && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>
                  )}
                </div>

                {/* Type + Date */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="event-type" className="mb-1.5 text-xs font-medium">
                      Event Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={eventType}
                      onValueChange={(value) => {
                        if (typeof value === "string") setEventType(value);
                      }}
                    >
                      <SelectTrigger id="event-type" className="h-9 w-full">
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

                  <div>
                    <Label htmlFor="event-date" className="mb-1.5 text-xs font-medium">
                      Event Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <CalendarDays
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        id="event-date"
                        name="eventDate"
                        type="date"
                        required
                        min={today}
                        value={eventDate}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          setEventDate(event.target.value);
                          setFieldErrors((prev) => ({ ...prev, eventDate: "" }));
                        }}
                        onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                          handleBlurField("eventDate", e.target.value)
                        }
                        className={`h-9 pl-9 text-sm ${fieldErrors.eventDate ? "border-red-400" : ""}`}
                      />
                    </div>
                    {fieldErrors.eventDate ? (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.eventDate}</p>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Choose today or a future date.
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="event-location" className="mb-1.5 text-xs font-medium">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="event-location"
                      name="location"
                      required
                      maxLength={160}
                      placeholder="e.g. Mirpur 10, Dhaka"
                      className={fieldClass(Boolean(fieldErrors.location))}
                      onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                        handleBlurField("location", e.target.value)
                      }
                    />
                  </div>
                  {fieldErrors.location && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.location}</p>
                  )}
                </div>

                {/* Thumbnail URL */}
                <div>
                  <Label htmlFor="event-image" className="mb-1.5 text-xs font-medium">
                    Thumbnail Image URL <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <ImageIcon
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="event-image"
                      name="thumbnail"
                      type="url"
                      required
                      value={imageUrl}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setImageUrl(event.target.value);
                        setFieldErrors((prev) => ({ ...prev, imageUrl: "" }));
                      }}
                      onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                        handleBlurField("imageUrl", e.target.value)
                      }
                      placeholder="https://images.unsplash.com/photo-..."
                      className={fieldClass(Boolean(fieldErrors.imageUrl))}
                    />
                  </div>
                  {fieldErrors.imageUrl && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.imageUrl}</p>
                  )}

                  {imageUrl && !fieldErrors.imageUrl && (
                    <div className="relative mt-2 h-28 overflow-hidden rounded-lg border">
                      <Image
                        src={imageUrl}
                        alt="Event thumbnail preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span>Quick photo presets:</span>
                    {photoPresets.map((preset, index) => (
                      <span key={preset.label} className="inline-flex items-center gap-2">
                        {index > 0 && <span aria-hidden="true">·</span>}
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={() => {
                            setImageUrl(preset.url);
                            setFieldErrors((prev) => ({ ...prev, imageUrl: "" }));
                          }}
                          className="h-auto p-0 text-primary"
                        >
                          {preset.label}
                        </Button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="event-description" className="mb-1.5 text-xs font-medium">
                    Event Description <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <FileText
                      aria-hidden="true"
                      className="absolute left-3 top-3 size-4 text-muted-foreground"
                    />
                    <Textarea
                      id="event-description"
                      name="description"
                      required
                      minLength={20}
                      maxLength={2000}
                      rows={3}
                      placeholder="Explain the purpose of the drive, volunteers required, items being distributed or tasks to complete..."
                      className={`min-h-20 resize-y pl-9 text-sm ${fieldErrors.description ? "border-red-400" : ""}`}
                      onBlur={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleBlurField("description", e.target.value)
                      }
                    />
                  </div>
                  {fieldErrors.description ? (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Add at least 20 characters so volunteers know how they can help.
                    </p>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                  <Button variant="outline" size="lg" render={<Link href="/events" />}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Check aria-hidden="true" className="size-4" />
                    {isSubmitting ? "Publishing..." : "Create Event"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
