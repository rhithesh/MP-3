'use client'

import { useState } from 'react'
import { startAuthentication } from '@simplewebauthn/browser'
import { base64URLStringToBuffer } from '@simplewebauthn/browser';


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleLogin = async () => {
    setStatus('Initializing authentication...')
    const res = await fetch(`/api/init-auth?email=${email}`, {
      credentials: 'include',
    })

    const options = await res.json()

    console.log(options)
   // navigator.credentials.get("localhost")



    const authResp = await startAuthentication( options );

    console.log(authResp)

    const verificationRes = await fetch('/api/verify-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(authResp),
    })

    const verification = await verificationRes.json()

    if (verification.verified) {
      setStatus('Login successful!')
    } else {
      setStatus('Login failed.')
    }
  }

  return (
    <div className=' mt-20'>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>{status}</p>
    </div>
  )
}
