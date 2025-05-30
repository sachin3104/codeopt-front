import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={clsx(
        "fixed",
        "top-2 sm:top-4",
        "inset-x-2 sm:inset-x-8",
        "z-50",
        "flex flex-col justify-center sm:flex-row sm:items-center sm:justify-between",
        "p-4",
        "bg-[rgba(0,0,0,0.1)]",
        "backdrop-blur-[3.5px]",
        "shadow-none",
        "rounded-2xl",
        "border border-[rgba(255,255,255,0.18)]"
      )}
    >
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="text-white text-xl font-bold">
        optqo
        </div>
        <button
          className="sm:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <nav
        className={clsx(
          menuOpen ? 'mt-4' : 'mt-0',
          "sm:mt-0",
          "w-full sm:w-auto",
          "overflow-hidden",
          "transition-[max-height,opacity] duration-700 ease-in-out",
          menuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0',
          "sm:max-h-none sm:opacity-100"
        )}
      >
        <ul
          className={clsx(
            "flex flex-col sm:flex-row",
            "items-center",
            "space-y-2 sm:space-y-0 sm:space-x-8",
            "text-white",
            "text-center",
            "bg-[rgba(0,0,0,0.2)] sm:bg-transparent",
            "p-4 sm:p-0",
            "rounded-lg sm:rounded-none",
            "transition-transform duration-700",
            menuOpen ? 'translate-y-0' : '-translate-y-2',
            "sm:translate-y-0"
          )}
        >
          <li>
            <a href="#features" className="hover:text-gray-200 transition-colors">
              Features
            </a>
          </li>
          <li>
            <a href="#benefits" className="hover:text-gray-200 transition-colors">
              Benefits
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-gray-200 transition-colors">
              Contact
            </a>
          </li>
        </ul>
      </nav>

      <button
      onClick={() => window.location.href = '/login'}
        className={clsx(
          menuOpen ? 'mt-4' : 'mt-0',
          "sm:mt-0",
          "px-4 py-2",
          "bg-white/20 hover:bg-white/30",
          "rounded-md text-white",
          "self-center sm:self-auto",
          "overflow-hidden",
          "transition-[max-height,opacity] duration-700 ease-in-out",
          menuOpen ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0',
          "sm:max-h-none sm:opacity-100"
        )}
      >
        Get Started
      </button>
    </header>
  );
}