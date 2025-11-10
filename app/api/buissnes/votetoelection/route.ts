import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from "@solana/web3.js";

const prisma = new PrismaClient();
const RECEIVER = new PublicKey("6GkgfKeGCixwH4dCnYJgP18o4LX9fRagJugZjLVgSA4X");
const EXPECTED_LAMPORTS = 0.2 * LAMPORTS_PER_SOL;

export async function POST(request: NextRequest) {
  try {
    const { electionId, userId, candidate, verified, signature } =
      await request.json();

    if (!verified || !userId)
      return NextResponse.json({ error: "User not verified" }, { status: 403 });

    if (!electionId || !candidate || !signature)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const connection = new Connection("https://api.devnet.solana.com");

    // ✅ Fetch Transaction with full parsing
    const tx = await connection.getParsedTransaction(signature, "confirmed");
    if (!tx)
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    const instruction = tx.transaction.message.instructions.find(
      (ix: any) => ix.program === "system"
    );

    if (!instruction)
      return NextResponse.json({ error: "Not a SOL transfer" }, { status: 400 });

    const { info } = instruction.parsed;

    // ✅ Verify transfer receiver and amount
    if (info.destination !== RECEIVER.toBase58())
      return NextResponse.json({ error: "Incorrect receiver" }, { status: 400 });

    if (Number(info.lamports) !== EXPECTED_LAMPORTS)
      return NextResponse.json({ error: "Invalid transfer amount" }, { status: 400 });

    // ✅ Verify election exists
    const election = await prisma.election.findUnique({ where: { id: electionId } });
    if (!election)
      return NextResponse.json({ error: "Election not found" }, { status: 404 });

    // ✅ Prevent double-voting
    if (election.voters.includes(userId))
      return NextResponse.json({ error: "Already voted" }, { status: 400 });

    if (election.transactionSignatures.includes(signature))
      return NextResponse.json({ error: "Duplicate signature" }, { status: 400 });

    const currentResults = election.results as Record<string, number>;
    if (!(candidate in currentResults))
      return NextResponse.json({ error: "Invalid candidate" }, { status: 400 });

    currentResults[candidate]++;

    const updatedElection = await prisma.election.update({
      where: { id: electionId },
      data: {
        results: currentResults,
        voters: { push: userId },
        transactionSignatures: { push: signature },
      },
    });

    return NextResponse.json({ election: updatedElection }, { status: 200 });
  } catch (err) {
    console.error("Vote error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
