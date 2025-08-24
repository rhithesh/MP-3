import localFont from "next/font/local";

import { Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";



const FFont = localFont({
  src: "../../fonts/CryptonInk.ttf",
  variable: "--font-crypto",
  display: "swap",
});

export default function Footer() {
  return (
    <footer className="relative mx-3 my-2 rounded-xl z-10 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/footer/1.jpg" // <-- put your image in /public/footer/1.jpg
          alt="Footer background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay with very light opacity so image is ~90% visible */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Glassmorphic Container */}
      <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-8">
          
          {/* Big Heading */}
          <h2 className={`text-5xl ${FFont.className} font-extrabold text-transparent bg-clip-text 
                         bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 
                         drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]`}>
            Contact Us
          </h2>

          {/* Social Links Row */}
          <div className="flex gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/20"
            >
              <Github className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/20"
            >
              <Linkedin className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/20"
            >
              <Twitter className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
