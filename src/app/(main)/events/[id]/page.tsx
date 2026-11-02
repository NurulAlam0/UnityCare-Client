import { Suspense } from "react";

import { EventDetailsClient } from "./event-details-client";

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-[#f5f8fa] px-4 py-16 text-sm text-muted-foreground dark:bg-[#101b18]">
          Loading event...
        </div>
      }
    >
      <EventDetailsClient />
    </Suspense>
  );
}
