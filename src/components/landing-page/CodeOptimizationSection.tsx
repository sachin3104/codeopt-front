import React from "react";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

const optimizedCodeExample = `# Before optimization
def process_data(df):
 results = []
 for i in range(len(df)):
 if df.iloc[i]['value'] > 100:
 results.append({
 'id': df.iloc[i]['id'],
 'value': df.iloc[i]['value'] * 2
 })
 return results

# After AgenticAI optimization
def process_data(df):
 return df[df['value'] > 100].apply(
 lambda row: {'id': row['id'], 'value': row['value'] * 2},
 axis=1
 ).tolist()`;

export default function CodeOptimizationSection() {
  const benefits = [
    "Reduce execution time by up to 80%",
    "Decrease code complexity and improve readability",
    "Maintain logical equivalence with the original code",
  ];

  return (
    <section className="relative py-20">
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

          {/* Right: Glassmorphic code editor */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg bg-[rgba(255,255,255,0.1)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.18)] rounded-2xl p-6">
              {/* Window controls */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="h-3 w-3 bg-red-500 rounded-full"></span>
                <span className="h-3 w-3 bg-yellow-500 rounded-full"></span>
                <span className="h-3 w-3 bg-green-500 rounded-full"></span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm text-white">
                <code>{optimizedCodeExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}