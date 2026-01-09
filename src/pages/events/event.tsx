import React from "react";
import { Calendar, MapPin, Star } from "lucide-react";
import Header from "@/components/Homepage.tsx/header";
import Link from "next/link";


const events = [
  {
    id: "oakville-eid-2026",
    title: "Oakville Eid Festival",
    badge: "Featured Event",
    date: "Saturday - March 14, 2026",
    time: "Details will be shared soon",
    location: "Oakville, Ontario",
    description:
      "Join us for the biggest Eid celebration in Oakville with cultural performances, delicious food, and family fun!",
    highlights: [
      "Free Entry",
      "Free Parking",
      "Cultural Performances",
      "Food Vendors",
      "Kids Zone",
      "Henna & Face Paint",
    ],
    primaryCtaLabel: "Get Free Tickets",
    primaryCtaHref: "https://oakville-Eid-festival-2026.eventbrite.ca",
    secondaryCtaLabel: "Join us",
    secondaryCtaHref: "/#joinus",
  },
  {
    id: "community-iftar-2026",
    title: "Community Iftar",
    badge: "Upcoming Event",
    date: "2026",
    time: "Details will be shared soon",
    location: "Oakville, Ontario",
    description:
      "Break your fast with neighbours, friends, and family at a warm and welcoming community iftar in Oakville.",
    highlights: [
      "Community Gathering",
      "Family-Friendly",
      "Spiritual Reflections",
      "Light Snacks & Dinner",
    ],
    primaryCtaLabel: "RSVP Now",
    primaryCtaHref: "/#joinus",
    secondaryCtaLabel: "Volunteer",
    secondaryCtaHref: "/#joinus",
  },
  {
    id: "kids-cultural-workshop-2026",
    title: "Kids Cultural Workshop",
    badge: "Family Event",
    date: "2026",
    time: "Details will be shared soon",
    location: "Arts Center, Oakville",
    description:
      "A fun, interactive workshop where kids explore culture through art, storytelling, and hands-on activities.",
    highlights: [
      "Hands-On Activities",
      "Arts & Crafts",
      "Storytelling",
      "Safe Family Environment",
    ],
    primaryCtaLabel: "Register Kids",
    primaryCtaHref: "/#joinus",
    secondaryCtaLabel: "Contact Us",
    secondaryCtaHref: "/#joinus",
  },
  {
    id: "networking-event-2026",
    title: "Networking Event",
    badge: "Community Meetup",
    date: "2026",
    time: "Details will be shared soon",
    location: "Oakville, Ontario",
    description:
      "Connect with local professionals, entrepreneurs, and community members in a relaxed networking setting.",
    highlights: [
      "Meet Local Professionals",
      "Community Connections",
      "Light Refreshments",
      "Icebreaker Activities",
    ],
    primaryCtaLabel: "Reserve Your Spot",
    primaryCtaHref: "/#joinus",
    secondaryCtaLabel: "Become a Sponsor",
    secondaryCtaHref: "/#joinus",
  },
  {
    id: "coming-soon",
    title: "Upcoming Community Event",
    badge: "Coming Soon",
    date: "2026",
    time: "Details to be announced",
    location: "Oakville, Ontario",
    description:
      "Stay tuned for more cultural markets, festivals, and community events organized by Social Connections.",
    highlights: ["Cultural Markets", "Family Activities", "Local Vendors"],
    primaryCtaLabel: "Follow on Instagram",
    primaryCtaHref: "https://www.instagram.com/socialconnectionsevent/",
    secondaryCtaLabel: "Contact Us",
    secondaryCtaHref: "/#joinus",
  },
];


export default function EventSection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-[#f0b400]">
      {/* Navbar */}
      <Header />

      {/* Starry background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      {/* Content wrapper */}
      <main className="relative max-w-6xl mx-auto px-6 md:px-8 pt-28 pb-16 z-10">
        {/* Page heading */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs md:text-sm font-bold tracking-[0.35em] uppercase text-[#f0b400]/80 mb-3">
            Social Connections Events
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-[#f0b400] mb-3">
            Upcoming Events
          </h1>
          <p className="text-[#f0b400]/75 text-sm md:text-base max-w-2xl mx-auto">
            Discover what’s coming up next in Oakville — festivals, markets, and
            community gatherings curated by Social Connections.
          </p>

          <div className="flex justify-center mt-6">
            <div
              className="w-24 h-1 rounded-full"
              style={{ backgroundColor: "#f0b400" }}
            />
          </div>
        </div>

        {/* Events list */}
        <section className="space-y-8 md:space-y-10">
          {events.map((event) => (
            <article
              key={event.id}
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
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#f0b400]/70 mb-2">
                      Highlights
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.highlights.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#f0b400]/60 bg-black/70 text-[11px] md:text-xs text-[#f0b400]"
                        >
                          <Star className="w-3 h-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

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

                      {/* 🔥 Primary CTA - Open New Tab */}
                      <Link
                        href={event.primaryCtaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-4 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wide shadow-lg shadow-yellow-500/40 hover:shadow-yellow-500/70 hover:scale-105 transition-all duration-300 border border-yellow-300"
                      >
                        {event.primaryCtaLabel}
                      </Link>

                      <Link
                        href={event.secondaryCtaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center border border-[#f0b400]/70 text-[#f0b400] px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wide hover:bg-[#f0b400]/10 transition-all duration-300"
                      >
                        {event.secondaryCtaLabel}
                      </Link>
                    </div>
                  </div>

                  {event.id === "oakville-eid-2026" && (
                    <p className="text-[11px] md:text-xs text-[#f0b400]/75 text-center md:text-left">
                      Family-friendly • Indoor event • Limited vendor spots
                      available.
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

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
