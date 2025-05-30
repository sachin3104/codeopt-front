import {
  BarChart2,
  Code,
  FileCode,
  FileText,
} from "lucide-react";
import clsx from "clsx";
import { GlowingEffect } from "./ui/GlowingEffect";

const features = [
  {
    title: "SmartAnalyzer",
    description:
      "Intelligent analysis that identifies inefficiencies and anomalies automatically.",
    icon: BarChart2,
    items: [
      "Comprehensive Code Diagnostics",
      "Interactive Visual Flowcharts",
      "Advanced Bug and Bottleneck Detection",
    ],
  },
  {
    title: "OptiCode",
    description:
      "AI-powered code refactoring that enhances efficiency and readability.",
    icon: Code,
    items: [
      "AI-Powered Code Refactoring",
      "Real-Time Optimization Suggestions",
      "Adaptive Learning Algorithms",
    ],
  },
  {
    title: "CodeTranslator",
    description:
      "Seamless translation between analytics languages such as SAS, Python, R, and more.",
    icon: FileCode,
    items: [
      "Effortless Multi-Language Conversion",
      "Accuracy and Fidelity Assurance",
      "Customization and Compliance",
    ],
  },
  {
    title: "DocuGen",
    description:
      "Automatically creates professional-grade documentation for your analytics processes.",
    icon: FileText,
    items: [
      "Automated Documentation Generation",
      "Real-Time Updates",
      "Customizable Templates",
    ],
  },
];

export function GlowingEffectGrid() {
  return (
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
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-white md:text-2xl/[1.875rem]">
                {title}
              </h3>
              <p className="font-sans text-sm/[1.125rem] text-neutral-300 md:text-base/[1.375rem]">
                {description}
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-neutral-400">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};