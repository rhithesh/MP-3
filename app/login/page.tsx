'use client'

import { useState } from 'react'
import { startAuthentication } from '@simplewebauthn/browser'
import { base64URLStringToBuffer } from '@simplewebauthn/browser';


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [useSecretKey, setUseSecretKey] = useState(false)

  const handleLogin = async () => {
    if (useSecretKey) {
      // Secret key login
      if (!secretKey) {
        setStatus('Please enter your secret key')
        return
      }
      
      setStatus('Authenticating with secret key...')
      const res = await fetch('/api/secret-key-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, secretKey }),
      })

      const verification = await res.json()

      if (verification.verified) {
        localStorage.setItem("CryptoElectAuth", JSON.stringify(verification));
        setStatus('Login successful!')
      } else {
        setStatus(verification.error || 'Login failed.')
      }
    } else {
      // Fingerprint login
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
        localStorage.setItem("CryptoElectAuth", JSON.stringify(verification));
        setStatus('Login successful!')
      } else {
        setStatus('Login failed.')
      }
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
      
      <div className="mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useSecretKey}
            onChange={(e) => setUseSecretKey(e.target.checked)}
            className="mr-2"
          />
          <span>Use Secret Key instead of Fingerprint</span>
        </label>
      </div>

      {useSecretKey && (
        <input
          type="text"
          placeholder="Enter your secret key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          className="mt-2"
        />
      )}

      <button onClick={handleLogin}>
        {useSecretKey ? 'Login with Secret Key' : 'Login with Fingerprint'}
      </button>
      <p>{status}</p>
    </div>
  )
}
