"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import ElectionCard from "../components/ElectionCard";

const parties = [
  { id: 1, name: "Crypto Elect", desc: "A futuristic decentralized vision.", logo: "/party1.png" },
  { id: 2, name: "Tech Union", desc: "Innovation and progress for all.", logo: "/party2.png" },
  { id: 3, name: "Eco Power", desc: "Green energy and sustainability.", logo: "/party3.png" },
  { id: 4, name: "Unity Front", desc: "Equality and unity for every citizen.", logo: "/party4.png" },
];

export default function VotingPage() {
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleVoteClick = (party: any) => {
    setSelectedParty(party);
    setOpen(true);
  };
    const elections = [
    "Student Council Election ",
    "Company Annual Board Election",
    "Crypto DAO Leadership Vote",
    "University Senate Election",
    "Community Party Election",
  ]


  return (
    <div className="min-h-screen bg-[url('/3.jpg')] bg-cover bg-center  px-6 py-16">
   <div className="flex justify-between items-center mt-6 mb-12 px-6">
  <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
    Cast Your Vote
  </h1>

  <button className="text-3xl cursor-pointer font-bold px-4 py-2 bg-blue-500 text-white rounded-lg">
    +
  </button>
</div>


      <div className="mx-3 my-3">
             {elections.map((title, idx) => (
        <ElectionCard key={idx} title={title} />
      ))}



      </div>

      {/* Party Cards Grid */}
   
    </div>
  );
}
