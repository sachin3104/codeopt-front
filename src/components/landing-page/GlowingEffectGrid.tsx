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
    tagline: "Your Analytics Code Auditor",
    description: "Intelligent analysis that identifies inefficiencies and anomalies automatically.",
    icon: BarChart2,
    items: [
      "Comprehensive Code Diagnostics",
      "Interactive Visual Flowcharts", 
      "Advanced Bug and Bottleneck Detection",
    ],
  },
  {
    title: "Optimus",
    tagline: "Legacy Code Modernizer",
    description: "AI-powered code refactoring that enhances efficiency and readability.",
    icon: Code,
    items: [
      "AI-Powered Code Refactoring",
      "Real-Time Optimization Suggestions",
      "Adaptive Learning Algorithms",
    ],
  },
  {
    title: "Transform",
    tagline: "Multi-Language Analytics Converter", 
    description: "Seamless translation between analytics languages such as SAS, Python, R, and more.",
    icon: FileCode,
    items: [
      "Effortless Multi-Language Conversion",
      "Accuracy and Fidelity Assurance", 
      "Customization and Compliance",
    ],
  },
  {
    title: "Scribe",
    tagline: "Professional Documentation Generator",
    description: "Automatically creates professional-grade documentation for your analytics processes.",
    icon: FileText,
    items: [
      "Automated Documentation Generation",
      "Professional Documentation Generation",
    ],
  },
];

export function GlowingEffectGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex text-center justify-center items-center gap-4 flex-col mb-16">
        <div className="flex gap-2 flex-col">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Our Features
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Powerful tools to transform your code performance and development workflow.
          </p>
        </div>
      </div>
      
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4">
        {features.map(({ icon: Icon, title, description, items }) => (
          <GridItem
            key={title}
            icon={<Icon className="h-4 w-4 text-white" />}
            title={title}
            description={description}
            items={items}
          />
        ))}
      </ul>
    </div>
  );
}

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
}

const GridItem = ({
  icon,
  title,
  description,
  items,
}: GridItemProps) => {
  return (
    <li className="min-h-[20rem] list-none">
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D] backdrop-blur-md bg-black/30 border-white/10">          
          <div className="relative flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-fit rounded-lg border border-gray-600/50 p-2 bg-white/5 flex-shrink-0">
                {icon}
              </div>
              <h3 className="font-sans text-xl font-semibold text-white md:text-2xl flex-1">
                {title}
              </h3>
            </div>
              
            <div className="flex-1 space-y-3">

              <p className="font-sans text-sm text-neutral-200 md:text-base min-h-[2.5rem] leading-relaxed">
                {description}
              </p>
              
              <ul className="space-y-2 text-sm text-neutral-300 flex-1">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};