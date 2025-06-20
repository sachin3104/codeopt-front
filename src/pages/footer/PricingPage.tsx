import { Check, MoveRight, PhoneCall } from "lucide-react";
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
          <section className="py-32 sm:py-40">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-20">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-6">
                  Pricing Plans
                </h1>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Transform your code performance in minutes. Start free, upgrade anytime.
                </p>
              </div>

              <div className="space-y-12">
                {/* Optqo Free */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-3">Optqo Free</h2>
                    <p className="text-lg text-white/70 mb-4">
                      Get started with essential code optimization tools – perfect for exploration and small projects.
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">5 AI optimization requests per day</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Up to 300 lines per request</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Essential code diagnostics</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Basic optimization insights</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Email-based support</span>
                    </div>
                  </div>
                  
                  <button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-xl text-white px-8 py-3 flex items-center gap-2">
                    Get Started <MoveRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Optqo Pro */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-3">Optqo Pro</h2>
                    <p className="text-lg text-white/70 mb-4">
                      For analysts and practitioners seeking deeper diagnostics and more powerful insights.
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">50 AI optimization requests per day</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Up to 800 lines per request</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Comprehensive diagnostics (via Code Sage)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Visual workflow mapping and intermediate recommendations</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Priority support</span>
                    </div>
                  </div>
                  
                  <button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-xl text-white px-8 py-3 flex items-center gap-2">
                    Subscribe Now <MoveRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Optqo OptiFlow */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-3">Optqo OptiFlow</h2>
                    <p className="text-lg text-white/70 mb-4">
                      For advanced professionals and teams focused on scalable ML and analytics optimization.
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Unlimited AI optimization requests per day</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Up to 1000 lines per request</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Advanced refactoring with Optimus</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Real-time performance analytics</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Documentation reports with Scribe</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Priority support</span>
                    </div>
                  </div>
                  
                  <button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-xl text-white px-8 py-3 flex items-center gap-2">
                    Upgrade to OptiFlow <MoveRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Optqo Enterprise */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-3">Optqo Enterprise</h2>
                    <p className="text-lg text-white/70 mb-4">
                      Custom AI solutions for enterprise-scale optimization.
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Tailored platform aligned with your workflows and security policies</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Legacy system modernization (SAS, R, Python)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Custom AI models powered by our core agents (Code Sage, Optimus, Transform, Scribe)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Dedicated consulting team and expert-led delivery</span>
                    </div>
                  </div>
                  
                  <button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-xl text-white px-8 py-3 flex items-center gap-2">
                    Contact Us <PhoneCall className="w-4 h-4" />
                  </button>
                </div>

                {/* Optqo Expert */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-3">Optqo Expert</h2>
                    <p className="text-lg text-white/70 mb-4">
                      One-on-one mentoring with a senior analytics leader.
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">$200 per 30-minute session</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Personalized platform usage guidance</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Help defining and solving optimization needs</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">Toolchain advisory: Optqo + third-party solutions</span>
                    </div>
                  </div>
                  
                  <button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-xl text-white px-8 py-3 flex items-center gap-2">
                    Schedule a Call <PhoneCall className="w-4 h-4" />
                  </button>
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