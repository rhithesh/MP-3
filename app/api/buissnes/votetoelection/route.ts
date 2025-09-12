import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { electionId, userId, candidate, verified } = await request.json();

    if (!verified || !userId) {
      return NextResponse.json({ error: 'User not verified' }, { status: 403 });
    }

    if (!electionId || !candidate) {
      return NextResponse.json({ error: 'Missing electionId or candidate' }, { status: 400 });
    }

    const election = await prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 });
    }

    // Check if user already voted
    if (election.voters.includes(userId)) {
      return NextResponse.json({ error: 'User has already voted in this election' }, { status: 400 });
    }

    // Increment candidate vote count
    const currentResults = election.results as Record<string, number>;

    if (!(candidate in currentResults)) {
      return NextResponse.json({ error: 'Candidate not found in election' }, { status: 400 });
    }

    currentResults[candidate] += 1;

    // Update election with new vote and add user to voters
    const updatedElection = await prisma.election.update({
      where: { id: electionId },
      data: {
        results: currentResults,
        voters: {
          push: userId,
        },
      },
    });

    return NextResponse.json({ election: updatedElection }, { status: 200 });
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
