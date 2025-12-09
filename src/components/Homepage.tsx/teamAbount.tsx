import React from "react";
import { Linkedin, Instagram, Facebook } from "lucide-react";
import { useMemo, useEffect } from "react";
import Image from "next/image";

// Type definition for team member
type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  testimonial: string;
};

// Team Section Component
export const TeamSection = () => {
  const [selectedMember, setSelectedMember] =
    React.useState<TeamMember | null>(null);

  const teamMembers: TeamMember[] = useMemo(
    () => [
      {
        id: 1,
        name: "Makdas Chaudhry",
        role: "Founder and Event Director",
        image: "/team/Makdas_Chaudhry.jpg",
        linkedin: "https://www.linkedin.com/in/mukadas/",
        instagram: "https://www.instagram.com/makdas_chaudhry/",
        facebook: "https://www.facebook.com/mukadas.cheema",
        testimonial:
          "Leading this team has been an incredible journey. We're dedicated to creating memorable events that bring people together and celebrate culture in meaningful ways.",
      },
      {
        id: 2,
        name: "Faiza Zafar",
        role: "Creative Director",
        image: "/team/Faiza_Zafar.jpg",
        linkedin: "https://www.linkedin.com/in/mukadas/",
        instagram: "https://www.instagram.com/fyza_zafar/",
        facebook: "https://www.facebook.com/faiza.zafar16",
        testimonial:
          "The supportive and collaborative work environment at this event company is truly remarkable. We work together seamlessly, leveraging each other's strengths to deliver flawless events. It's a pleasure to be a part of such a cohesive team.",
      },
      {
        id: 3,
        name: "Mueez Amjad",
        role: "Marketing Director",
        image: "/team/Mueez_Amjad.jpg",
        linkedin: "https://www.linkedin.com/in/mueez-amj/",
        instagram: "https://www.instagram.com/glimpseofmz/",
        facebook: "https://www.facebook.com/MueezAmj/",
        testimonial:
          "Working with this talented team has been transformative. Every event is an opportunity to innovate and create experiences that resonate with our audiences.",
      },
    ],
    []
  );

  // Set first member as default selected
  useEffect(() => {
    if (!selectedMember && teamMembers.length > 0) {
      setSelectedMember(teamMembers[0]);
    }
  }, [selectedMember, teamMembers]);

  const activeMember = selectedMember || teamMembers[0];

  return (
    <section className="w-full py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-yellow-500 text-sm font-bold tracking-widest uppercase mb-3">
            GET INVOLVED
          </p>
          <h2 className="text-5xl font-black text-yellow-500 mb-4">
            Our Creative Team
          </h2>

        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Clickable Member Cards */}
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`w-full flex items-center gap-6 rounded-2xl p-6 transition-all duration-300 text-left border-2 ${
                  activeMember.id === member.id
                    ? "bg-yellow-500/10 border-yellow-500 scale-[1.02]"
                    : "bg-black border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500/5"
                }`}
              >
                <div
                  className={`w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 ${
                    activeMember.id === member.id
                      ? "border-yellow-500"
                      : "border-yellow-500/40"
                  }`}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-xl font-bold mb-1 ${
                      activeMember.id === member.id
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                  >
                    {member.name}
                  </h3>
                  <p
                    className={`text-sm font-medium ${
                      activeMember.id === member.id
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  >
                    {member.role}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column - Featured Member Details */}
          <div className="bg-black border-2 border-yellow-500/30 rounded-3xl p-8 lg:p-12 min-h-[500px] flex flex-col">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 border-8 border-yellow-500 shadow-2xl shadow-yellow-500/20 mb-6">
                <Image
                  src={activeMember.image}
                  alt={activeMember.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-3xl font-black text-white mb-2">
                {activeMember.name}
              </h3>
              <p className="text-yellow-400 text-lg font-semibold mb-6">
                {activeMember.role}
              </p>
              <div className="flex gap-4 justify-center">
                {activeMember.linkedin && (
                  <a
                    href={activeMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${activeMember.name}'s LinkedIn profile`}
                    className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center hover:bg-yellow-400 transition-all hover:scale-110 shadow-lg"
                  >
                    <Linkedin size={24} className="text-black" />
                  </a>
                )}
                {activeMember.facebook && (
                  <a
                    href={activeMember.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${activeMember.name}'s Facebook profile`}
                    className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center hover:bg-yellow-400 transition-all hover:scale-110 shadow-lg"
                  >
                    <Facebook size={24} className="text-black" />
                  </a>
                )}
                {activeMember.instagram && (
                  <a
                    href={activeMember.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${activeMember.name}'s Instagram profile`}
                    className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center hover:bg-yellow-400 transition-all hover:scale-110 shadow-lg"
                  >
                    <Instagram size={24} className="text-black" />
                  </a>
                )}
              </div>
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 flex-1 flex items-center">
              <p className="text-gray-300 text-base leading-relaxed italic">
                {activeMember.testimonial}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Type definition for testimonial
type Testimonial = {
  name: string;
  role: string;
  image: string;
  text: string;
  linkedin: string;
  instagram: string;
  facebook: string;
};

// Testimonials Section Component
export const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Savannah Nguyen",
      role: "Coordinator",
      image: "/api/placeholder/100/100",
      text: "Working for this event company is an incredible experience. The team is highly professional and dedicated to delivering exceptional events. I'm proud to be a part of such a talented group of individuals.",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
    {
      name: "Jane Cooper",
      role: "CEO & Founder",
      image: "/api/placeholder/100/100",
      text: "Our commitment to excellence drives everything we do. We believe in creating memorable experiences that bring communities together and celebrate culture.",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
  ];

  return (
    <section className="w-full py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-white mb-4">Testimonials</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-3xl p-8 border-2 border-slate-700 hover:border-yellow-400 transition-all duration-300"
            >
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-400 flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-yellow-400 text-sm font-semibold mb-3">
                    {testimonial.role}
                  </p>
                  <div className="flex gap-3">
                    {testimonial.linkedin && (
                      <a
                        href={testimonial.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${testimonial.name}'s LinkedIn`}
                        className="text-blue-400 hover:text-blue-300 transition"
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                    {testimonial.instagram && (
                      <a
                        href={testimonial.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${testimonial.name}'s Instagram`}
                        className="text-pink-400 hover:text-pink-300 transition"
                      >
                        <Instagram size={18} />
                      </a>
                    )}
                    {testimonial.facebook && (
                      <a
                        href={testimonial.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${testimonial.name}'s Facebook`}
                        className="text-blue-400 hover:text-blue-300 transition"
                      >
                        <Facebook size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-base leading-relaxed italic">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Section Component
export const AboutSection = () => {
  return (
    <section className="w-full py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-6">
              About Us
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mb-8 rounded-full"></div>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              We are Oakville’s community-driven event organizers, dedicated to
              bringing people together through cultural, social, and networking
              experiences. Our passion lies in creating events that celebrate
              diversity, spark meaningful connections, and strengthen the
              community we proudly belong to.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              From celebrations and festivals to interactive community
              gatherings, we focus on delivering memorable experiences that
              leave a lasting impact. Every event is thoughtfully organized to
              inspire joy, unity, and a sense of belonging for everyone who
              joins us.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-yellow-400/10 border-2 border-yellow-400 rounded-2xl px-6 py-4">
                <p className="text-yellow-400 font-black text-3xl">50+</p>
                <p className="text-slate-400 text-sm font-semibold">
                  Events Hosted
                </p>
              </div>
              <div className="bg-yellow-400/10 border-2 border-yellow-400 rounded-2xl px-6 py-4">
                <p className="text-yellow-400 font-black text-3xl">10K+</p>
                <p className="text-slate-400 text-sm font-semibold">
                  Happy Attendees
                </p>
              </div>
              <div className="bg-yellow-400/10 border-2 border-yellow-400 rounded-2xl px-6 py-4">
                <p className="text-yellow-400 font-black text-3xl">70+</p>
                <p className="text-slate-400 text-sm font-semibold">
                  Vendors & Partners
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-slate-800/50 rounded-3xl p-8 border-2 border-yellow-400">
              <h3 className="text-2xl font-black text-white mb-6">
                Latest Blog Post
              </h3>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                Where we share the newsletters of upcoming and existing events.
                Stay updated with our latest announcements, behind-the-scenes
                content, and event highlights.
              </p>
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 px-8 py-4 rounded-full text-base font-black tracking-wide shadow-xl shadow-yellow-400/40 hover:shadow-2xl hover:scale-105 transition-all">
                Read Our Blog
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
