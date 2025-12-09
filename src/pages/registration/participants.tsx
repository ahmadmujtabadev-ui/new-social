"use client";
import Link from "next/link";
import { useState } from "react";

const ParticipantsClosed: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmed = email.trim();

    // Basic email validation
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");

      const formData = new FormData();
      formData.append("access_key", "aeb1222f-4e97-416a-a5e3-0d5d147c670c"); // ✅ YOUR KEY
      formData.append("email", trimmed);
      formData.append(
        "subject",
        "Notify me when participant registrations open"
      );
      formData.append(
        "message",
        `This user wants to be notified when participant registrations open: ${trimmed}`
      );

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again later.");
    }
  };

  const isLoading = status === "loading";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-center px-6">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl md:text-5xl font-black text-[#f0b400]">
          Participant Registrations will open soon.
        </h1>

        <p className="text-[#f0b400]/80 mt-4 text-sm md:text-base">
          Thank you for your interest! Participant registrations are currently
          closed. We&apos;ll notify you as soon as we open again.
        </p>

        {/* Subscription box */}
        <div className="mt-8 bg-black border border-[#f0b400]/40 rounded-2xl px-5 py-6 md:px-8 md:py-7 shadow-lg shadow-yellow-500/10">
          <h2 className="text-lg md:text-xl font-bold text-[#f0b400] mb-2">
            Get Notified When We Reopen
          </h2>
          <p className="text-xs md:text-sm text-[#f0b400]/70 mb-4">
            Enter your email and we&apos;ll update you when participant
            registrations reopen.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-stretch sm:items-center"
          >
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") {
                  setStatus("idle");
                  setErrorMsg("");
                }
              }}
              className="flex-1 px-4 py-3 rounded-full border-2 border-[#f0b400]/70 bg-black text-sm md:text-base text-white outline-none focus:border-[#f0b400] transition"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-full bg-[#f0b400] text-black font-bold text-sm md:text-base whitespace-nowrap hover:bg-yellow-400 hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Notify Me"}
            </button>
          </form>

          {/* Success / Error messages */}
          {status === "success" && (
            <p className="mt-3 text-xs md:text-sm text-emerald-400 font-semibold">
              Thank you! You&apos;re on the list. 🌟
            </p>
          )}

          {status === "error" && errorMsg && (
            <p className="mt-3 text-xs md:text-sm text-red-500 font-semibold">
              {errorMsg}
            </p>
          )}
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="px-6 py-3 rounded-full border-2 border-[#f0b400] text-[#f0b400] hover:bg-[#f0b400] hover:text-black font-bold transition"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsClosed;
