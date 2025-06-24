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
          <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-20">
                <div className="flex justify-center mb-6">
                  <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-4">
                    <BookOpen className="h-12 w-12 text-blue-400" />
                  </div>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-6">
                  Blogs
                </h1>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Insights, tutorials, and best practices for code optimization and analytics.
                </p>
              </div>

              <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-6">
                    <Clock className="h-16 w-16 text-blue-400" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
                <p className="text-lg text-white/70 mb-6 max-w-md mx-auto">
                  We're working hard to bring you insightful content about code optimization, analytics best practices, and industry trends.
                </p>
                <div className="flex items-center justify-center gap-2 text-white/50">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Stay tuned for our first blog post</span>
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