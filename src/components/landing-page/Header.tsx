import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import logoUrl from "@/assets/logo_name.png";

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

  const menuItems = [
    
    { href: "/pricing", label: "Pricing", delay: 50 },
    { href: "/contact", label: "Contact Us", delay: 100 },
    { href: "https://discord.gg/jUZRnjeG5X", label: "Community", delay: 150 },
    { href: "/blogs", label: "Blogs", delay: 200 },
    { href: "/about", label: "About Us", delay: 250 },
  ];

  return (
    <header
      ref={menuRef}
      className={clsx(
        "fixed top-2 sm:top-4 inset-x-4 sm:inset-x-8 z-50",
        "transition-all duration-700 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;"
      )}
    >
      {/* Main header bar */}
      <div className={clsx(
        "flex items-center justify-between",
        "px-4 sm:px-6 py-2 sm:py-3",
        "backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20",
        "rounded-xl sm:rounded-2xl",
        "shadow-lg shadow-black/10",
        "transition-all duration-700 ease-&lsqb;cubic-bezier(0.4,0,0,1)&rsqb;",
        isMenuOpen ? "scale-[1.02]" : "scale-100"
      )}>
        <Link 
          to="/" 
          className={clsx(
            "flex items-center gap-x-2",
            "hover:opacity-80 transition-opacity duration-300",
            "cursor-pointer relative group"
          )}
        >
          <img src={logoUrl} alt="Optqo Logo" className="h-16 sm:h-20 w-auto" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
        </Link>
        
        {/* Animated menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={clsx(
            "relative w-10 h-10 sm:w-12 sm:h-12",
            "flex items-center justify-center",
            "rounded-lg sm:rounded-xl",
            "transition-all duration-500 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;",
            "group",
            isMenuOpen 
              ? "bg-white/20 shadow-lg shadow-white/10" 
              : "bg-white/10 hover:bg-white/20"
          )}
        >
          {/* Animated hamburger lines */}
          <div className="relative w-5 h-5 sm:w-6 sm:h-6">
            <span className={clsx(
              "absolute left-0 w-5 sm:w-6 h-0.5 bg-white rounded-full",
              "transition-all duration-500 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;",
              "origin-center",
              isMenuOpen 
                ? "top-2.5 sm:top-3 rotate-45" 
                : "top-1.5 sm:top-2"
            )}></span>
            <span className={clsx(
              "absolute left-0 w-5 sm:w-6 h-0.5 bg-white rounded-full",
              "transition-all duration-500 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;",
              "top-2.5 sm:top-3",
              isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
            )}></span>
            <span className={clsx(
              "absolute left-0 w-5 sm:w-6 h-0.5 bg-white rounded-full",
              "transition-all duration-500 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;",
              "origin-center",
              isMenuOpen 
                ? "top-2.5 sm:top-3 -rotate-45" 
                : "top-3.5 sm:top-4"
            )}></span>
          </div>
          
          {/* Ripple effect */}
          <div className={clsx(
            "absolute inset-0 rounded-lg sm:rounded-xl",
            "bg-gradient-to-r from-blue-400/20 to-purple-400/20",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-300",
            "blur-sm"
          )}></div>
        </button>
      </div>

      {/* Animated menu overlay */}
      <div className={clsx(
        "absolute top-full left-0 right-0 mt-2 sm:mt-4",
        "transition-all duration-700 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;",
        isMenuOpen 
          ? "opacity-100 translate-y-0 pointer-events-auto" 
          : "opacity-0 -translate-y-8 pointer-events-none"
      )}>
        <div className={clsx(
          "backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20",
          "rounded-xl sm:rounded-2xl",
          "shadow-xl shadow-black/20",
          "p-4 sm:p-6",
          "overflow-hidden"
        )}>
          {/* Menu Items */}
          <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">
            {menuItems.map((item, index) => {
              const isExternalLink = item.href.startsWith('/');
              
              if (isExternalLink) {
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={clsx(
                      "relative group",
                      "px-4 sm:px-6 py-3 sm:py-4",
                      "text-white text-base sm:text-lg font-medium",
                      "rounded-lg sm:rounded-xl",
                      "transition-all duration-500 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;",
                      "hover:bg-white/20 hover:scale-[1.02]",
                      "cursor-pointer",
                      "overflow-hidden"
                    )}
                    style={{
                      transform: isMenuOpen 
                        ? "translateX(0) scale(1)" 
                        : "translateX(-50px) scale(0.95)",
                      opacity: isMenuOpen ? 1 : 0,
                      transitionDelay: `${item.delay}ms`,
                      transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)"
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {/* Background gradient on hover */}
                    <div className={clsx(
                      "absolute inset-0",
                      "bg-gradient-to-r from-blue-400/10 to-purple-400/10",
                      "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-300",
                      "rounded-lg sm:rounded-xl"
                    )}></div>
                    
                    {/* Text with glow effect */}
                    <span className="relative z-10 group-hover:text-blue-200 transition-colors duration-300">
                      {item.label}
                    </span>
                    
                    {/* Subtle border animation */}
                    <div className={clsx(
                      "absolute bottom-0 left-0 h-0.5",
                      "bg-gradient-to-r from-blue-400 to-purple-400",
                      "transition-all duration-300 ease-out",
                      "group-hover:w-full w-0"
                    )}></div>
                  </Link>
                );
              } else {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "relative group",
                      "px-4 sm:px-6 py-3 sm:py-4",
                      "text-white text-base sm:text-lg font-medium",
                      "rounded-lg sm:rounded-xl",
                      "transition-all duration-500 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;",
                      "hover:bg-white/20 hover:scale-[1.02]",
                      "cursor-pointer",
                      "overflow-hidden"
                    )}
                    style={{
                      transform: isMenuOpen 
                        ? "translateX(0) scale(1)" 
                        : "translateX(-50px) scale(0.95)",
                      opacity: isMenuOpen ? 1 : 0,
                      transitionDelay: `${item.delay}ms`,
                      transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)"
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {/* Background gradient on hover */}
                    <div className={clsx(
                      "absolute inset-0",
                      "bg-gradient-to-r from-blue-400/10 to-purple-400/10",
                      "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-300",
                      "rounded-lg sm:rounded-xl"
                    )}></div>
                    
                    {/* Text with glow effect */}
                    <span className="relative z-10 group-hover:text-blue-200 transition-colors duration-300">
                      {item.label}
                    </span>
                    
                    {/* Subtle border animation */}
                    <div className={clsx(
                      "absolute bottom-0 left-0 h-0.5",
                      "bg-gradient-to-r from-blue-400 to-purple-400",
                      "transition-all duration-300 ease-out",
                      "group-hover:w-full w-0"
                    )}></div>
                  </a>
                );
              }
            })}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4 sm:mb-6"></div>

          {/* Auth Buttons */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <Link
              to="/login"
              className={clsx(
                "relative group",
                "px-4 sm:px-6 py-3 sm:py-4",
                "text-white text-base sm:text-lg font-medium text-center",
                "rounded-lg sm:rounded-xl",
                "transition-all duration-500 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;",
                "hover:scale-[1.02]",
                "cursor-pointer",
                "overflow-hidden",
                "bg-white/10",
                "border border-white/20"
              )}
              style={{
                transform: isMenuOpen 
                  ? "translateX(0) scale(1)" 
                  : "translateX(-50px) scale(0.95)",
                opacity: isMenuOpen ? 1 : 0,
                transitionDelay: "250ms",
                transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)"
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              {/* Background gradient on hover */}
              <div className={clsx(
                "absolute inset-0",
                "bg-gradient-to-r from-white/20 to-gray-300/20",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-300",
                "rounded-lg sm:rounded-xl"
              )}></div>
              
              {/* Text with glow effect */}
              <span className="relative z-10 group-hover:text-gray-200 transition-colors duration-300">
                Login
              </span>
              
              {/* Subtle border animation */}
              <div className={clsx(
                "absolute bottom-0 left-0 h-0.5",
                "bg-gradient-to-r from-white to-gray-300",
                "transition-all duration-300 ease-out",
                "group-hover:w-full w-0"
              )}></div>
            </Link>

            <Link
              to="/signup"
              className={clsx(
                "relative group",
                "px-4 sm:px-6 py-3 sm:py-4",
                "text-white text-base sm:text-lg font-medium text-center",
                "rounded-lg sm:rounded-xl",
                "transition-all duration-500 ease-&lsqb;cubic-bezier(0.4,0,0.2,1)&rsqb;",
                "hover:scale-[1.02]",
                "cursor-pointer",
                "overflow-hidden",
                "bg-black/20",
                "border border-white/20"
              )}
              style={{
                transform: isMenuOpen 
                  ? "translateX(0) scale(1)" 
                  : "translateX(-50px) scale(0.95)",
                opacity: isMenuOpen ? 1 : 0,
                transitionDelay: "300ms",
                transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)"
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              {/* Background gradient on hover */}
              <div className={clsx(
                "absolute inset-0",
                "bg-gradient-to-r from-black/30 to-gray-800/30",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-300",
                "rounded-lg sm:rounded-xl"
              )}></div>
              
              {/* Text with glow effect */}
              <span className="relative z-10 group-hover:text-gray-200 transition-colors duration-300">
                Sign Up
              </span>
              
              {/* Subtle border animation */}
              <div className={clsx(
                "absolute bottom-0 left-0 h-0.5",
                "bg-gradient-to-r from-gray-300 to-white",
                "transition-all duration-300 ease-out",
                "group-hover:w-full w-0"
              )}></div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}