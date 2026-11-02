"use client";

import { useState, type FormEvent } from "react";
import { SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export function CauseAlerts() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      toast.add({
        type: "error",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate instant local subscription feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast.add({
        type: "success",
        title: "Subscribed successfully!",
        description:
          "You will receive alerts when new community initiatives launch.",
      });
    }, 600);
  }

  return (
    <section className="bg-white py-16 transition-colors dark:bg-[#0c1a16] sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-emerald-100/80 bg-gradient-to-br from-[#eafaf4] via-white to-[#f4fbf7] px-6 py-14 shadow-sm transition-all sm:px-12 sm:py-16 dark:border-white/10 dark:from-[#112720] dark:via-[#0c1a16] dark:to-[#12241e]">
          {/* Header */}
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-bold tracking-[0.16em] text-[#0ea477] uppercase dark:text-[#4ecf9f]">
              STAY CONNECTED
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Subscribe to Local Cause Alerts
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
              Get notified when new winter drives, blanket distributions, or emergency cleanups are organized in your neighborhood.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="h-11 rounded-xl border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-none transition focus-visible:border-[#0ea477] focus-visible:ring-1 focus-visible:ring-[#0ea477] dark:border-white/15 dark:bg-[#152a22] dark:text-white dark:placeholder:text-gray-400"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 shrink-0 rounded-xl bg-[#0ea477] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b8a64] disabled:opacity-70"
            >
              <SendHorizontal className="size-4" />
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>

          {/* Guarantee Subtext */}
          <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            No spam guaranteed. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

