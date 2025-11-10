"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ElectionCard from "../components/ElectionCard";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";

export default function VotingPage() {
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [credentialId, setCredentialId] = useState<string | null>(null);

  const [newElectionTitle, setNewElectionTitle] = useState("");
  const [newElectionDesc, setNewElectionDesc] = useState("");
  const [newElectionCandidates, setNewElectionCandidates] = useState<string[]>(
    []
  );
  const [newCandidateInput, setNewCandidateInput] = useState("");

  const [userId] = useState("user-abc123");
  const [verified] = useState(true);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    async function initialize() {
      const stored = localStorage.getItem("CryptoElectAuth");
      if (stored) {
        try {
          const obj = JSON.parse(stored);
          const id =
            obj?.credentialId || obj?.user?.passKey?.credentialId || null;
          setCredentialId(id);
        } catch {
          console.log("Invalid stored user object");
        }
      }

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
    initialize();
  }, []);

  const handleVoteClick = (party: any) => {
    setSelectedParty(party);
    setVoteDialogOpen(true);
  };

  const handleVoteConfirm = async (electionId: string) => {
    if (!selectedParty || !credentialId || !publicKey) return alert("Connect wallet first");

    try {
      // ✅ Send 0.2 SOL per vote
      const receiver = new PublicKey("6GkgfKeGCixwH4dCnYJgP18o4LX9fRagJugZjLVgSA4X");

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiver,
          lamports: 0.2 * LAMPORTS_PER_SOL, // ✅ 0.2 SOL
        })
      );

      const signature = await sendTransaction(transaction, connection);

      const res = await fetch("/api/buissnes/votetoelection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electionId,
          userId,
          candidate: selectedParty.name,
          verified,
          signature,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Vote failed");

      alert(`Vote cast for ${selectedParty.name} ✅`);

      setVoteDialogOpen(false);
      setSelectedParty(null);

      const updated = await fetch("/api/buissnes/getelections").then((r) =>
        r.json()
      );
      setElections(updated.elections);
    } catch (err) {
      console.error("Vote error:", err);
      alert("Transaction failed ❌");
    }
  };

  const handleCreateElection = async () => {
    if (!newElectionTitle || !newElectionDesc || newElectionCandidates.length === 0)
      return alert("Fill all fields & add at least one candidate");

    try {
      const res = await fetch("/api/buissnes/createElection", {
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
      if (!res.ok) return alert(data.error || "Failed to create");

      alert("Election created ✅");
      setCreateDialogOpen(false);
      setNewElectionTitle("");
      setNewElectionDesc("");
      setNewElectionCandidates([]);
      setElections((prev) => [...prev, data.election]);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (loading) return <div className="text-white text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-[url('/3.jpg')] bg-cover bg-center px-6 py-16">
      <div className="flex justify-between items-center mt-6 mb-12 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Cast Your Vote
        </h1>
        <div className="flex items-center gap-4">
          <WalletMultiButton />
          <button
            className="text-3xl cursor-pointer font-bold px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => setCreateDialogOpen(true)}
          >
            +
          </button>
        </div>
      </div>

      {elections.map((election) => (
        <ElectionCard
          key={election.id}
          title={election.title}
          description={election.description}
          result={election.results}
          handleVoteClick={handleVoteClick}
        />
      ))}

      {/* Vote Confirmation */}
      <Dialog open={voteDialogOpen} onOpenChange={setVoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
          </DialogHeader>
          {selectedParty && (
            <div className="text-center">
              <p className="mb-4">
                Are you sure you want to vote for <b>{selectedParty.name}</b>?
              </p>
              <Button onClick={() => handleVoteConfirm(elections[0]?.id)}>
                Yes, Vote
              </Button>
              <Button variant="secondary" onClick={() => setVoteDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
