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

    // Find transfer instruction
    const transferInstruction = tx.transaction.message.instructions.find(
      (ix: any) => ix.program === "system" && ix.parsed?.type === "transfer"
    );

    if (!transferInstruction)
      return NextResponse.json({ error: "Not a SOL transfer" }, { status: 400 });

    const { info } = transferInstruction.parsed;

    // ✅ Verify transfer receiver and amount
    if (info.destination !== RECEIVER.toBase58())
      return NextResponse.json({ error: "Incorrect receiver" }, { status: 400 });

    if (Number(info.lamports) !== EXPECTED_LAMPORTS)
      return NextResponse.json({ error: "Invalid transfer amount" }, { status: 400 });

    // ✅ Parse vote data from memo instruction (on-chain data)
    const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
    let onChainVoteData;
    
    // Try to find memo instruction in parsed transaction
    const memoInstruction = tx.transaction.message.instructions.find(
      (ix: any) => {
        const programId = ix.programId?.toBase58?.() || ix.program;
        return programId === MEMO_PROGRAM_ID || programId === "spl-memo";
      }
    );

    if (memoInstruction) {
      try {
        // Memo data can be in different formats depending on parsing
        let memoString: string;
        
        if (memoInstruction.parsed) {
          // Parsed format: data is directly available
          memoString = memoInstruction.parsed;
        } else if (memoInstruction.data) {
          // Raw format: data is base64 encoded
          const dataBuffer = Buffer.from(memoInstruction.data, 'base64');
          memoString = dataBuffer.toString('utf-8');
        } else {
          // Try to get from inner instructions or other fields
          const rawData = (memoInstruction as any).data || (memoInstruction as any).parsed;
          if (typeof rawData === 'string') {
            memoString = rawData;
          } else if (Buffer.isBuffer(rawData)) {
            memoString = rawData.toString('utf-8');
          } else {
            throw new Error("Cannot extract memo data");
          }
        }
        
        onChainVoteData = JSON.parse(memoString);
      } catch (parseError) {
        console.error("Failed to parse memo from parsed transaction:", parseError);
      }
    }

    // Fallback: Try to get raw transaction and parse memo manually
    if (!onChainVoteData) {
      try {
        const rawTx = await connection.getTransaction(signature, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });

        if (rawTx && rawTx.transaction) {
          const memoProgramId = new PublicKey(MEMO_PROGRAM_ID);
          
          for (const instruction of rawTx.transaction.message.instructions) {
            if ('programId' in instruction) {
              const programId = instruction.programId;
              if (programId.equals(memoProgramId)) {
                // Memo instruction data is the memo string directly
                if ('data' in instruction) {
                  const memoData = instruction.data as Buffer;
                  const memoString = memoData.toString('utf-8');
                  onChainVoteData = JSON.parse(memoString);
                  break;
                }
              }
            }
          }
        }
      } catch (rawParseError) {
        console.error("Failed to parse memo from raw transaction:", rawParseError);
      }
    }

    if (!onChainVoteData) {
      return NextResponse.json({ 
        error: "Vote data not found in transaction memo",
        hint: "Make sure the transaction includes a memo instruction with vote data"
      }, { status: 400 });
    }

    // ✅ Verify vote data from on-chain memo matches request
    if (onChainVoteData.electionId !== electionId)
      return NextResponse.json({ error: "Election ID mismatch" }, { status: 400 });

    if (onChainVoteData.userId !== userId)
      return NextResponse.json({ error: "User ID mismatch" }, { status: 400 });

    if (onChainVoteData.candidate !== candidate)
      return NextResponse.json({ error: "Candidate mismatch" }, { status: 400 });

    // Use on-chain data as source of truth
    const verifiedElectionId = onChainVoteData.electionId;
    const verifiedUserId = onChainVoteData.userId;
    const verifiedCandidate = onChainVoteData.candidate;

    // ✅ Verify election exists
    const election = await prisma.election.findUnique({ where: { id: verifiedElectionId } });
    if (!election)
      return NextResponse.json({ error: "Election not found" }, { status: 404 });

    // ✅ Prevent double-voting
    if ((election.voters ?? []).includes(verifiedUserId))
      return NextResponse.json({ error: "Already voted" }, { status: 400 });
    

    if (election.transactionSignatures.includes(signature))
      return NextResponse.json({ error: "Duplicate signature" }, { status: 400 });

    const currentResults = election.results as Record<string, number>;
    if (!(verifiedCandidate in currentResults))
      return NextResponse.json({ error: "Invalid candidate" }, { status: 400 });

    currentResults[verifiedCandidate]++;

    const updatedElection = await prisma.election.update({
      where: { id: verifiedElectionId },
      data: {
        results: currentResults,
        voters: { push: verifiedUserId },
        transactionSignatures: { push: signature },
      },
    });

    return NextResponse.json({ 
      election: updatedElection,
      onChainVoteData: onChainVoteData // Return the on-chain data for verification
    }, { status: 200 });
  } catch (err) {
    console.error("Vote error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
