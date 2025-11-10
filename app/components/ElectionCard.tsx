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
  handleVoteClick: (party: { name: string }, electionId: string) => void;
}

export default function ElectionCard({ id, title, description, result, handleVoteClick }: ElectionCardProps) {
  return (
    <Card className="p-6 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl text-white my-6">

      <CardHeader className={`${dangerFont.className} text-center`}>
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="opacity-80">{description}</p>
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
    </Card>
  );
}
