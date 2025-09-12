'use client'

import { useState } from 'react'
import { startRegistration, startAuthentication } from '@simplewebauthn/browser'






export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  
  const handleLogin = async () => {
    setStatus('Initializing authentication...')
    const res = await fetch(`/api/init-auth?email=${email}`, {
      credentials: 'include',
    })

    const options = await res.json()

    const authResp = await startAuthentication(options)

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

  const handleRegister = async () => {
    setStatus('Initializing registration...')
    const res = await fetch(`/api/init-register?email=${email}`, {
      credentials: 'include',
    })
    const options = await res.json()

    const attResp = await startRegistration(options)

    const verificationRes = await fetch('/api/verify-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(attResp),
    })

    const verification = await verificationRes.json()

    if (verification.verified) {
      setStatus('Registration successful!')
    } else {
      setStatus('Registration failed.')
    }
  }

  return (
    <div
      className={`min-h-screen bg-cover bg-center flex items-center justify-center`}
      style={{
        backgroundImage: "url('/5.jpg')",
      }}
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/30">
        <h1 className={` text-3xl  text-white font-semibold mb-6 text-center`}>Register / Login</h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full font-serif px-4 py-3 rounded-lg bg-white/20 placeholder-white text-white mb-4 focus:outline-none"
        />

        <button
          onClick={handleRegister}
          className="w-full font-serif bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mb-3 transition"
        >
          Register
        </button>

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 font-serif hover:bg-green-600 text-white py-2 rounded-lg transition"
        >
          Login
        </button>

        <p className="mt-4 text-white text-center">{status}</p>
      </div>
    </div>
  )
}
