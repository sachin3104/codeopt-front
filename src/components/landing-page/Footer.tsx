import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-t border-white/20 pb-6 pt-16 lg:pb-8 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="md:flex md:items-start md:justify-between">
          <a
            href="/"
            className="flex items-center gap-x-2"
            aria-label="optqo"
          >
            <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              optqo
            </span>
          </a>
          <ul className="flex list-none mt-6 md:mt-0 space-x-3">
            <li>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
                asChild
              >
                <a 
                  href="https://twitter.com/optqo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
                asChild
              >
                <a 
                  href="https://discord.gg/optqo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
                asChild
              >
                <a 
                  href="https://linkedin.com/company/optqo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </li>
          </ul>
        </div>

        <div className="border-t border-white/20 mt-6 pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              <li className="my-1 mx-2 shrink-0">
                <a
                  href="#pricing"
                  className="text-lg text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 block py-2"
                >
                  Pricing
                </a>
              </li>
              <li className="my-1 mx-2 shrink-0">
                <a
                  href="#contact"
                  className="text-lg text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 block py-2"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end">
              <li className="my-1 mx-3 shrink-0">
                <a
                  href="#privacy"
                  className="text-lg text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 block py-2"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="my-1 mx-3 shrink-0">
                <a
                  href="#terms"
                  className="text-lg text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 block py-2"
                >
                  Terms of Service
                </a>
              </li>
              <li className="my-1 mx-3 shrink-0">
                <a
                  href="#cookies"
                  className="text-lg text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 block py-2"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-6 text-sm leading-6 text-white/60 whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <div>&copy; {new Date().getFullYear()} optqo. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}