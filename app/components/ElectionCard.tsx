"use client";

import localFont from "next/font/local";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const dangerFont = localFont({
  src: "../../fonts/Danger.ttf",
  display: "swap",
});

interface ElectionCardProps {
  id: string;
  title: string;
  description: string;
  result: Record<string, number>;
  transactionSignatures?: string[];
  handleVoteClick: (party: { name: string }, electionId: string) => void;
}

export default function ElectionCard({ id, title, description, result, transactionSignatures = [], handleVoteClick }: ElectionCardProps) {
  const totalVotes = transactionSignatures.length;

  return (
    <Card className="p-6 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl text-white my-6">

      <CardHeader className={`${dangerFont.className} text-center`}>
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="opacity-80">{description}</p>
        {totalVotes > 0 && (
          <p className="text-sm mt-2 opacity-70">
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''} recorded on Solana
          </p>
        )}
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 mt-6">
        {Object.keys(result).map((candidate) => (
          <div
            key={candidate}
            className="p-4 rounded-xl bg-white/20 hover:bg-white/30 transition cursor-pointer text-center"
            onClick={() => handleVoteClick({ name: candidate }, id)}
          >
            <h2 className="text-xl font-semibold">{candidate}</h2>
            <p className="text-lg">{result[candidate]} votes</p>
          </div>
        ))}
      </CardContent>

      {transactionSignatures.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <h3 className="text-sm font-semibold mb-2 opacity-80">View Votes on Solana (Devnet):</h3>
          <div className="flex flex-wrap gap-2">
            {transactionSignatures.slice(0, 5).map((sig, idx) => (
              <a
                key={idx}
                href={`https://solscan.io/tx/${sig}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-blue-500/30 hover:bg-blue-500/50 px-2 py-1 rounded transition"
              >
                Vote #{idx + 1}
              </a>
            ))}
            {transactionSignatures.length > 5 && (
              <span className="text-xs opacity-60">
                +{transactionSignatures.length - 5} more
              </span>
            )}
            <a
              href={`https://explorer.solana.com/address/${id}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-purple-500/30 hover:bg-purple-500/50 px-2 py-1 rounded transition ml-auto"
            >
              View All on Explorer
            </a>
          </div>
        </div>
      )}
    </Card>
  );
}
