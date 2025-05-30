import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import clsx from "clsx";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-white">
                optqo
              </span>
            </div>
            <p className="text-white/70 mb-4">
              Transforming analytics program management through intelligent automation
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition">
                <Github size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-white/70 hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-white/70 hover:text-white transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/70 hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.12)]">
          <p className="text-center text-sm text-white/60">
            &copy; {new Date().getFullYear()} AgenticAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}