import { CauseAlerts } from "@/components/home/cause-alerts";
import { Hero } from "@/components/home/hero";
import { PlatformFeatures } from "@/components/home/platform-features";
import { RecentUpcomingEvents } from "@/components/home/recent-events";
import { VisualStories } from "@/components/home/visual-stories";

export default function Home() {
  return (
    <>
      <Hero />
      <PlatformFeatures />
      <RecentUpcomingEvents />
      <VisualStories />
      <CauseAlerts />
    </>
  );
}
