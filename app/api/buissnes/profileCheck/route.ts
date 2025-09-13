import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { credentialId } = await request.json();

    if (!credentialId) {
      return NextResponse.json({ error: 'Missing credentialId' }, { status: 400 });
    }

    const user = await prisma.passkey.findFirst({
      where: { credentialId },
    });

    if (user) {
      return NextResponse.json({ exists: true, user });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error('Error during profile check:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
