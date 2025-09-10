import { generateRegistrationOptions } from '@simplewebauthn/server'
import { cookies } from 'next/headers'
// import { getUserByEmail } from '@/lib/db'

const RP_ID="localhost"
const RP_ORIGIN="http://localhost:3000"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 })
  }

  // if (getUserByEmail(email)) {
  //   return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 })
  // }

  const options = await generateRegistrationOptions({
    rpID: RP_ID,
    rpName: 'Web Dev Simplified',
    userName: email,

  })

  const cookieStore = await cookies()
    cookieStore.set('regInfo', JSON.stringify({
    userId: options.user.id,
    email,
    challenge: options.challenge,
  }), {
    httpOnly: true,
    maxAge: 60,
    secure: process.env.NODE_ENV === 'production',
  })

  return Response.json(options)
}
