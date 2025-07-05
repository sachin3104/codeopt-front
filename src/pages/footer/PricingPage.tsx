import { Check, MoveRight, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../../components/landing-page/Header";
import Footer from "../../components/landing-page/Footer";
import { Background } from "../../components/common/background";

export default function PricingPage() {
  return (
    <div className="relative min-h-screen">
      <Background />
      
      <div className="relative flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <section className="pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 lg:pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-4 sm:mb-6 px-2 sm:px-0">
                  Pricing Plans
                </h1>
                <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto px-4 sm:px-0">
                  Transform your code performance in minutes. Start free, upgrade anytime.
                </p>
              </div>

              <div className="space-y-8 sm:space-y-12">
                {/* optqo Free */}
                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">optqo Free</h2>
                    <p className="text-sm sm:text-lg text-white/70 mb-3 sm:mb-4">
                      Get started with essential code optimization tools – perfect for exploration and small projects.
                    </p>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">20 AI optimization requests per day</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Up to 15000 characters per request</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Essential code diagnostics</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Basic optimization insights</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Email-based support</span>
                    </div>
                  </div>
                  
                  <Link to="/login" className="block">
                    <button className="w-full sm:w-auto backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-lg sm:rounded-xl text-white px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base">
                      Get Started <MoveRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </Link>
                </div>

                {/* optqo Pro */}
                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">optqo Pro</h2>
                    <p className="text-sm sm:text-lg text-white/70 mb-3 sm:mb-4">
                      For analysts and practitioners seeking deeper diagnostics and more powerful insights.
                    </p>
                    <div className="text-xl sm:text-2xl font-bold text-white mb-2">$9.99<span className="text-sm sm:text-lg font-normal text-white/60">/month</span></div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">100 AI optimization requests per day</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Up to 40000 characters per request</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Comprehensive diagnostics (via Code Sage)</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Visual workflow mapping and intermediate recommendations</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Priority support</span>
                    </div>
                  </div>
                  
                  <Link to="/login" className="block">
                    <button className="w-full sm:w-auto backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-lg sm:rounded-xl text-white px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base">
                      Subscribe Now <MoveRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </Link>
                </div>

                {/* optqo OptiFlow */}
                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">optqo Ultimate</h2>
                    <p className="text-sm sm:text-lg text-white/70 mb-3 sm:mb-4">
                      For advanced professionals and teams focused on scalable ML and analytics optimization.
                    </p>
                    <div className="text-xl sm:text-2xl font-bold text-white mb-2">$30<span className="text-sm sm:text-lg font-normal text-white/60">/month</span></div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Unlimited AI optimization requests per day</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Up to 50000 characters per request</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Advanced refactoring with Optimus</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Real-time performance analytics</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Documentation reports with Scribe</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Priority support</span>
                    </div>
                  </div>
                  
                  <Link to="/login" className="block">
                    <button className="w-full sm:w-auto backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-lg sm:rounded-xl text-white px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base">
                      Upgrade to Ultimate <MoveRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </Link>
                </div>

                {/* optqo Enterprise */}
                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">optqo Enterprise</h2>
                    <p className="text-sm sm:text-lg text-white/70 mb-3 sm:mb-4">
                      Custom AI solutions for enterprise-scale optimization.
                    </p>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Tailored platform aligned with your workflows and security policies</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Legacy system modernization (SAS, R, Python)</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Custom AI models powered by our core agents (Code Sage, Optimus, Transform, Scribe)</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Dedicated consulting team and expert-led delivery</span>
                    </div>
                  </div>
                  
                  <Link to="/login" className="block">
                    <button className="w-full sm:w-auto backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-lg sm:rounded-xl text-white px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base">
                      Contact Us <PhoneCall className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </Link>
                </div>

                {/* optqo Expert */}
                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">optqo Expert</h2>
                    <p className="text-sm sm:text-lg text-white/70 mb-3 sm:mb-4">
                      One-on-one mentoring with a senior analytics leader.
                    </p>
                    <div className="text-xl sm:text-2xl font-bold text-white mb-2">$150<span className="text-sm sm:text-lg font-normal text-white/60">/30 min</span></div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">$300 per 60-minute session</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Personalized platform usage guidance</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Help defining and solving optimization needs</span>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80">Toolchain advisory: optqo + third-party solutions</span>
                    </div>
                  </div>
                  
                  <Link to="/login" className="block">
                    <button className="w-full sm:w-auto backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-lg sm:rounded-xl text-white px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base">
                      Book Session <MoveRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
} 