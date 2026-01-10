// src/components/EventSection.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, MapPin, Star } from "lucide-react";
import Header from "@/components/Homepage.tsx/header";
import Link from "next/link";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchEvents } from "@/services/dashbord/asyncThunk";

export default function EventSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading, error } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    dispatch(fetchEvents());
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-[#f0b400] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#f0b400] mb-4"></div>
          <p className="text-[#f0b400]/80">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-[#f0b400]">
        <Header />
        <div className="max-w-6xl mx-auto px-6 pt-28 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadEvents}
            className="bg-[#f0b400] text-black px-6 py-2 rounded-full font-semibold hover:bg-[#f0b400]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Filter only published and active events for frontend display
  const publishedEvents = events.filter(
    event => event.status === 'published' && event.isActive
  );

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
            Discover what is coming up next in Oakville — festivals, markets, and
            community gatherings curated by Social Connections.
          </p>

          <div className="flex justify-center mt-6">
            <div
              className="w-24 h-1 rounded-full"
              style={{ backgroundColor: "#f0b400" }}
            />
          </div>
        </div>

        {/* No events message */}
        {publishedEvents.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-[#f0b400] mb-2">No Events Available</h3>
            <p className="text-[#f0b400]/70">
              Check back soon for upcoming community events!
            </p>
          </div>
        )}

        {/* Events list */}
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

        {/* Bottom tagline */}
        {publishedEvents.length > 0 && (
          <div className="text-center mt-10">
            <p className="text-[#f0b400]/70 text-xs md:text-sm uppercase tracking-[0.28em]">
              Celebrating Community • Culture • Connection
            </p>
          </div>
        )}
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