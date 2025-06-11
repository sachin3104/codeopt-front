import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-6">
                optqo
              </h2>
            </div>
            
            {/* Social Links */}
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <a 
                  href="https://twitter.com/optqo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 hover:translate-x-1"
                >
                  <span className="font-medium">X (Twitter)</span>
                  <ExternalLink size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
                <a 
                  href="https://discord.gg/optqo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 hover:translate-x-1"
                >
                  <span className="font-medium">Discord</span>
                  <ExternalLink size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
                <a 
                  href="https://linkedin.com/company/optqo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 hover:translate-x-1"
                >
                  <span className="font-medium">LinkedIn</span>
                  <ExternalLink size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <a 
                href="#pricing" 
                className="text-white/70 hover:text-white transition-all duration-300 text-lg block py-2 hover:translate-x-2"
              >
                Pricing
              </a>
              <a 
                href="#contact" 
                className="text-white/70 hover:text-white transition-all duration-300 text-lg block py-2 hover:translate-x-2"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <a 
                href="#privacy" 
                className="text-white/70 hover:text-white transition-all duration-300 text-lg block py-2 hover:translate-x-2"
              >
                Privacy Policy
              </a>
              <a 
                href="#terms" 
                className="text-white/70 hover:text-white transition-all duration-300 text-lg block py-2 hover:translate-x-2"
              >
                Terms of Service
              </a>
              <a 
                href="#cookies" 
                className="text-white/70 hover:text-white transition-all duration-300 text-lg block py-2 hover:translate-x-2"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} optqo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}