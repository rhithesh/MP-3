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
  TransactionInstruction,
} from "@solana/web3.js";
import { toast } from "sonner";


export default function VotingPage() {
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [currentElectionId, setCurrentElectionId] = useState<string | null>(null);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [credentialId, setCredentialId] = useState<string | null>(null);
  const [newElectionTitle, setNewElectionTitle] = useState("");
  const [newElectionDesc, setNewElectionDesc] = useState("");
  const [newElectionCandidates, setNewElectionCandidates] = useState<string[]>([]);
  const [newCandidateInput, setNewCandidateInput] = useState("");

  const userId = "user-abc123";
  const verified = true;

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // ✅ Load Elections + Credential
  useEffect(() => {
    async function init() {
      const stored = localStorage.getItem("CryptoElectAuth");
      if (stored) {
        try {
          const obj = JSON.parse(stored);
          setCredentialId(obj?.credentialId || obj?.user?.passKey?.credentialId || null);
        } catch {}
      }

      const res = await fetch("/api/buissnes/getelections");
      const data = await res.json();
      setElections(data.elections);
      setLoading(false);
    }
    init();
  }, []);

  // ✅ When candidate clicked inside card
  const handleVoteClick = (party: any, electionId: string) => {
    setSelectedParty(party);
    setCurrentElectionId(electionId);
    setVoteDialogOpen(true);
  };

  // ✅ Confirm Vote
  const handleVoteConfirm = async () => {
    if (!selectedParty || !publicKey || !currentElectionId)
      return alert("Connect wallet first");

    try {
      const receiver = new PublicKey("6GkgfKeGCixwH4dCnYJgP18o4LX9fRagJugZjLVgSA4X");

      // Create vote data JSON to store on-chain
      const voteData = {
        electionId: currentElectionId,
        userId: userId,
        candidate: selectedParty.name,
        timestamp: new Date().toISOString(),
      };

      // Create memo instruction manually
      const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
      const memoData = JSON.stringify(voteData);
      
      // Convert string to bytes - use TextEncoder for browser compatibility
      const encoder = new TextEncoder();
      const memoBytes = encoder.encode(memoData);
      
      // TransactionInstruction accepts Uint8Array at runtime, even though types say Buffer
      const memoInstruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
        programId: MEMO_PROGRAM_ID,
        data: memoBytes as Buffer, // Type assertion - Uint8Array works at runtime
      });

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiver,
          lamports: 0.2 * LAMPORTS_PER_SOL,
        }),
        // Add memo instruction with vote data
        memoInstruction
      );

      const signature = await sendTransaction(tx, connection);

      const res = await fetch("/api/buissnes/votetoelection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electionId: currentElectionId,
          userId,
          candidate: selectedParty.name,
          verified,
          signature,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      toast.success(
        <div className="space-y-2">
          <div>✅ Vote Recorded on Solana!</div>
          <div className="flex flex-col gap-2 text-sm">
            <a
              href={`https://solscan.io/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-300 font-semibold hover:text-blue-200"
            >
              🔍 View on Solscan (Devnet)
            </a>
            <a
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-purple-300 font-semibold hover:text-purple-200"
            >
              🔗 View on Solana Explorer (Devnet)
            </a>
            {publicKey && (
              <a
                href={`https://solscan.io/account/${publicKey.toBase58()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-green-300 font-semibold hover:text-green-200"
              >
                💼 View Your Wallet (Devnet)
              </a>
            )}
          </div>
        </div>
      );
      

      setVoteDialogOpen(false);
      setSelectedParty(null);

      const refreshed = await fetch("/api/buissnes/getelections").then((r) => r.json());
      setElections(refreshed.elections);
    } catch (err) {
      console.error(err);
      alert("❌ Transaction failed");
    }
  };

  // ✅ Create new election
  const handleCreateElection = async () => {
    if (!newElectionTitle || !newElectionDesc || newElectionCandidates.length === 0)
      return alert("Fill all fields & add candidates");

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
    if (!res.ok) return alert(data.error);

    alert("✅ Election created!");

    setCreateDialogOpen(false);
    setNewElectionTitle("");
    setNewElectionDesc("");
    setNewElectionCandidates([]);

    setElections((prev) => [...prev, data.election]);
  };

  if (loading) return <div className="text-white text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-[url('/3.jpg')] bg-cover bg-center px-6 py-16">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">Cast Your Vote</h1>
        <div className="flex items-center gap-4">
          {publicKey && (
            <div className="flex flex-col items-end gap-1">
              <a
                href={`https://solscan.io/account/${publicKey.toBase58()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/80 hover:text-white underline"
              >
                View Wallet on Solscan
              </a>
              <a
                href={`https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/80 hover:text-white underline"
              >
                View on Explorer
              </a>
            </div>
          )}
          <WalletMultiButton />
          <button
            className="text-3xl font-bold px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => setCreateDialogOpen(true)}
          >
            +
          </button>
        </div>
      </div>

      {/* Elections */}
      {elections.map((election) => (
        <ElectionCard
          key={election.id}
          id={election.id}
          title={election.title}
          description={election.description}
          result={election.results}
          transactionSignatures={election.transactionSignatures || []}
          handleVoteClick={handleVoteClick}
        />
      ))}

      {/* Vote Dialog */}
      <Dialog open={voteDialogOpen} onOpenChange={setVoteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Your Vote</DialogTitle></DialogHeader>
          {selectedParty && (
            <div className="text-center">
              <p className="mb-4">Vote for <b>{selectedParty.name}</b>?</p>
              <Button className="mr-2" onClick={handleVoteConfirm}>Yes, Vote</Button>
              <Button variant="secondary" onClick={() => setVoteDialogOpen(false)}>Cancel</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Election Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Election</DialogTitle></DialogHeader>

          <div className="flex flex-col gap-4">
            <input className="border p-2 rounded" placeholder="Election Title"
              value={newElectionTitle} onChange={(e) => setNewElectionTitle(e.target.value)} />

            <textarea className="border p-2 rounded" placeholder="Description"
              value={newElectionDesc} onChange={(e) => setNewElectionDesc(e.target.value)} />

            <div>
              <div className="flex gap-2">
                <input className="border p-2 flex-1 rounded" placeholder="Candidate name"
                  value={newCandidateInput} onChange={(e) => setNewCandidateInput(e.target.value)} />
                <Button onClick={() => {
                  if (newCandidateInput.trim()) {
                    setNewElectionCandidates((prev) => [...prev, newCandidateInput.trim()]);
                    setNewCandidateInput("");
                  }
                }}>Add</Button>
              </div>

              <div className="flex gap-2 flex-wrap mt-2">
                {newElectionCandidates.map((c, i) => (
                  <span key={i} className="bg-blue-200 px-2 py-1 rounded-full">{c}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={handleCreateElection}>Create</Button>
              <Button variant="secondary" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
