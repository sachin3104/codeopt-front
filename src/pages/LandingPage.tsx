import Header from "../components/landing-page/Header";
import HeroSection from "../components/landing-page/HeroSection";
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
          <HeroSection />
          
          {/* Features section */}
          <section id="features" className="py-16 sm:py-20 relative z-10">
            <GlowingEffectGrid />
          </section>
          
          {/* Code optimization section */}
          {/* <div id="benefits" className="relative z-10">
            <CodeOptimizationSection />
          </div> */}
          
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