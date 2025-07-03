import Header from "../../components/landing-page/Header";
import Footer from "../../components/landing-page/Footer";
import { Background } from "../../components/common/background";

export default function AboutUsPage() {
  return (
    <div className="relative min-h-screen">
      <Background />
      
      <div className="relative flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-4">
                  About Us
                </h1>
              </div>

              <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8 md:p-12 space-y-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/90 text-lg leading-relaxed">
                    <span className="font-bold text-blue-300">optqo</span> is the first agentic AI platform built on the legacy of <a href="https://6th-sense.in/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">6th-sense</a>'s decades of experience in analytics, risk modeling, fraud prevention, and automation. It helps teams modernize, translate, and document legacy analytics code at scale, using intelligent agents that combine code comprehension with domain expertise.
                  </p>

                  <p className="text-white/90 text-lg leading-relaxed mt-6">
                    Analytical programs have long been the <span className="font-semibold text-blue-200">backbone of data-driven decision-making</span> across industries—from financial services and healthcare to retail and manufacturing. These systems enable critical functions such as risk scoring, fraud detection, marketing analytics, and performance forecasting. However, as the <span className="font-semibold text-blue-200">volume, velocity, and variety of data</span> continue to grow exponentially, analytics pipelines are coming under unprecedented pressure. This surge in data complexity is <span className="font-semibold text-blue-200">intensifying the challenges</span> organizations already face with legacy systems, leading to slower delivery, inefficiencies, and increased operational risk.
                  </p>

                  <p className="text-white/90 text-lg leading-relaxed mt-6">
                    <span className="font-bold text-blue-300">optqo</span> was created in response to this widespread frustration: organizations everywhere are burdened by legacy analytics code that's hard to understand, poorly documented, and risky to maintain. Over the years, we've seen data teams struggle with technical debt, platform migrations, inconsistent coding, and knowledge loss—all of which slow down decision-making and innovation.
                  </p>

                  <p className="text-white/90 text-lg leading-relaxed mt-6">
                    Despite having sophisticated analytical teams and tools, many organizations lack the systems and capacity to perform structured code reviews, document institutional knowledge, or ensure consistency across analytics workflows. Onboarding new analysts becomes painful, compliance teams face delays during audits, and transformation initiatives are repeatedly held back by deeply embedded code silos.
                  </p>

                  <p className="text-white/90 text-lg leading-relaxed mt-6">
                    Built for analysts, data scientists, and business teams, optqo addresses these challenges by acting as an intelligent, expert layer over legacy environments. It automates code comprehension, flags inefficiencies, generates clean documentation, and accelerates modernization initiatives. It supports a wide range of tools, including <span className="font-semibold text-blue-200">SAS, Python, R, SQL, SPSS, STATA, EViews, MATLAB, and Julia</span>, and covers use cases from <span className="font-semibold text-blue-200">model development</span> to <span className="font-semibold text-blue-200">business analytics programming</span>.
                  </p>

                  <p className="text-white/90 text-lg leading-relaxed mt-6">
                    With agents like <span className="font-semibold text-blue-200">Code Sage</span>, <span className="font-semibold text-blue-200">Optimus</span>, <span className="font-semibold text-blue-200">Transform</span>, and <span className="font-semibold text-blue-200">Scribe</span>, optqo delivers real-time insights, clean documentation, and platform migration support.
                  </p>

                  <p className="text-white/90 text-lg leading-relaxed mt-8">
                    <span className="font-bold text-blue-300">Our goal:</span> Empower organizations to turn legacy code into a strategic asset—faster, smarter, and with AI-driven precision.
                  </p>
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