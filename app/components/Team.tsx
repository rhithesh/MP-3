import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function TeamSection() {
  const team = [
    { name: "Alice Johnson", role: "Product Designer", img: "/team1.jpg" },
    { name: "Rahul Mehta", role: "Frontend Engineer", img: "/team2.jpg" },
    { name: "Sophia Lee", role: "Marketing Lead", img: "/team3.jpg" },
    { name: "Daniel Kim", role: "Backend Developer", img: "/team4.jpg" },
  ];

  return (
<section className="relative z-10 py-20 border-4 border-red-500">
      <h2
        className="text-center text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text 
                   bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 
                   drop-shadow-[0_0_25px_rgba(255,0,200,0.7)] mb-12 sm:mb-16"
      >
        Meet Our Team
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 max-w-6xl mx-auto px-4 sm:px-6">
        {team.map((member, idx) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card
              className="w-full rounded-2xl overflow-hidden shadow-xl bg-white/10 
                         backdrop-blur-xl border border-white/20 
                         hover:scale-105 hover:shadow-pink-500/40 
                         transition duration-500 flex flex-col"
            >
              <div className="relative w-full h-48 sm:h-56 md:h-64">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              <CardContent className="flex flex-col items-center text-center p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">{member.role}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
