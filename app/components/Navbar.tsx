"use client";

export default function Navbar() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">Crypto Elect</div>

        {/* Links */}
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li className="hover:text-black cursor-pointer">Home</li>
          <li className="hover:text-black cursor-pointer">Register</li>
          <li className="hover:text-black cursor-pointer">Vote</li>
        </ul>

        {/* CTA Button */}
        <button className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition">
          Get Started
        </button>
      </nav>
    </header>
  );
}
