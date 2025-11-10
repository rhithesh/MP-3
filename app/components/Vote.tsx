"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

const parties = [
  { id: 1, name: "Crypto Elect", desc: "A futuristic decentralized vision.", logo: "/party1.png" },
  { id: 2, name: "Tech Union", desc: "Innovation and progress for all.", logo: "/party2.png" },
  { id: 3, name: "Eco Power", desc: "Green energy and sustainability.", logo: "/party3.png" },
  { id: 4, name: "Unity Front", desc: "Equality and unity for every citizen.", logo: "/party4.png" },
];

export default function VotingPage() {
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [currentElectionId, setCurrentElectionId] = useState<string | null>(null);

  const handleVoteClick = (party: any) => {
    setSelectedParty(party);
    setCurrentElectionId(electionId); // ✅ store election ID
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-[url('/3.jpg')] bg-cover bg-center flex flex-col items-center justify-center px-6 py-16">
      <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-12">
        Cast Your Vote
      </h1>

      {/* Party Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {parties.map((party, idx) => (
          <motion.div
            key={party.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
          >
            <Card
              className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl 
                         hover:scale-105 transition duration-300 cursor-pointer text-white"
              onClick={() => handleVoteClick(party)}
            >
              <CardHeader className="flex flex-col items-center">
                <img src={party.logo} alt={party.name} className="w-20 h-20 object-contain mb-4" />
                <h2 className="text-2xl font-bold">{party.name}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-200">{party.desc}</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  variant="ghost"
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white"
                >
                  Vote
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Vote Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white/20 backdrop-blur-2xl border border-white/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Confirm Your Vote
            </DialogTitle>
          </DialogHeader>
          {selectedParty && (
            <div className="text-center space-y-6">
              <img
                src={selectedParty.logo}
                alt={selectedParty.name}
                className="w-20 h-20 mx-auto"
              />
              <p>
                Are you sure you want to vote for{" "}
                <span className="font-semibold">{selectedParty.name}</span>?
              </p>
              <Button
                className="w-full bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 text-white"
                onClick={() => {
                  alert(`✅ Your vote for ${selectedParty.name} has been recorded!`);
                  setOpen(false);
                }}
              >
                Confirm Vote
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
