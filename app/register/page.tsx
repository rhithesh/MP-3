'use client'

import { useState } from 'react'
import { startRegistration } from '@simplewebauthn/browser';
import { startAuthentication } from '@simplewebauthn/browser';
export default function RegisterPage() {
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
    <div className=' my-20'>
      <h1 >Register</h1>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={()=>{
        handleLogin()

      }}>Login</button>
      <p>{status}</p>
    </div>
  )
}
