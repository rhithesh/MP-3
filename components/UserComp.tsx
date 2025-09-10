'use client'

import { useAuth } from '@/hooks/useAuth'

export default function UserProfile() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl text-white font-bold">
            {user.displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {user.displayName}
        </h2>
        
        <p className="text-gray-600 mb-6">
          @{user.username}
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <p className="text-green-800 text-sm">
            ✅ Authenticated with Touch ID
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
