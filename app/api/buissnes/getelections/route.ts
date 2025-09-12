import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const elections = await prisma.election.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ elections });
  } catch (error) {
    console.error('Error fetching elections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
