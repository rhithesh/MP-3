'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import RegisterForm from './RegisterationForm'
import LoginForm from './LoginForm'
import UserProfile from './UserComp'

export default function AuthPage() {
  const { user, loading } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <UserProfile />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Touch ID Authentication
        </h1>
        <p className="text-gray-600">
          Secure biometric authentication with Next.js
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setMode('login')}
            className={`px-6 py-2 rounded-md transition-colors ${
              mode === 'login'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`px-6 py-2 rounded-md transition-colors ${
              mode === 'register'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {mode === 'login' ? <LoginForm /> : <RegisterForm />}

      <div className="max-w-md mx-auto mt-8 text-center text-sm text-gray-500">
        <p>
          This demo uses WebAuthn API with platform authenticators like Touch ID and Face ID
        </p>
      </div>
    </div>
  )
}
