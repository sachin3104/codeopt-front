import React from 'react';
import { BarChart2 } from "lucide-react";
import { GlowingEffect } from "../ui/GlowingEffect";


const ArcadeEmbed = () => {
  return (
    <div style={{ position: 'relative', paddingBottom: 'calc(50.15625% + 41px)', height: 0, width: '100%' }}>
      <iframe
        src="https://demo.arcade.software/EL4iRaGgHYBRgDR98Pd7?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="Analyze SAS Code Quality and Optimization Opportunities"
        frameBorder="0"
        allowFullScreen
        loading="lazy"
        allow="clipboard-write"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light' }}
      />
    </div>
  )
} 

export const CodeSageVideo: React.FC = () => {
  const title = "Code Sage";
  const tagline = "Your AI-powered code analyst for intelligent diagnostics and design insight";
  const description = "Code Sage deeply analyzes legacy code for inefficiencies, structural issues, and logic flaws. It provides detailed scoring, root-cause tracing, and visual debugging to help teams modernize with precision.";
  const items = [
    "Code Quality Scoring (Maintainability, Performance, Readability)",
    "Visual Flowchart Mapping of Logic and Dependencies", 
    "Pinpointed Bottleneck Detection with Line-by-Line Context",
    "Optimization Opportunities (e.g. CPU, I/O, Memory, Latency)",
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
      {/* Content Section */}
      <section className="flex-[1.2] space-y-6">
        <header className="flex items-center gap-4">
          <div className="w-fit rounded-lg border border-gray-600/50 p-3 bg-white/5 flex-shrink-0">
            <BarChart2 className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-sans text-3xl font-bold text-white">
            {title}
          </h3>
        </header>
        
        <p className="text-lg text-blue-200 font-medium">
          {tagline}
        </p>
        
        <p className="font-sans text-base text-neutral-200 leading-relaxed">
          {description}
        </p>
        
        <ul className="space-y-3 text-base text-neutral-300">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="text-blue-400 mt-1 text-lg">•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Video Section */}
      <div className="flex-[1.8] relative">
        <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="border-0.75 relative overflow-hidden rounded-xl dark:shadow-[0px_0px_27px_0px_#2D2D2D] backdrop-blur-md bg-black/30 border-white/10">
            <ArcadeEmbed />
          </div>
        </div>
      </div>
    </div>
  );
}; 