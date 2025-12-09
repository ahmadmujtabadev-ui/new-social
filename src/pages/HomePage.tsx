import React from "react";
import Header from "@/components/Homepage.tsx/header";
import SlideContext from "@/components/Homepage.tsx/slideContext";
import EventSection from "@/pages/events/event";
import VendorSponsorSection from "@/components/Homepage.tsx/vendor";
import { AboutSection, TeamSection} from "@/components/Homepage.tsx/teamAbount";
import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";

const INK = "#0e0f10";

// Reusable Gold Line Component
const GoldLine = () => (
  <div className="flex justify-center my-12">
    <div className="w-24 h-1 rounded-full" style={{ backgroundColor: "#f0b400" }}></div>
  </div>
);

const EventLandingPage = () => {
    return (
        <div className="relative w-full min-h-screen" style={{ backgroundColor: INK }}>
            <Header />

            {/* SLIDER */}
            <SlideContext />
            <GoldLine />

            {/* EVENTS SECTION */}
            <EventSection />
            <GoldLine />

            {/* VENDOR + SPONSOR SECTION */}
            <div id="joinus">
                <VendorSponsorSection />
            </div>
            <GoldLine />

            {/* TEAM SECTION */}
            <TeamSection />
            <GoldLine />

            {/* TESTIMONIALS */}
            {/* <TestimonialsSection /> */}
            {/* <GoldLine /> */}

            {/* ABOUT SECTION */}
            <div id="AboutSection">
                <AboutSection />
            </div>
            <GoldLine />

            {/* SOCIAL MEDIA SIDE BUTTONS */}
            <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-0 shadow-2xl">

                {/* Instagram */}
                <a
                    href="https://www.instagram.com/socialconnectionsevent/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16
                        hover:w-12 hover:h-12 md:hover:w-14 md:hover:h-14 lg:hover:w-20 lg:hover:h-20 
                        bg-gradient-to-br from-purple-600 to-pink-600 
                        flex items-center justify-center 
                        transition-all duration-300
                    "
                    title="Instagram"
                >
                    <FaInstagram className="text-white text-xl md:text-2xl lg:text-3xl" />
                </a>

                {/* WhatsApp */}
                <a
                    href="https://wa.me/16479789287"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16
                        hover:w-12 hover:h-12 md:hover:w-14 md:hover:h-14 lg:hover:w-20 lg:hover:h-20 
                        bg-green-600 
                        flex items-center justify-center 
                        transition-all duration-300
                    "
                    title="WhatsApp"
                >
                    <FaWhatsapp className="text-white text-xl md:text-2xl lg:text-3xl" />
                </a>

                {/* Facebook */}
                <a
                    href="https://facebook.com/socialconnectionsevent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16
                        hover:w-12 hover:h-12 md:hover:w-14 md:hover:h-14 lg:hover:w-20 lg:hover:h-20 
                        bg-blue-600 
                        flex items-center justify-center 
                        transition-all duration-300
                    "
                    title="Facebook"
                >
                    <FaFacebookF className="text-white text-lg md:text-xl lg:text-2xl" />
                </a>

            </div>


            {/* FOOTER */}
            <footer className="w-full py-12 px-6 bg-black border-t-2 border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                        <div className="md:col-span-2">
                            <h3 className="text-2xl font-black text-yellow-400 mb-4">
                                Social Connections Events
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                Bringing the community together through cultural festivals, markets,
                                and joyful gatherings. At Social Connections, we celebrate Oakville’s
                                spirit of unity, creativity, and togetherness.
                            </p>

                            <div className="flex gap-3">
                                <a href="https://wa.me/16479789287" className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition">
                                    <FaWhatsapp className="text-white text-2xl" />
                                </a>
                                <a href="https://instagram.com/socialconnectionsevent/" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition">
                                    <FaInstagram className="text-white text-2xl" />
                                </a>
                                <a href="https://facebook.com/socialconnectionsevent" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition">
                                    <FaFacebookF className="text-white text-xl" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-black text-lg mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><Link href="/events/event" className="text-slate-400 hover:text-yellow-400 transition text-sm">Events</Link></li>
                                <li><Link href="/registration/vendor" className="text-slate-400 hover:text-yellow-400 transition text-sm">Become a Vendor</Link></li>
                                <li><Link href="/registration/sponser" className="text-slate-400 hover:text-yellow-400 transition text-sm">Sponsorships</Link></li>
                                <li><Link href="/aboutus" className="text-slate-400 hover:text-yellow-400 transition text-sm">About Us</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-black text-lg mb-4">Contact</h4>
                            <ul className="space-y-2">
                                <li className="text-slate-400 text-sm">info@socialconnections.com</li>
                                <li className="text-slate-400 text-sm">+1 (647) 978-9287</li>
                                <li className="text-slate-400 text-sm">Oakville, ON, Canada</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            © 2025 Social Connections Events. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default EventLandingPage;
