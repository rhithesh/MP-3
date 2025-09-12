import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { cookies } from 'next/headers'
import { getUserById, updateUserCounter } from '@/lib/db'

import { getUserbyEmail } from '@/lib/db'

const CLIENT_URL = 'http://localhost:3000'
const RP_ID = 'localhost'

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const authInfoRaw = cookieStore.get('authInfo');
  console.log(authInfoRaw)

  if (!authInfoRaw) {
    return new Response(JSON.stringify({ error: 'Authentication info not found' }), { status: 400 });
  }

  const authInfo = JSON.parse(authInfoRaw.value);
  const body = await req.json();
  console.log(authInfo.userId)

  const user = await getUserById(authInfo.userId);
  console.log(user.passKey.id,body.id)
  // if (!user || user.passKey.id !== body.id) {
  //   return new Response(JSON.stringify({ error: 'Invalid user' }), { status: 400 });
  // }

  const verification = await verifyAuthenticationResponse({
    response: body,
    expectedChallenge: authInfo.challenge,
    expectedOrigin: CLIENT_URL,
    expectedRPID: RP_ID,
    credential: {
       id: user?.passKey.id,
      publicKey: user?.passKey.publicKey,
      counter: user?.passKey.counter,
      transports: user?.passKey.transports,
    },
  });

  console.log(verification)

  if (verification.verified) {
    await updateUserCounter(user.id, verification.authenticationInfo.newCounter);
    cookieStore.delete('authInfo');
    return Response.json({ verified: true ,user:user});
  }

  return new Response(JSON.stringify({ verified: false, error: 'Verification failed' }), { status: 400 });
}
