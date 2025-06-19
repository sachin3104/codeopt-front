import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

// You'll need to install @tabler/icons-react: npm install @tabler/icons-react
import { IconDotsVertical } from "@tabler/icons-react";

// Code examples for comparison
const beforeCode = `# Original implementation (unoptimized)

library(dplyr)
calculate_stats <- function(df) {
  results <- c()
  # Loop through each row
  for (i in 1:nrow(df)) {
    if (df$score[i] > 75) {
      scaled_score <- df$score[i] * 1.2
      results <- c(results, scaled_score)
    }
  }
  return(results)
}

# Usage
high_scores <- calculate_stats(student_data)
print(paste("Found", length(high_scores), "high performers"))
`;

const afterCode = `# optqo AI optimized implementation

library(dplyr)

calculate_stats <- function(df) {
  # Vectorized filtering and transformation
  df %>%
    filter(score > 75) %>%
    pull(score) * 1.2
}

# Usage  
high_scores <- calculate_stats(student_data)
cat("Found", length(high_scores), "high performers\\n")
`;

interface CompareProps {
  firstCode: string;
  secondCode: string;
  className?: string;
  codeClass?: string;
  initialPct?: number;
}

function Compare({
  firstCode,
  secondCode,
  className = "",
  codeClass = "",
  initialPct = 50,
}: CompareProps) {
  const [pct, setPct] = useState(initialPct);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const move = useCallback((x: number) => {
    if (!ref.current) return;
    const { left, width } = ref.current.getBoundingClientRect();
    let newPct = ((x - left) / width) * 100;
    newPct = Math.max(0, Math.min(100, newPct));
    setPct(newPct);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => dragging && move(e.clientX);
    const onMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, move]);

  return (
    <div
      ref={ref}
      className={clsx("relative w-full h-full select-none overflow-hidden", className)}
      onMouseDown={(e) => { setDragging(true); move(e.clientX); }}
      onMouseMove={(e) => move(e.clientX)}
    >
      {/* Slider handle - simplified without motion */}
      <div
        className="absolute top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-indigo-400 to-transparent z-30"
        style={{ 
          left: `${pct}%`,
          willChange: 'left',
          transform: 'translateZ(0)'
        }}
      />

      {/* First code (clipped) - left side */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div
          className={codeClass}
          style={{ 
            clipPath: `inset(0 ${100 - pct}% 0 0)`,
            willChange: 'clip-path',
            transform: 'translateZ(0)'
          }}
        >
          <pre className="h-full overflow-auto p-6 font-mono text-sm text-white leading-relaxed bg-transparent">
            <code>{firstCode}</code>
          </pre>
        </div>
      </div>

      {/* Second code (clipped) - right side */}
      <div className="absolute inset-0 z-10">
        <div
          className={codeClass}
          style={{ 
            clipPath: `inset(0 0 0 ${pct}%)`,
            willChange: 'clip-path',
            transform: 'translateZ(0)'
          }}
        >
          <pre className="h-full overflow-auto p-6 font-mono text-sm text-white leading-relaxed bg-transparent">
            <code>{secondCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function CodeOptimizationSection() {
  const benefits = [
    "Reduce execution time by up to 80%",
    "Decrease code complexity and improve readability",
    "Maintain logical equivalence with the original code",
  ];

  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: "What we do" + text */}
          <div className="space-y-6">
            <h3 className="text-sm uppercase text-indigo-400 tracking-wide">
              What We Do
            </h3>
            <h2 className="text-4xl font-bold text-white">
              See the Power of Optimization
            </h2>
            <p className="text-lg text-gray-300">
              At Agentic AI, we harness state-of-the-art machine learning to
              automatically refactor your analytics code—boosting performance,
              clarity, and maintainability in one seamless step.
            </p>
            <ul className="space-y-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-start space-x-3">
                  <ArrowRight className="mt-1 h-5 w-5 text-white" />
                  <span className="text-white">{b}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition">
              Try Code Optimization
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          {/* Right: Interactive Code Compare Section */}
          <div className="flex justify-center">
            <div className="w-full h-[500px] bg-black/30 backdrop-blur-[16px] border border-[rgba(255,255,255,0.12)] rounded-3xl overflow-hidden relative  ">
              {/* Header with labels */}
              <div className="absolute top-0 left-0 right-0 z-40 flex">
                <div className="flex-1 p-4 text-center">
                  <span className="text-sm font-medium text-white/80">Before</span>
                </div>
                <div className="flex-1 p-4 text-center">
                  <span className="text-sm font-medium text-white/80">After</span>
                </div>
              </div>
              
              {/* Compare Component */}
              <div className="pt-12 h-full">
                <Compare
                  firstCode={beforeCode}
                  secondCode={afterCode}
                  initialPct={50}
                  className="w-full h-full"
                  codeClass="rounded-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}