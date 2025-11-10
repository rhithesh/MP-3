import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { title, description, candidates, userId, verified } = await request.json();

    if (!verified || !userId) {
      return NextResponse.json({ error: 'User not verified' }, { status: 403 });
    }

    if (!title || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const results: Record<string, number> = {};
    candidates.forEach((candidate: string) => {
      results[candidate] = 0;
    });

    const election = await prisma.election.create({
      data: {
        title,
        description,
        results,
        voters: [],                 // ✅ FIXED
        transactionSignatures: [],  // ✅ FIXED
      },
    });

    return NextResponse.json({ election }, { status: 201 });

  } catch (error) {
    console.error('Error creating election:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
