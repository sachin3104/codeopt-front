import { motion } from "motion/react";
import {
  BarChart2,
  Code,
  FileCode,
  FileText,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="h-screen flex flex-col justify-center px-4 text-center">
      <div className="mt-16 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Analytics, Reinvented with AI & Experts
          </h1>
          <p className="mt-4 font-extralight text-sm sm:text-base md:text-lg lg:text-xl text-neutral-200 max-w-3xl mx-auto">
            Optqo helps you understand, optimize, translate, and document legacy analytics code — with intelligent AI agents and optional expert support.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-6 md:mt-8 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-full w-fit text-white px-6 py-3 text-sm md:text-base"
          >
            Start Free Trial
          </button>
          <p className="mt-3 text-xs md:text-sm text-neutral-300">
            No credit card required • Instant access
          </p>
          
          {/* Agent Icons Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
            className="mt-8 md:mt-12"
          >
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-2xl mx-auto">
              {/* Code Sage */}
              <div className="flex flex-col items-center">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-3 md:p-4 hover:bg-white/10 transition-all duration-300">
                  <BarChart2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-white mt-2">Code Sage</h3>
                <p className="text-xs text-neutral-300">Understand</p>
              </div>
              
              {/* Optimus */}
              <div className="flex flex-col items-center">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-3 md:p-4 hover:bg-white/10 transition-all duration-300">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-white mt-2">Optimus</h3>
                <p className="text-xs text-neutral-300">Optimize</p>
              </div>
              
              {/* Transform */}
              <div className="flex flex-col items-center">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-3 md:p-4 hover:bg-white/10 transition-all duration-300">
                  <FileCode className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-white mt-2">Transform</h3>
                <p className="text-xs text-neutral-300">Translate</p>
              </div>
              
              {/* Scribe */}
              <div className="flex flex-col items-center">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-3 md:p-4 hover:bg-white/10 transition-all duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-white mt-2">Scribe</h3>
                <p className="text-xs text-neutral-300">Document</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 