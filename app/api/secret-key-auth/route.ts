import { getUserbyEmail } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, secretKey } = body

  if (!email || !secretKey) {
    return new Response(JSON.stringify({ error: 'Email and secret key are required' }), { status: 400 })
  }

  const user = await getUserbyEmail(email)

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
  }

  if (!user.secretKey) {
    return new Response(JSON.stringify({ error: 'Secret key not set for this user' }), { status: 400 })
  }

  if (user.secretKey !== secretKey) {
    return new Response(JSON.stringify({ error: 'Invalid secret key' }), { status: 401 })
  }

  return Response.json({ 
    verified: true,
    user: {
      id: user.userId,
      passKey: {
        id: user.id,
        credentialId: user.credentialId,
        publicKey: user.publicKey,
        counter: user.counter,
        transports: user.transports,
      }
    }
  })
}

