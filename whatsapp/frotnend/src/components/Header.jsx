import { Link, useLocation } from "react-router-dom";
import WhatsAppLogo from "../assets/whatsapp-logo";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

function Header() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/upload", label: "Upload" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#25D366]/95 backdrop-blur-md text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 text-white">
            <WhatsAppLogo />
          </div>
          <h1 className="text-lg md:text-xl font-bold">
            WhatsApp Chat Analyzer
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-8">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`relative transition ${
                    pathname === to
                      ? "font-semibold after:absolute after:w-full after:h-0.5 after:bg-white after:left-0 after:-bottom-1"
                      : "hover:text-gray-100 hover:after:absolute hover:after:w-full hover:after:h-0.5 hover:after:bg-white/60 hover:after:left-0 hover:after:-bottom-1"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#25D366] border-t border-white/20">
          <ul className="flex flex-col items-center gap-4 py-4">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition ${
                    pathname === to
                      ? "bg-white/20 font-semibold"
                      : "hover:bg-white/10"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
