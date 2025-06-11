import React from "react";
import clsx from "clsx";

export default function Header() {
  return (
    <header
      className={clsx(
        "fixed",
        "top-2 sm:top-4",
        "inset-x-2 sm:inset-x-8",
        "z-50",
        "flex items-center",
        "p-4",
        "bg-[rgba(0,0,0,0.1)]",
        "backdrop-blur-[3.5px]",
        "shadow-none",
        "rounded-2xl"
      )}
    >
      <div className="text-white text-xl font-bold">
        optqo
      </div>
    </header>
  );
}