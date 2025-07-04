import { FileText, Clock, BookOpen } from "lucide-react";
import Header from "../../components/landing-page/Header";
import Footer from "../../components/landing-page/Footer";
import { Background } from "../../components/common/background";

export default function BlogsPage() {
  return (
    <div className="relative min-h-screen">
      <Background />
      
      <div className="relative flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <section className="pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 lg:pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-400" />
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-4 sm:mb-6 px-2 sm:px-0">
                  Blogs
                </h1>
                <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto px-4 sm:px-0">
                  Insights, tutorials, and best practices for code optimization and analytics.
                </p>
              </div>

              <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <Clock className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-blue-400" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Coming Soon</h2>
                <p className="text-base sm:text-lg text-white/70 mb-4 sm:mb-6 max-w-md mx-auto px-2 sm:px-0">
                  We're working hard to bring you insightful content about code optimization, analytics best practices, and industry trends.
                </p>
                <div className="flex items-center justify-center gap-2 text-white/50">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Stay tuned for our first blog post</span>
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