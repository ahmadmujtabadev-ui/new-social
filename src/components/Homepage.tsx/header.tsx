import { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

const GOLD = "#f4c63f";
const BLUE = "#334895";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // ---- Get in Touch modal & form state ----
  const [showContactModal, setShowContactModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigation = (item: string) => {
    setMobileMenuOpen(false);

    if (item === "Home") {
      router.push("/");
    } else if (item === "Events") {
      router.push("/events/pastevents");
    } else if (item === "Vendor") {
      router.push("/registration/vendor");
    } else if (item === "Sponsor") {
      router.push("/registration/sponser");
    } else if (item === "Forms") {
      if (router.pathname !== "/") {
        router.push("/#joinus");
      } else {
        const element = document.getElementById("joinus");
        element?.scrollIntoView({ behavior: "smooth" });
      }
    } else if (item === "About us") {
      // If we're already on the home page, just scroll
      if (router.pathname === "/") {
        const element = document.getElementById("AboutSection");
        element?.scrollIntoView({ behavior: "smooth" });
      } else {
        // Navigate to home, then scroll to AboutSection
        router.push("/").then(() => {
          setTimeout(() => {
            const element = document.getElementById("AboutSection");
            element?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        });
      }
    }
  };

  const navItems = ["Home", "Events", "Vendor", "Sponsor", "Forms", "About us"];

  const handleContactSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !query.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append(
        "access_key",
        "47210367-9dce-4412-bae6-a3a944406f6e"
      );
      formData.append("name", name);
      formData.append("email", email);
      formData.append("query", query);
      formData.append("from_name", "Social Connections Website");
      formData.append(
        "subject",
        "New Get in Touch message from Social Connections Website"
      );

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        console.error("Web3Forms error:", data);
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        return;
      }

      setSuccessMsg("Thank you! Your message has been sent.");
      setName("");
      setEmail("");
      setQuery("");
      setTimeout(() => {
        setShowContactModal(false);
        setSuccessMsg("");
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 font-sans transition-all duration-300"
        style={{
          background: scrolled
            ? `linear-gradient(135deg, black 0%, rgba(0,0,0,0.95) 100%)`
            : "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${GOLD}40`
            : "none",
          boxShadow: scrolled
            ? `0 4px 20px rgba(0,0,0,0.3), 0 0 40px ${GOLD}15`
            : "none",
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <button
              onClick={() => router.push("/")}
              className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <Image
                alt="Social Connections Events"
                src="/Logo.png"
                height={30}
                width={50}
              />
            </button>

            <div className="hidden lg:flex items-center gap-8 xl:gap-12">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavigation(item)}
                  className="relative group text-white text-lg xl:text-xl font-semibold tracking-wide transition-all duration-300 hover:text-[#f4c63f] cursor-pointer"
                  style={{
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {item}
                  <span
                    className="absolute -bottom-1 left-0 h-[3px] w-0 rounded-full transition-all duration-300 group-hover:w-full"
                    style={{
                      background: `linear-gradient(90deg, ${GOLD}, ${GOLD}AA)`,
                      boxShadow: `0 0 10px ${GOLD}`,
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
              <button
                onClick={() => setShowContactModal(true)}
                className="hidden md:inline-flex items-center justify-center h-12 lg:h-14 px-6 lg:px-8 rounded-full text-base lg:text-lg font-bold tracking-wide transition-all duration-300 transform hover:scale-105"
                style={{
                  border: `2px solid ${GOLD}`,
                  color: "white",
                  background: "transparent",
                  boxShadow: `0 0 20px ${GOLD}44`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = GOLD;
                  e.currentTarget.style.color = BLUE;
                  e.currentTarget.style.boxShadow = `0 0 30px ${GOLD}99, inset 0 0 20px ${GOLD}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.boxShadow = `0 0 20px ${GOLD}44`;
                }}
              >
                Get in Touch
              </button>

              {/* Admin Login Button */}
              <button
                onClick={() => router.push("/admin/login")}
                className="hidden md:inline-flex items-center justify-center h-10 lg:h-12 px-4 lg:px-6 rounded-full text-sm lg:text-base font-bold tracking-wide transition-all duration-300 transform hover:scale-105"
                style={{
                  border: `2px solid ${GOLD}`,
                  color: GOLD,
                  background: "rgba(0,0,0,0.5)",
                  boxShadow: `0 0 15px ${GOLD}33`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${GOLD}22`;
                  e.currentTarget.style.color = GOLD;
                  e.currentTarget.style.boxShadow = `0 0 25px ${GOLD}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0,0,0,0.5)";
                  e.currentTarget.style.color = GOLD;
                  e.currentTarget.style.boxShadow = `0 0 15px ${GOLD}33`;
                }}
              >
                Admin
              </button>

              {/* Search icon */}
              <button
                className="hidden sm:block text-white transition-all duration-300 hover:scale-110 hover:text-[#f4c63f]"
                style={{
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
                }}
              >
                <Search size={22} />
              </button>

              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden text-white p-2 transition-all duration-300 hover:scale-110"
                style={{
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
                }}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-20 left-0 right-0 z-40 lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.98) 100%)",
          backdropFilter: "blur(10px)",
          boxShadow: `0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 ${GOLD}33`,
          borderBottom: `2px solid ${GOLD}`,
        }}
      >
        <div className="px-6 py-8 space-y-6">
          {navItems.map((item, index) => (
            <button
              key={item}
              onClick={() => handleNavigation(item)}
              className="block w-full text-left text-white text-2xl font-bold tracking-wide transition-all duration-300 hover:text-[#f4c63f] transform hover:translate-x-2"
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                animation: mobileMenuOpen
                  ? `slideIn 0.3s ease-out ${index * 0.1}s backwards`
                  : "none",
              }}
            >
              {item}
            </button>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setShowContactModal(true);
            }}
            className="w-full py-4 rounded-full text-xl font-bold tracking-wide transition-all duration-300"
            style={{
              backgroundColor: GOLD,
              color: BLUE,
              border: `2px solid ${GOLD}`,
              boxShadow: `0 0 30px ${GOLD}99, inset 0 0 20px ${GOLD}33`,
            }}
          >
            Get in Touch
          </button>

          {/* Admin Login Button for Mobile */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              router.push("/admin/login");
            }}
            className="w-full py-4 rounded-full text-xl font-bold tracking-wide transition-all duration-300"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              color: GOLD,
              border: `2px solid ${GOLD}`,
              boxShadow: `0 0 20px ${GOLD}66`,
            }}
          >
            Admin Login
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {showContactModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 rounded-3xl border border-[#f4c63f66] bg-[#050505] px-6 py-7 shadow-2xl shadow-black/70">
            {/* close */}
            <button
              className="absolute right-4 top-4 text-slate-400 hover:text-yellow-400 transition"
              onClick={() => setShowContactModal(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-yellow-400 mb-1">
              Get in Touch
            </h2>
            <p className="text-sm text-slate-300 mb-5">
              Have a question about Oakville Eid Festival or want to
              collaborate? Send us a message and we will reply by email.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-yellow-400 mb-1.5">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#f4c63f40] bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#f4c63f] focus:ring-0"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-yellow-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#f4c63f40] bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#f4c63f] focus:ring-0"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-yellow-400 mb-1.5">
                  Message / Query
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-[#f4c63f40] bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#f4c63f] focus:ring-0 resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              {errorMsg && (
                <p className="text-xs font-semibold text-red-400">
                  {errorMsg}
                </p>
              )}
              {successMsg && (
                <p className="text-xs font-semibold text-emerald-400">
                  {successMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-6 py-3 text-sm font-black uppercase tracking-wide text-black shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:shadow-[0_0_35px_rgba(250,204,21,0.9)] hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

export default Header;