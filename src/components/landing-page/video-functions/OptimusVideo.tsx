import React from 'react';
import { Code } from "lucide-react";
import { GlowingEffect } from "../ui/GlowingEffect";

// ArcadeEmbed for Optimus video
export function ArcadeEmbed() {
  return (
    <div className="relative w-full" style={{ paddingBottom: 'calc(56.25% + 32px)', height: 0 }}>
      <iframe
        src="https://demo.arcade.software/yZ5LdWjsdSG2pJg50FJ3?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="Optimize Code and Review Performance Gains"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        className="absolute top-0 left-0 w-full h-full"
        style={{ colorScheme: 'light' }}
      />
    </div>
  )
}

export const OptimusVideo: React.FC = () => {
  const title = "Optimus";
  const tagline = "Your optimization expert for refactoring legacy analytics code";
  const description = "Optimus not only removes redundancies but also identifies optimal patterns and structures to address critical code quality parameters. It delivers intelligent improvements that enhance performance, maintainability, and clarity.";
  const items = [
    "Smart Refactoring to Optimize Execution, Logic, and Structure",
    "Join Rewriting and Macro Restructuring (e.g. Cartesian → Inner)",
    "Code Simplification with Significant Reductions in Time, Memory & I/O",
    "Precision-Driven Insights through Before/After Dashboards and ROI Metrics",
  ];

  return (
    <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12 items-center lg:items-start w-full">
      {/* Content Section */}
      <section className="flex-1 w-full space-y-4 sm:space-y-6 px-2 sm:px-0">
        <header className="flex items-center gap-3 sm:gap-4">
          <div className="w-fit rounded-lg border border-gray-600/50 p-2 sm:p-3 bg-white/5 flex-shrink-0">
            <Code className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <h3 className="font-sans text-2xl sm:text-3xl font-bold text-white">
            {title}
          </h3>
        </header>
        
        <p className="text-base sm:text-lg text-green-200 font-medium">
          {tagline}
        </p>
        
        <p className="font-sans text-sm sm:text-base text-neutral-200 leading-relaxed">
          {description}
        </p>
        
        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-neutral-300">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 sm:gap-3">
              <span className="text-green-400 mt-1 text-base sm:text-lg">•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Video Section */}
      <div className="flex-[1.8] w-full max-w-full relative">
        <div className="relative rounded-xl sm:rounded-2xl border p-1 sm:p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="border-0.75 relative overflow-hidden rounded-lg sm:rounded-xl dark:shadow-[0px_0px_27px_0px_#2D2D2D] backdrop-blur-md bg-black/30 border-white/10">
            <ArcadeEmbed />
          </div>
        </div>
      </div>
    </div>
  );
}; 