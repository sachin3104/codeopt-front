import type React from "react"
import { cn } from "@/lib/utils"

interface BeamsBackgroundProps {
  className?: string
  children?: React.ReactNode
  intensity?: "subtle" | "medium" | "strong"
}

export default function CSSBeamsBackground({ 
  className, 
  intensity = "medium",
  children 
}: BeamsBackgroundProps) {
  const beamCount = {
    subtle: 3,
    medium: 5,
    strong: 7
  }[intensity]

  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-neutral-950", className)}>
      {/* CSS-only animated beams */}
      <div className="absolute inset-0">
        {Array.from({ length: beamCount }, (_, i) => (
          <div
            key={i}
            className="absolute opacity-20 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent blur-xl"
            style={{
              left: `${(i + 1) * (100 / (beamCount + 1))}%`,
              top: '100%',
              width: `${60 + Math.random() * 40}px`,
              height: '200vh',
              transform: 'translateX(-50%) rotate(-30deg)',
              animation: `floatUp ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
          `,
          animation: 'backgroundPulse 10s ease-in-out infinite alternate',
        }}
      />

      <div className="relative z-10">
        {children}
      </div>

      {/* Inject CSS animations */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateX(-50%) translateY(100vh) rotate(-30deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(-50%) translateY(-100vh) rotate(-30deg);
            opacity: 0;
          }
        }
        
        @keyframes backgroundPulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  )
}