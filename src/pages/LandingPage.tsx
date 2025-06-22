import { motion } from "motion/react";
import Header from "../components/landing-page/Header";
import { GlowingEffectGrid } from "../components/landing-page/GlowingEffectGrid";
import CodeOptimizationSection from "../components/landing-page/CodeOptimizationSection";
import Footer from "../components/landing-page/Footer";
// import BeamsBackground from "@/components/beams-backgruond"; // Import the BeamsBackground component
import PricingCards from "../components/landing-page/PricingCards";
import Testimonials from "../components/landing-page/Testimonials";
import { Background } from "../components/common/background";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background component */}
      <Background />
      
      {/* Content container */}
      <div className="relative flex flex-col min-h-screen">
        <Header />
        
        {/* Main scrollable content */}
        <main className="flex-grow">
          <section className="h-screen flex items-center justify-center px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              className="relative z-10"
            >
              <h1 className="text-xl md:text-6xl font-bold text-white">
                Analytics, Reinvented with AI & Experts
              </h1>
              <p className="text-sm mt-4 font-extralight text-sm md:text-2xl text-neutral-200">
                Understand, Optimize, Translate & Document Your Code — with AI Agents and Expert Mentoring.
              </p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-full w-fit text-white px-6 py-3">
                Start Free Trial
              </button>
            </motion.div>
          </section>
          
          {/* Features section */}
          <section id="features" className="py-16 sm:py-20 relative z-10">
            <GlowingEffectGrid />
          </section>
          
          {/* Code optimization section */}
          <div id="benefits" className="relative z-10">
            <CodeOptimizationSection />
          </div>
          
          <div className="relative z-10">
            {/* <Testimonials /> */}
            <PricingCards />
          </div>
        </main>
        
        {/* Footer */}
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}