import { AuthenticatorTransportFuture, generateAuthenticationOptions } from '@simplewebauthn/server'
import { cookies } from 'next/headers'

import { getUserbyEmail } from '@/lib/db'
const RP_ID="localhost"
const RP_ORIGIN="http://localhost:3000"
import base64url from 'base64url';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 })
  }
   console.log(email,"test")
  const user = await getUserbyEmail(email)
  console.log(user)
  

  if (!user) {
    return new Response(JSON.stringify({ error: 'No user for this email' }), { status: 400 })
  }

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials: [
      {
        id: base64url(user.credentialId),
        transports: ['internal'] as unknown as AuthenticatorTransportFuture[] ,
      },
    ],
  })

//   options.allowCredentials = options.allowCredentials.map((cred) => ({
//   ...cred,
//   id:base64url(cred.id), // convert from Base64URL string to ArrayBuffer
// }));

  const cookieStore = await  cookies()
  cookieStore.set('authInfo', JSON.stringify({
    userId: user.id,
    challenge: options.challenge,
  }), {
    httpOnly: true,
    maxAge: 60,
    secure: process.env.NODE_ENV === 'production',
  })

  return Response.json(options)
}
