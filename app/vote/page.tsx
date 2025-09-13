"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const parties = [
  { id: 1, name: "Crypto Elect", desc: "A futuristic decentralized vision.", logo: "/party1.png" },
  { id: 2, name: "Tech Union", desc: "Innovation and progress for all.", logo: "/party2.png" },
  { id: 3, name: "Eco Power", desc: "Green energy and sustainability.", logo: "/party3.png" },
  { id: 4, name: "Unity Front", desc: "Equality and unity for every citizen.", logo: "/party4.png" },
];

export default function VotingPage() {
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // For creating new election
  const [newElectionTitle, setNewElectionTitle] = useState("");
  const [newElectionDesc, setNewElectionDesc] = useState("");
  const [newElectionCandidates, setNewElectionCandidates] = useState<string[]>([]);
  const [newCandidateInput, setNewCandidateInput] = useState("");

  const [userId] = useState("user-abc123");
  const [verified] = useState(true);


  const credentialId = JSON.stringify(localStorage.getItem("CryptoElectAuth")).user.credentialId;


  useEffect(() => {
    async function fetchElections() {
      try {
        const res = await fetch("/api/buissnes/getelections");
        const data = await res.json();
        setElections(data.elections);
      } catch (err) {
        console.error("Error fetching elections:", err);
      } finally {
        setLoading(false);
      }
    }

    async function verifyUser(){
     try{

        const profileRes = await fetch("/api/buissnes/profileCheck", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credentialId: credentialId}),
        });
        const profileData = await profileRes.json();

        if  (profileData.exists){
          console.log("User verified!!")
        }
        else{
          console.error("User Failed")


        }


     }
     catch(e){
      console.error(e)
     }

    }

    fetchElections();
  }, []);

  // Voting
  const handleVoteClick = (party: any) => {
    setSelectedParty(party);
    setVoteDialogOpen(true);
  };

  const handleVoteConfirm = async (electionId: string) => {
    if (!selectedParty) return;

    try {
      const res = await fetch("/api/buissnes/votetoelection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electionId,
          userId,
          candidate: selectedParty.name,
          verified,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Vote cast successfully for ${selectedParty.name}!`);
        setVoteDialogOpen(false);
        setSelectedParty(null);
        const updatedElections = await fetch("/api/buissnes/getelections").then(res => res.json());
        setElections(updatedElections.elections);
      } else {
        alert(data.error || "Failed to vote");
      }
    } catch (err) {
      console.error("Vote error:", err);
      alert("Something went wrong");
    }
  };

  // Creating election
  const handleCreateElection = async () => {
    if (!newElectionTitle || !newElectionDesc || newElectionCandidates.length === 0)
      return alert("Please fill all fields and add at least one candidate");

    try {
      const res = await fetch("/api/buissnes/createelection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newElectionTitle,
          description: newElectionDesc,
          candidates: newElectionCandidates,
          userId,
          verified,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Election created successfully!");
        setCreateDialogOpen(false);
        setNewElectionTitle("");
        setNewElectionDesc("");
        setNewElectionCandidates([]);
        setElections(prev => [...prev, data.election]);
      } else {
        alert(data.error || "Failed to create election");
      }
    } catch (err) {
      console.error("Create election error:", err);
      alert("Something went wrong");
    }
  };

  if (loading) return <div className="text-white text-xl">Loading elections...</div>;

  return (
    <div className="min-h-screen bg-[url('/3.jpg')] bg-cover bg-center px-6 py-16">
      <div className="flex justify-between items-center mt-6 mb-12 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Cast Your Vote
        </h1>
        <button
          className="text-3xl cursor-pointer font-bold px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => setCreateDialogOpen(true)}
        >
          +
        </button>
      </div>

      <div className="mx-3 my-3">
        {elections.map((election) => (
          <Card key={election.id} className="mb-4 bg-white/80">
            <CardHeader>
              <h2 className="text-xl font-bold">{election.title}</h2>
            </CardHeader>
            <CardContent>
              <p>{election.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {parties.map((party) => (
                  <Card key={party.id} className="p-2 cursor-pointer" onClick={() => handleVoteClick(party)}>
                    <img src={party.logo} alt={party.name} className="w-full h-24 object-contain mb-2" />
                    <h3 className="font-bold text-center">{party.name}</h3>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vote Confirmation Dialog */}
      <Dialog open={voteDialogOpen} onOpenChange={setVoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
          </DialogHeader>
          {selectedParty && (
            <div className="text-center">
              <p className="mb-4">Are you sure you want to vote for {selectedParty.name}?</p>
              <Button className="mr-2" onClick={() => handleVoteConfirm(elections[0]?.id)}>Yes, Vote</Button>
              <Button variant="secondary" onClick={() => setVoteDialogOpen(false)}>Cancel</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Election Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Election</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Election Title"
              className="border rounded p-2"
              value={newElectionTitle}
              onChange={(e) => setNewElectionTitle(e.target.value)}
            />
            <textarea
              placeholder="Election Description"
              className="border rounded p-2"
              value={newElectionDesc}
              onChange={(e) => setNewElectionDesc(e.target.value)}
            />

            {/* Candidates Input */}
            <div className="flex flex-col gap-2">
              <label className="font-bold">Candidates:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Candidate Name"
                  className="border rounded p-2 flex-1"
                  value={newCandidateInput}
                  onChange={(e) => setNewCandidateInput(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (newCandidateInput.trim()) {
                      setNewElectionCandidates(prev => [...prev, newCandidateInput.trim()]);
                      setNewCandidateInput("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {newElectionCandidates.map((c, idx) => (
                  <span key={idx} className="bg-blue-200 px-2 py-1 rounded-full flex items-center gap-1">
                    {c}
                    <button onClick={() =>
                      setNewElectionCandidates(prev => prev.filter((_, i) => i !== idx))
                    }>✕</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleCreateElection}>Create</Button>
              <Button variant="secondary" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
