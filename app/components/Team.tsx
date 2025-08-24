"use client"
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function TeamSection() {
  const team = [
    { name: "Hithesh ", role: "Product Designer", img: "/team1.jpg" },
    { name: "Harshavardan", role: "Frontend Engineer", img: "/team2.jpg" },
    { name: "Srikar", role: "Marketing Lead", img: "/team3.jpg" },
    { name: "Vansh", role: "Backend Developer", img: "/team4.jpg" },
  ];

  return (
    <section className="relative z-10 py-20">
      <h2
        className="text-center text-5xl font-extrabold text-transparent bg-clip-text 
                   bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 
                   drop-shadow-[0_0_25px_rgba(255,0,200,0.7)] mb-16"
      >
        Meet Our Team
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
        {team.map((member, idx) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl overflow-hidden shadow-xl bg-white/10 
                             backdrop-blur-xl border border-white/20 
                             hover:scale-105 hover:shadow-pink-500/40 
                             transition duration-500">
              {/* Full Image */}
              <div className="relative w-full h-64">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Name & Role */}
              <CardContent className="flex flex-col items-center p-4 bg-black/40 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-gray-300">{member.role}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
