"use client";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import localFont from "next/font/local";
import { motion } from "framer-motion";
import TeamSection from "./components/Team";
import Hero from "./components/Hero";

const myFont = localFont({
  src: "../fonts/CryptonInk.ttf",
  variable: "--font-crypto",
  display: "swap",
});

export default function StoryParallax() {
  return (
    <Hero/>
   
  );
}
