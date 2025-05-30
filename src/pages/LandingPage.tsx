import { motion } from "motion/react";
import Header from "../components/landing-page/Header";
import { GlowingEffectGrid } from "../components/landing-page/GlowingEffectGrid";
import CodeOptimizationSection from "../components/landing-page/CodeOptimizationSection";
import CodeCompareSection from "../components/landing-page/CodeCompareSection";
import WaitingListSection from "../components/landing-page/WaitingListSection";
import Footer from "../components/landing-page/Footer";
// import BeamsBackground from "@/components/beams-backgruond"; // Import the BeamsBackground component

export default function LandingPage() {
  return (
    <>
      {/* BeamsBackground wraps the entire page */}
      < >
        {/* Content container with proper z-index and dark theme forcing */}
        <div className="relative z-10 flex flex-col min-h-screen dark">
          <Header />
          
          {/* Main scrollable content */}
          <main className="flex-grow">
            <section className="h-screen flex items-center justify-center px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              >
                <h1 className="text-3xl md:text-7xl font-bold text-white">
                optqo: Next-Level Optimisation
                </h1>
                <p className="mt-4 font-extralight text-base md:text-4xl text-neutral-200">
                  Automate. Integrate. Optimize.
                </p>
                <button 
                onClick={() => window.location.href = '/login'}
                className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-full w-fit text-white px-6 py-3">
                  Start Free Trial
                </button>
              </motion.div>
            </section>
            
            {/* Features section - let background show through */}
            <section id="features" className="py-16 px-4">
              <GlowingEffectGrid />
            </section>
            
            {/* Code optimization section - let background show through */}
            <div id="benefits">
              <CodeOptimizationSection />
            </div>
            
            {/* Uncomment when InteractiveWorkflowSection is converted */}
            {/* <InteractiveWorkflowSection /> */}
            
            {/* Code compare section - let background show through */}
            <CodeCompareSection />
            
            {/* Waiting list section - let background show through */}
            <div id="contact">
              <WaitingListSection />
            </div>
          </main>
          
          {/* Footer - let background show through */}
          <Footer />
        </div>
      </>
    </>
  );
}