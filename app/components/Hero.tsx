"use client";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import localFont from "next/font/local";
import { motion } from "framer-motion";
import TeamSection from "./Team";

const HFont = localFont({
  src: "../../fonts/CryptonInk.ttf",
  variable: "--font-crypto",
  display: "swap",
});

export default function Hero() {
  return (
    <div className="w-full h-screen">
      <Parallax pages={3.5} className="bg-black">
        {/* Page 1 - Video Background */}
        <ParallaxLayer offset={0} speed={0.2} factor={1.2}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/01.mp4" type="video/mp4" />
          </video>
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.6}>
          <div className="flex items-center justify-center h-screen">
            <h1
              className={`text-5xl ${HFont.className} font-bold text-white drop-shadow-lg`}
            >
              Welcome to <br />
              the Story <br />
              of <br />
              Crypto Elect
            </h1>
          </div>
        </ParallaxLayer>

        {/* Page 2 - Image */}
        <ParallaxLayer offset={1} speed={0.2} factor={1.2}>
          <img
            src="/1.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.9}>
          <div className="relative flex flex-col items-center justify-center h-screen space-y-10 px-6 z-10">
            <h2
              className="text-6xl font-extrabold text-transparent bg-clip-text 
                         bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 
                         drop-shadow-[0_0_25px_rgba(255,0,200,0.9)] animate-pulse"
            >
              Discover the Story
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
              {[
                {
                  title: "Voting made faster and secure",
                  desc: "Tradi.",
                },
                {
                  title: "We store no details",
                  desc: "Relive the moments through immersive visuals.",
                },
                {
                  title: "Quick and simple",
                  desc: "This is as simple as it gets.",
                },
              ].map((card, idx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="rounded-3xl shadow-2xl bg-white/20 
                                  backdrop-blur-xl border border-white/30 
                                  hover:scale-105 hover:shadow-pink-500/40 
                                  transition duration-500 p-6">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">
                      {card.title}
                    </h3>
                    <p className="text-gray-100">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ParallaxLayer>

        {/* Page 3 - Team Background */}
        <ParallaxLayer offset={2} speed={0.2} factor={2.2}>
          <img
            src="/3.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </ParallaxLayer>

        {/* Page 3 - Team Content */}
        <ParallaxLayer
          offset={2}
          speed={0.4}
          factor={10.2} // 🔥 Increased height so grid never cuts off
          style={{ zIndex: 2 }}
        >
          <TeamSection />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}
