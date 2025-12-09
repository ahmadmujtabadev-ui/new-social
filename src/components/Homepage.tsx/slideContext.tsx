import Image from "next/image";
import React, { useEffect, useState } from "react";

function SlideContext() {
  const GOLD = "#f4c63f";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      title: "Celebrate Together: Oakville Eid Festival 2026",
      subtitle:
        "Join us for a spectacular celebration of culture, community, and joy featuring live performances, delicious food, family activities, and much more.",
      bg: "/banner1.jpg",
    },
    {
      title: "A Day of Unity and Celebration",
      subtitle:
        "Experience the vibrant spirit of Eid with entertainmaent, shopping, cultural performances, and community connections that last a lifetime.",
      bg: "/banner2.jpg",
    },
    {
      title: "Creating Memorable Moments Together",
      subtitle:
        "From traditional performances to modern festivities — celebrating diversity and bringing our community together in joyous harmony.",
      bg: "/banner3.jpg",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const id = setInterval(
      () => setCurrentSlide((p) => (p + 1) % slides.length),
      4000
    );
    return () => clearInterval(id);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (i: number) => {
    setCurrentSlide(i);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full overflow-hidden aspect-[16/9] sm:aspect-[16/9] md:h-[80vh] md:aspect-auto lg:h-[90vh]">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.bg}
            alt={s.title}
         fill
            className="absolute inset-0 w-full h-full object-cover object-center"
            draggable={false}
          />
        </div>
      ))}

      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {slides.map((_, i) => {
            const active = i === currentSlide;
            return (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 grid place-items-center rounded-full focus:outline-none transition-all duration-300"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    active
                      ? "w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4"
                      : "w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3"
                  }`}
                  style={{
                    backgroundColor: active ? GOLD : `${GOLD}60`,
                    boxShadow: active
                      ? `0 0 15px ${GOLD}DD, 0 0 30px ${GOLD}88`
                      : "none",
                    transform: active ? "scale(1.2)" : "scale(1)",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

export default SlideContext;
