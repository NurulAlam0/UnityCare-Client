import Image from "next/image";
import { MapPin } from "lucide-react";

type StoryItem = {
  id: string;
  tag: string;
  title: string;
  location: string;
  image: string;
};

const stories: StoryItem[] = [
  {
    id: "1",
    tag: "WARMTH FOR RICKSHAW PULLERS",
    title: "Winter Clothes Drive",
    location: "Mirpur 10, Dhaka",
    image:
      "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    tag: "SHELTERLESS NIGHT SUPPORT",
    title: "Night Blanket Relief",
    location: "Mohammadpur, Dhaka",
    image:
      "https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    tag: "ECO PLASTIC-FREE WATERS",
    title: "Dhanmondi Lake Clean-up",
    location: "Dhanmondi, Dhaka",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    tag: "GREEN ROOTS INITIATIVE",
    title: "Urban Tree Plantation",
    location: "Ramna Park, Dhaka",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    tag: "HUNGER-FREE STREETS",
    title: "Community Food Relief",
    location: "Old Dhaka, Dhaka",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    tag: "EDUCATION FOR EVERY CHILD",
    title: "Children Book & Bag Drive",
    location: "Kuril, Dhaka",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
  },
];

export function VisualStories() {
  return (
    <section className="border-t border-gray-100 bg-[#fbfaf8] py-16 transition-colors dark:border-white/10 dark:bg-[#0c1a16] sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.16em] text-[#0ea477] uppercase dark:text-[#4ecf9f]">
            VISUAL STORIES
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Community in Action
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
            Moments from volunteer drives, relief distributions, and green initiatives across Dhaka and beyond.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <div
              key={story.id}
              className="group relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Image
                src={story.image}
                alt={story.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Content on bottom */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-block w-fit rounded-md bg-[#0ea477] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
                  {story.tag}
                </span>

                <h3 className="mt-1.5 text-lg font-bold text-white drop-shadow-sm">
                  {story.title}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/85">
                  <MapPin className="size-3.5 text-[#4ecf9f]" />
                  <span>{story.location}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

