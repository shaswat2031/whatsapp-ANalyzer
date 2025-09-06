import React from "react";
import { Github, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto relative">
      {/* Gradient Divider */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600" />

      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Brand */}
        <p className="text-sm text-gray-400 mb-4 md:mb-0">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">WhatsApp Chat Analyzer</span>. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex space-x-6">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-white transition"
          >
            <Github className="w-4 h-4" />
            <span className="text-sm">GitHub</span>
          </a>
          <a
            href="mailto:support@example.com"
            className="flex items-center space-x-1 hover:text-white transition"
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm">Contact</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
