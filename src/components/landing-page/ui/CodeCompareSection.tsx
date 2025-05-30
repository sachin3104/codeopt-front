import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";

// You'll need to install @tabler/icons-react: npm install @tabler/icons-react
import { IconDotsVertical } from "@tabler/icons-react";

// Longer code examples for comparison
const beforeCode = `# Original implementation (unoptimized)

import pandas as pd
from datetime import datetime, timedelta

def process_data(df):
    # Initialize results list
    results = []
    # Loop through each row
    for index in range(len(df)):
        row = df.iloc[index]
        if row['value'] > 100:
            item = {'id': row['id'], 'value': row['value'] * 2}
            results.append(item)
    # Return list of dicts
    return results

# Usage example
records = process_data(dataframe)
print(len(records), "items processed")
`;

const afterCode = `# AgenticAI optimized implementation

import pandas as pd
from datetime import datetime, timedelta

def process_data(df):
    # Filter and apply transformation in one step
    return (
        df[df['value'] > 100]
        .apply(lambda row: {'id': row['id'], 'value': row['value'] * 2}, axis=1)
        .tolist()
    )

# Usage example
records = process_data(dataframe)
print(f"Processed {len(records)} items efficiently")
`;

interface CompareProps {
  firstCode: string;
  secondCode: string;
  className?: string;
  codeClass?: string;
  initialPct?: number;
}

export function Compare({
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
      onMouseMove={(e) => !dragging && move(e.clientX)}
    >
      {/* Slider handle */}
      <AnimatePresence>
        <motion.div
          className="absolute top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-indigo-400 to-transparent z-30 transition-left"
          style={{ left: `${pct}%`, transition: 'left 0.2s ease-out' }}
          transition={{ duration: 0 }}
        >
          <div className="absolute inset-y-0 left-0 w-20 [mask-image:radial-gradient(100px_at_left,white,transparent)] bg-indigo-400 opacity-20" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-2.5 w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-md">
            <IconDotsVertical className="h-4 w-4 text-black" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* First code (clipped) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div
          className={codeClass}
          style={{ clipPath: `inset(0 ${100 - pct}% 0 0)`, transition: 'clip-path 0.2s ease-out' }}
        >
          <pre className="h-full overflow-auto p-6 font-mono text-sm text-white leading-relaxed bg-transparent">
            <code>{firstCode}</code>
          </pre>
        </div>
      </div>

      {/* Second code */}
      <div className="absolute inset-0 z-10">
        <pre className={clsx("h-full overflow-auto p-6 font-mono text-sm text-white leading-relaxed", codeClass)}>
          <code>{secondCode}</code>
        </pre>
      </div>
    </div>
  );
}

// Main section
export default function CodeCompareSection() {
  return (
    <section className="py-20 bg-[#1A1A1D]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Before & After: Code Comparison
        </h2>
        <div className="h-[70vh] bg-[rgba(255,255,255,0.05)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.12)] rounded-3xl overflow-hidden relative">
          <Compare
            firstCode={beforeCode}
            secondCode={afterCode}
            initialPct={50}
            className="w-full h-full"
            codeClass="rounded-none"
          />
        </div>
      </div>
    </section>
  );
}