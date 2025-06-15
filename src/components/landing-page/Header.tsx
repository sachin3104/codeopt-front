import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      ref={menuRef}
      className={clsx(
        "fixed",
        "top-2 sm:top-4",
        "inset-x-2 sm:inset-x-8",
        "z-50",
        "flex flex-col",
        "px-6 py-4",
        "bg-gradient-to-br from-black/60 via-black/50 to-black/40",
        "backdrop-blur-md",
        "shadow-none",
        "rounded-2xl",
        "transition-all duration-300 ease-in-out",
        isMenuOpen ? "h-48" : "h-16"
      )}
    >
      <div className="flex items-center justify-between h-8">
        <div className="text-white text-xl font-bold">
          optqo
        </div>
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className={clsx(
        "flex flex-col gap-4 mt-6",
        "transition-all duration-300 ease-in-out",
        isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <a
          href="#features"
          className="text-white hover:text-gray-200 transition-colors text-lg"
          onClick={() => setIsMenuOpen(false)}
        >
          Features
        </a>
        <a
          href="#benefits"
          className="text-white hover:text-gray-200 transition-colors text-lg"
          onClick={() => setIsMenuOpen(false)}
        >
          Benefits
        </a>
        <a
          href="#pricing"
          className="text-white hover:text-gray-200 transition-colors text-lg"
          onClick={() => setIsMenuOpen(false)}
        >
          Pricing
        </a>
      </div>
    </header>
  );
}