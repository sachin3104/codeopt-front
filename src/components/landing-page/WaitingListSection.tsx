import React, { useState } from "react";
import clsx from "clsx";

export default function WaitingListSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send `email` to your API or service
    console.log("Joined waiting list:", email);
    setEmail("");
  };

  return (
    <section className="py-16">
      <div className="max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Join Our Waiting List
        </h2>
        <form
          onSubmit={handleSubmit}
          className={clsx(
            "flex flex-col sm:flex-row gap-4 glass-card p-6 rounded-2xl",
            "bg-[rgba(255,255,255,0.1)] backdrop-blur-[8px]",
            "border border-[rgba(255,255,255,0.18)]"
          )}
        >
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={clsx(
              "flex-1 px-4 py-3 bg-transparent placeholder-gray-400",
              "border border-transparent focus:border-white rounded-md",
              "text-white outline-none"
            )}
          />
          <button
            type="submit"
            className={clsx(
              "px-6 py-3 bg-white/20 hover:bg-white/30 text-white",
              "rounded-md transition"
            )}
          >
            Notify Me
          </button>
        </form>
      </div>
    </section>
  );
}