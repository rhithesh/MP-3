'use client'

import { useState } from 'react'
import { startRegistration, startAuthentication } from '@simplewebauthn/browser'






export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [loginSecretKey, setLoginSecretKey] = useState('')
  const [useSecretKeyLogin, setUseSecretKeyLogin] = useState(false)

  
  const handleLogin = async () => {
    if (useSecretKeyLogin) {
      // Secret key login
      if (!loginSecretKey) {
        setStatus('Please enter your secret key')
        return
      }
      
      setStatus('Authenticating with secret key...')
      const res = await fetch('/api/secret-key-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, secretKey: loginSecretKey }),
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

      const authResp = await startAuthentication(options)

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
      if (verification.secretKey) {
        setSecretKey(verification.secretKey)
        setStatus('Registration successful! Your secret key is shown below ⬇️')
      } else {
        setStatus('Registration successful!')
      }
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

        <div className="mb-3">
          <label className="flex items-center text-white text-sm">
            <input
              type="checkbox"
              checked={useSecretKeyLogin}
              onChange={(e) => setUseSecretKeyLogin(e.target.checked)}
              className="mr-2"
            />
            <span>Use Secret Key instead of Fingerprint</span>
          </label>
        </div>

        {useSecretKeyLogin && (
          <input
            type="text"
            placeholder="Enter your secret key"
            value={loginSecretKey}
            onChange={(e) => setLoginSecretKey(e.target.value)}
            className="w-full font-serif px-4 py-3 rounded-lg bg-white/20 placeholder-white text-white mb-3 focus:outline-none"
          />
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 font-serif hover:bg-green-600 text-white py-2 rounded-lg transition"
        >
          {useSecretKeyLogin ? 'Login with Secret Key' : 'Login with Fingerprint'}
        </button>

        <p className="mt-4 text-white text-center">{status}</p>

        {secretKey && (
          <div className="mt-4 p-5 bg-yellow-500/30 border-2 border-yellow-400 rounded-lg shadow-lg">
            <p className="text-yellow-100 font-bold text-lg mb-3 text-center">🔑 Your Secret Key</p>
            <p className="text-white text-sm mb-3 text-center">Save this key! You can use it to login instead of fingerprint:</p>
            <div className="bg-black/50 p-4 rounded border border-yellow-400/50 mb-3">
              <div className="flex items-center justify-between gap-2">
                <code className="break-all font-mono text-yellow-200 text-sm flex-1">
                  {secretKey}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(secretKey)
                    setStatus('Secret key copied to clipboard!')
                    setTimeout(() => setStatus('Registration successful!'), 2000)
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm font-semibold whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>
            <p className="text-yellow-100 text-xs text-center font-semibold">⚠️ IMPORTANT: Save this key in a safe place! You won't be able to see it again.</p>
          </div>
        )}
      </div>
    </div>
  )
}
