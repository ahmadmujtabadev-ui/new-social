import React from "react";
import { Store, Handshake, Ticket, Users } from "lucide-react";
import {  useRouter } from "next/router";

const VendorSponsorSection: React.FC = () => {
const router = useRouter()

  return (
    <section
      aria-label="Vendors and Sponsors"
      className="relative overflow-hidden bg-black from-slate-950 via-slate-900 to-slate-800 py-20 md:py-24 px-5"
    >
      {/* Decorative stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-500 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 16 + 8}px`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            ★
          </div>
        ))}
      </div>


      {/* Glowing orbs */}
      <div className="pointer-events-none absolute right-[-70px] top-40 h-[280px] w-[280px] rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[-70px] bottom-16 h-[220px] w-[220px] rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="relative z-[1] mx-auto max-w-[1200px]">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-yellow-400 text-sm font-bold tracking-[0.3em] uppercase mb-3">
            Get Involved
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 mb-4"
              style={{ textShadow: '0 0 40px rgba(250, 204, 21, 0.3)' }}>
            Join the Celebration
          </h2>
          <div className="h-px bg-black from-transparent via-yellow-500/50 to-transparent max-w-md mx-auto"></div>
        </div>

        <div className="mx-auto grid max-w-[980px] grid-cols-1 gap-7 sm:grid-cols-2">
          {/* Vendors */}
          <div className="relative rounded-2xl bg-black from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl p-8 text-center border border-yellow-500/30 shadow-2xl shadow-yellow-500/20 overflow-hidden group hover:border-yellow-400/50 transition-all duration-300">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-yellow-500/30 rounded-br-2xl"></div>
            
            <div className="relative z-10">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-xl bg-yellow-500/20 border border-yellow-500/40">
                <Store size={30} className="text-yellow-400" aria-hidden />
              </div>
              <h3 className="mb-2 text-2xl font-extrabold text-white">
                Vendors Bazaar
              </h3>
              <p className="mb-6 text-base leading-relaxed text-slate-300">
                Explore unique stalls offering fashion, food, art, and more.
              </p>

              <button
                aria-label="Register as vendor"
                onClick={() => router.push("/registration/vendor")}
                className="mx-auto w-full max-w-[260px] rounded-full border-2 border-yellow-500 px-5 py-3 text-sm font-extrabold text-yellow-400 transition-all hover:scale-105 hover:bg-yellow-500 hover:text-slate-900 hover:shadow-xl hover:shadow-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Register as Vendor
              </button>
            </div>
          </div>

          {/* Sponsors */}
          <div className="relative rounded-2xl bg-black from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl p-8 text-center border border-yellow-500/30 shadow-2xl shadow-yellow-500/20 overflow-hidden group hover:border-yellow-400/50 transition-all duration-300">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-yellow-500/30 rounded-br-2xl"></div>
            
            <div className="relative z-10">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-xl bg-yellow-500/20 border border-yellow-500/40">
                <Handshake size={30} className="text-yellow-400" aria-hidden />
              </div>
              <h3 className="mb-2 text-2xl font-extrabold text-white">
                Sponsors &amp; Partners
              </h3>
              <p className="mb-6 text-base leading-relaxed text-slate-300">
                Support this celebration and showcase your brand.
              </p>

              <button
                aria-label="Become a sponsor"
                onClick={() => router.push("/registration/sponser")}
                className="mx-auto w-full max-w-[260px] rounded-full border-2 border-yellow-500 px-5 py-3 text-sm font-extrabold text-yellow-400 transition-all hover:scale-105 hover:bg-yellow-500 hover:text-slate-900 hover:shadow-xl hover:shadow-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Become a Sponsor
              </button>
            </div>
          </div>

          {/* Volunteers */}
          <div className="relative rounded-2xl bg-black from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl p-8 text-center border border-yellow-500/30 shadow-2xl shadow-yellow-500/20 overflow-hidden group hover:border-yellow-400/50 transition-all duration-300">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-yellow-500/30 rounded-br-2xl"></div>
            
            <div className="relative z-10">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-xl bg-yellow-500/20 border border-yellow-500/40">
                <Users size={30} className="text-yellow-400" aria-hidden />
              </div>
              <h3 className="mb-2 text-2xl font-extrabold text-white">
                Become a Volunteer
              </h3>
              <p className="mb-6 text-base leading-relaxed text-slate-300">
                Help us run the event smoothly—pick a timeslot and join the crew.
              </p>

              <button
                aria-label="Register as Volunteer"
                onClick={() => router.push("/registration/volunteers")}
                className="mx-auto w-full max-w-[260px] rounded-full border-2 border-yellow-500 px-5 py-3 text-sm font-extrabold text-yellow-400 transition-all hover:scale-105 hover:bg-yellow-500 hover:text-slate-900 hover:shadow-xl hover:shadow-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Register as Volunteer
              </button>
            </div>
          </div>

          {/* Participants */}
          <div className="relative rounded-2xl bg-black from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl p-8 text-center border border-yellow-500/30 shadow-2xl shadow-yellow-500/20 overflow-hidden group hover:border-yellow-400/50 transition-all duration-300">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-yellow-500/30 rounded-br-2xl"></div>
            
            <div className="relative z-10">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-xl bg-yellow-500/20 border border-yellow-500/40">
                 <Ticket size={30} className="text-yellow-400" aria-hidden />
              </div>
              <h3 className="mb-2 text-2xl font-extrabold text-white">
                Become a Participant
              </h3>
              <p className="mb-6 text-base leading-relaxed text-slate-300">
                Join an activity or competition to win Prizes and be part of the fun!
              </p>

              <button
                aria-label="Become a Participant"
                onClick={() => router.push("/registration/participants")}
                className="mx-auto w-full max-w-[260px] rounded-full border-2 border-yellow-500 px-5 py-3 text-sm font-extrabold text-yellow-400 transition-all hover:scale-105 hover:bg-yellow-500 hover:text-slate-900 hover:shadow-xl hover:shadow-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Become a Participant
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </section>
  );
};

export default VendorSponsorSection;