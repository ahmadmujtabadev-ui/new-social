import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Star } from "lucide-react";
import Header from "@/components/Homepage.tsx/header";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchEvents } from "@/services/dashbord/asyncThunk";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

interface EventMedia {
  images: string[];
  videos: string[];
  coverImage?: string;
}

interface PastEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  attendees: string;
  media: EventMedia;
  coverImage?: string;
}


const generateImages = (
  folder: string,
  prefix: string,
  count: number,
  ext: string = "jpg"
) => {
  return Array.from({ length: count }, (_, i) =>
    `/${folder}/${prefix}${i}.${ext}`
  );
};

const pastEvents: PastEvent[] = [
  /*{
    id: "eid-2025",
    title: "Oakville Eid Festival 2025",
    date: "April 2025",
    location: "Oakville Community Center",
    description: "A spectacular celebration with over 500 attendees, featuring cultural performances, food stalls, and activities for all ages.",
    attendees: "500+",
    media: {
      images: [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
        "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&q=80",
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      ],
      videos: [
        "dQw4w9WgXcQ", // YouTube video IDs
        "9bZkp7q19f0",
      ]
    }
  },*/
  {
    id: "diwali-2025",
    title: "Oakville Diwali Festival",
    date: "October 19, 2025",
    location: "1280 Dundas Street E. Oakville",
    description:
      "A vibrant celebration of light, culture, and community in the heart of Oakville.",
    attendees: "200+",
    media: {
      coverImage: "/Diwali/Title.jpg",
      images: generateImages("Diwali", "di", 41), // 🔥 dynamic images
      videos: ["https://youtube.com/shorts/jWXxOGigteY"],

    },
  },
  /* {
     id: "cultural-workshop-2024",
     title: "Kids Cultural Workshop 2024",
     date: "December 2024",
     location: "Arts Center Oakville",
     description: "An engaging workshop where 75+ children explored cultural arts through storytelling, crafts, and interactive activities.",
     attendees: "75+",
     media: {
       images: [
         "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
         "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80",
         "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80",
         "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
       ],
       videos: []
     }
   },*/
];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<PastEvent | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { events } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    dispatch(fetchEvents());
  };

  // Filter only published and active events for frontend display
  const publishedEvents = events.filter(
    event => event.status === 'published' && event.isActive
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-[#f0b400]">
      <Header />

      {/* Starry background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-500 opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 18 + 10}px`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ★
          </div>
        ))}
      </div>

      <main className="relative max-w-6xl mx-auto px-6 md:px-8 pt-28 pb-16 z-10">
        {/* Page heading */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs md:text-sm font-bold tracking-[0.35em] uppercase text-[#f0b400]/80 mb-3">
            Social Connections Events
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-[#f0b400] mb-3">
            Our Events
          </h1>
          <p className="text-[#f0b400]/75 text-sm md:text-base max-w-2xl mx-auto">
            Discover our upcoming celebrations and explore memories from past community gatherings.
          </p>

          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 rounded-full bg-[#f0b400]" />
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => {
              setActiveTab("upcoming");
              setSelectedEvent(null);
            }}
            className={`px-8 py-3 rounded-full font-bold uppercase tracking-wide text-sm transition-all duration-300 ${activeTab === "upcoming"
              ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/40"
              : "bg-black/60 border border-[#f0b400]/60 text-[#f0b400] hover:bg-[#f0b400]/10"
              }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => {
              setActiveTab("past");
              setSelectedEvent(null);
            }}
            className={`px-8 py-3 rounded-full font-bold uppercase tracking-wide text-sm transition-all duration-300 ${activeTab === "past"
              ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/40"
              : "bg-black/60 border border-[#f0b400]/60 text-[#f0b400] hover:bg-[#f0b400]/10"
              }`}
          >
            Past Events
          </button>
        </div>

        {/* Upcoming Events Content */}
        {activeTab === "upcoming" && (
          <section className="space-y-8 md:space-y-10">
            {publishedEvents.map((event) => (
              <article
                key={event._id}
                className="relative bg-black/85 border border-[#f0b400]/35 rounded-3xl p-6 md:p-8 lg:p-9 shadow-[0_0_50px_rgba(240,180,0,0.15)] overflow-hidden"
              >
                {/* Soft glow */}
                <div className="pointer-events-none absolute -top-10 right-10 w-40 h-40 bg-[#f0b400]/15 blur-3xl rounded-full" />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f0b400]/60 bg-black/60 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[#f0b400] mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f0b400]" />
                  {event.badge}
                </div>

                <div className="grid gap-6 md:gap-8 md:grid-cols-5 items-start">
                  {/* Left: main info */}
                  <div className="md:col-span-3 space-y-4">
                    <h2 className="text-2xl md:text-3xl font-black text-[#f0b400]">
                      {event.title}
                    </h2>
                    <p className="text-sm md:text-base text-[#f0b400]/80">
                      {event.description}
                    </p>

                    {/* Date & time */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black border border-[#f0b400]/70">
                          <Calendar className="w-4 h-4 text-[#f0b400]" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-[#f0b400]/70">
                            Date & Time
                          </p>
                          <p className="text-sm md:text-base text-white font-semibold">
                            {event.date}
                          </p>
                          <p className="text-xs md:text-sm text-[#f0b400]/75">
                            {event.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 mt-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black border border-[#f0b400]/70">
                        <MapPin className="w-4 h-4 text-[#f0b400]" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#f0b400]/70">
                          Venue
                        </p>
                        <p className="text-sm md:text-base text-white font-semibold">
                          {event.location}
                        </p>
                      </div>
                    </div>

                    {/* Highlights */}
                    {event.highlights.map((feature: any, idx: any) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#f0b400]/60 bg-black/70 text-[11px] md:text-xs text-[#f0b400]"
                      >
                        <Star className="w-3 h-3" />
                        {feature}
                      </span>
                    ))}

                  </div>

                  {/* Right: CTA section */}
                  <div className="md:col-span-2 flex flex-col items-stretch justify-between gap-4 md:gap-6">
                    <div className="bg-gradient-to-b from-[#f0b400]/15 via-[#f0b400]/5 to-transparent rounded-2xl border border-[#f0b400]/50 p-5 flex flex-col gap-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#f0b400]/80">
                        Join Us
                      </p>
                      <p className="text-sm text-[#f0b400]/85">
                        Reserve your spot, invite friends and family, and be part
                        of our next celebration.
                      </p>

                      <div className="flex flex-col gap-2 mt-2">
                        {/* Primary CTA */}
                        <Link
                          href={event.primaryCta.href}
                          target={event.primaryCta.href.startsWith('http') ? '_blank' : '_self'}
                          rel={event.primaryCta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-4 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wide shadow-lg shadow-yellow-500/40 hover:shadow-yellow-500/70 hover:scale-105 transition-all duration-300 border border-yellow-300"
                        >
                          {event.primaryCta.label}
                        </Link>

                        {/* Secondary CTA */}
                        <Link
                          href={event.secondaryCta.href}
                          target={event.secondaryCta.href.startsWith('http') ? '_blank' : '_self'}
                          rel={event.secondaryCta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-center border border-[#f0b400]/70 text-[#f0b400] px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wide hover:bg-[#f0b400]/10 transition-all duration-300"
                        >
                          {event.secondaryCta.label}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Past Events Content */}
        {activeTab === "past" && !selectedEvent && (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <article
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="relative bg-black/85 border border-[#f0b400]/35 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(240,180,0,0.12)] hover:shadow-[0_0_50px_rgba(240,180,0,0.25)] transition-all duration-300 cursor-pointer group"
              >
                {/* Event thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.media.images[0]}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-[#f0b400] mb-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-[#f0b400]/80">{event.date}</p>
                  </div>
                </div>

                {/* Event info */}
                <div className="p-5">
                  <p className="text-sm text-[#f0b400]/80 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#f0b400]/70">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#f0b400]/10 border border-[#f0b400]/40 text-xs text-[#f0b400] font-semibold">
                      {event.attendees} Attendees
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-sm font-bold uppercase tracking-wide group-hover:shadow-lg group-hover:shadow-yellow-500/40 transition-all duration-300">
                    View Gallery
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Past Event Gallery View */}
        {activeTab === "past" && selectedEvent && (
          <div className="space-y-8">
            {/* Back button and header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-6 py-2 rounded-full bg-black/60 border border-[#f0b400]/60 text-[#f0b400] text-sm font-semibold hover:bg-[#f0b400]/10 transition-all"
              >
                ← Back to Events
              </button>
            </div>

            {/* Event details header */}
            <div className="bg-black/85 border border-[#f0b400]/35 rounded-3xl p-8 shadow-[0_0_50px_rgba(240,180,0,0.15)]">
              <h2 className="text-3xl md:text-4xl font-black text-[#f0b400] mb-3">
                {selectedEvent.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-[#f0b400]/80 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedEvent.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#f0b400]/10 border border-[#f0b400]/40 text-[#f0b400] font-semibold">
                  {selectedEvent.attendees} Attendees
                </div>
              </div>
              <p className="text-[#f0b400]/80">{selectedEvent.description}</p>
            </div>

            {/* Videos Section */}
            {selectedEvent.media.videos.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-[#f0b400] mb-4">
                  Event Videos
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {selectedEvent.media.videos.map((videoId, idx) => (
                    <div
                      key={idx}
                      className="relative bg-black/85 border border-[#f0b400]/35 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(240,180,0,0.12)]"
                    >
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={`Event video ${idx + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos Section */}
            <div>
              <h3 className="text-2xl font-bold text-[#f0b400] mb-4">
                Event Photos
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {selectedEvent.media.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative bg-black/85 border border-[#f0b400]/35 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(240,180,0,0.12)] hover:shadow-[0_0_50px_rgba(240,180,0,0.25)] transition-all duration-300 group cursor-pointer aspect-square"
                  >
                    <img
                      src={img}
                      alt={`Event photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom tagline */}
        <div className="text-center mt-10">
          <p className="text-[#f0b400]/70 text-xs md:text-sm uppercase tracking-[0.28em]">
            Celebrating Community • Culture • Connection
          </p>
        </div>
      </main>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}