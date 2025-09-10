import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { cookies } from 'next/headers'
import { CredentialDeviceType } from '@simplewebauthn/browser'
import { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import { savePasskey } from '@/lib/db'

const RP_ID="localhost"
const CLIENT_URL="http://localhost:3000"

interface NewPasskey {
  user: {
    userid: string;
    userinfo: string;
  };
//   webAuthnUserID: string;
  id: string;
  webAuthnUserID:string;
  publicKey: string | Uint8Array;
  counter: number;
  transports?: (AuthenticatorTransportFuture | "cable")[];
  deviceType: CredentialDeviceType;
  backedUp: boolean;
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const regInfoRaw =  cookieStore.get('regInfo')

  if (!regInfoRaw) {
    return new Response(JSON.stringify({ error: 'Registration info not found' }), { status: 400 })
  }

  const regInfo = JSON.parse(regInfoRaw.value)
  const body = await req.json()

  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: regInfo.challenge,
    expectedOrigin: CLIENT_URL,
    expectedRPID: RP_ID,
  })



    const { registrationInfo } = verification;
if (registrationInfo) {
  const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo;
  // Now you can use credential, credentialDeviceType, credentialBackedUp safely here

const newPasskey: NewPasskey = {
  user: {
    userid: regInfo.userId,
    userinfo: regInfo.email,
  },
  webAuthnUserID:regInfo.userId,
  id: credential.id,
  publicKey: credential.publicKey,
  counter: credential.counter,
  transports: credential.transports,
  deviceType: credentialDeviceType,
  backedUp: credentialBackedUp,
};
console.log(newPasskey)
const ans=await savePasskey(newPasskey)


console.log(ans)
    return Response.json({ verified: true })

}



    cookieStore.delete('regInfo')
  }

//   return new Response(JSON.stringify({ verified: false, error: 'Verification failed' }), { status: 400 })

