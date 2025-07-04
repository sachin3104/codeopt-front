import Header from "../components/landing-page/Header";
import HeroSection from "../components/landing-page/HeroSection";
import { CodeSageVideo, OptimusVideo, TransformVideo, ScribeVideo } from "../components/landing-page/video-functions";
import CodeOptimizationSection from "../components/landing-page/CodeOptimizationSection";
import Footer from "../components/landing-page/Footer";
// import BeamsBackground from "@/components/beams-backgruond"; // Import the BeamsBackground component
import PricingCards from "../components/landing-page/PricingCards";
// import Testimonials from "../components/landing-page/Testimonials";
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
          <section id="features" className="py-12 sm:py-16 lg:py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex text-center justify-center items-center gap-4 flex-col mb-12 sm:mb-16">
                <div className="flex gap-2 flex-col">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent px-2 sm:px-0">
                    Meet the Agents
                  </h2>
                  <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto px-4 sm:px-0">
                    A system of agentic AI—each with a distinct purpose—to modernize, optimize, and explain your legacy analytics code.
                  </p>
                </div>
              </div>
              
              <div className="space-y-16 sm:space-y-20 lg:space-y-24">
                <CodeSageVideo />
                <OptimusVideo />
                <TransformVideo />
                <ScribeVideo />
              </div>
            </div>
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