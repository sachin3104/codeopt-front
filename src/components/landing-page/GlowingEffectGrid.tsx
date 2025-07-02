import {
  BarChart2,
  Code,
  FileCode,
  FileText,
} from "lucide-react";
import { GlowingEffect } from "./ui/GlowingEffect";

const features = [
  {
    title: "Code Sage",
    tagline: "Your AI-powered code analyst for intelligent diagnostics and design insight",
    description: "Code Sage deeply analyzes legacy code for inefficiencies, structural issues, and logic flaws. It provides detailed scoring, root-cause tracing, and visual debugging to help teams modernize with precision.",
    icon: BarChart2,
    items: [
      "Code Quality Scoring (Maintainability, Performance, Readability)",
      "Visual Flowchart Mapping of Logic and Dependencies", 
      "Pinpointed Bottleneck Detection with Line-by-Line Context",
      "Optimization Opportunities (e.g. CPU, I/O, Memory, Latency)",
    ],
  },
  {
    title: "Optimus",
    tagline: "Your optimization expert for refactoring legacy analytics code",
    description: "Optimus not only removes redundancies but also identifies optimal patterns and structures to address critical code quality parameters. It delivers intelligent improvements that enhance performance, maintainability, and clarity.",
    icon: Code,
    items: [
      "Smart Refactoring to Optimize Execution, Logic, and Structure",
      "Join Rewriting and Macro Restructuring (e.g. Cartesian → Inner)",
      "Code Simplification with Significant Reductions in Time, Memory & I/O",
      "Precision-Driven Insights through Before/After Dashboards and ROI Metrics",
    ],
  },
  {
    title: "Transform",
    tagline: "Your multilingual translation agent for analytics modernization", 
    description: "Transform automatically converts outdated analytics languages (like SAS) into Python with syntactic fidelity and structural improvements — including macro logic, joins, and function translation.",
    icon: FileCode,
    items: [
      "High-Fidelity Multi-Language Conversion (SAS → Python)",
      "Logic & Parameter Mapping for Macros and PROC Statements", 
      "Environment Setup Instructions with Dependency Installers",
      "Rewrites with Production-Ready Formatting and Naming",
    ],
  },
  {
    title: "Scribe",
    tagline: "Your intelligent documenter for instant technical transparency",
    description: "Scribe generates clean, structured documentation from both raw and refactored code. It explains logic, annotates code transformations, and auto-generates dev onboarding materials.",
    icon: FileText,
    items: [
      "Auto-Generated Comments with Purpose, Optimization, and Structure",
      "Side-by-Side Code Comparisons (Original vs Optimized)",
      "Developer-Ready Guides with Usage Notes and Setup Paths",
      "Context-Aware Metadata from Code Blocks & Execution Tags",
    ],
  },
];

export function GlowingEffectGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex text-center justify-center items-center gap-4 flex-col mb-16">
        <div className="flex gap-2 flex-col">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Meet the Agents
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            A system of agentic AI—each with a distinct purpose—to modernize, optimize, and explain your legacy analytics code.
          </p>
        </div>
      </div>
      
      <div className="space-y-24">
        {features.map(({ icon: Icon, title, tagline, description, items }, index) => (
          <GridItem
            key={title}
            icon={<Icon className="h-6 w-6 text-white" />}
            title={title}
            tagline={tagline}
            description={description}
            items={items}
            isReversed={index % 2 !== 0}
          />
        ))}
      </div>
    </div>
  );
}

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  items: string[];
  isReversed: boolean;
}

const GridItem = ({
  icon,
  title,
  tagline,
  description,
  items,
  isReversed,
}: GridItemProps) => {
  return (
    <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
      {/* Content Section */}
      <section className="flex-1 space-y-6">
        <header className="flex items-center gap-4">
          <div className="w-fit rounded-lg border border-gray-600/50 p-3 bg-white/5 flex-shrink-0">
            {icon}
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

      {/* Image Placeholder Section */}
      <div className="flex-1 relative">
        <div className="relative rounded-2xl border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="border-0.75 relative overflow-hidden rounded-xl dark:shadow-[0px_0px_27px_0px_#2D2D2D] backdrop-blur-md bg-black/30 border-white/10">
            <div className="aspect-video flex items-center justify-center p-12 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
              <p className="text-white/50 text-lg">Image Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};