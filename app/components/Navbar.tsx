"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">Crypto Elect</div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li className="hover:text-black cursor-pointer">Home</li>
          <li className="hover:text-black cursor-pointer">Register</li>
          <li className="hover:text-black cursor-pointer">Vote</li>
        </ul>

        {/* CTA Button (Desktop) */}
        <button className="hidden md:block bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition">
          Get Started
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-6 py-4">
          <ul className="flex flex-col space-y-4 text-gray-700 font-medium">
            <li className="hover:text-black cursor-pointer">Home</li>
            <li className="hover:text-black cursor-pointer">Register</li>
            <li className="hover:text-black cursor-pointer">Vote</li>
          </ul>
          <button className="w-full mt-4 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition">
            Get Started
          </button>
        </div>
      )}
    </header>
  );
}
