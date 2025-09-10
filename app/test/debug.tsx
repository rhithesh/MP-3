'use client'

import { useState } from 'react'

export default function DebugAuth() {
  const [debug, setDebug] = useState('')

  const checkSupport = async () => {
    let info = ''
    
    if (typeof window !== 'undefined' && window.PublicKeyCredential) {
      info += '✅ WebAuthn supported\n'
      
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        info += `Platform authenticator: ${available ? '✅' : '❌'}\n`
        
        const conditional = await PublicKeyCredential.isConditionalMediationAvailable?.()
        info += `Conditional UI: ${conditional ? '✅' : '❌'}\n`
        
        info += `User Agent: ${navigator.userAgent}\n`
        info += `Platform: ${navigator.platform}\n`
        
        // Check if Touch ID is likely available
        const isMac = /Mac/.test(navigator.platform)
        const isiOS = /iPhone|iPad/.test(navigator.userAgent)
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
        
        info += `Mac: ${isMac}, iOS: ${isiOS}, Safari: ${isSafari}\n`
        
      } catch (error) {
        info += `Error checking: ${error}\n`
      }
    } else {
      info += '❌ WebAuthn not supported\n'
    }
    
    setDebug(info)
  }

  return (
    <div className="max-w-md mx-auto mt-4 p-4 bg-gray-100 rounded">
      <button 
        onClick={checkSupport}
        className="bg-gray-600 text-white px-4 py-2 rounded mb-2"
      >
        Check Touch ID Support
      </button>
      {debug && (
        <pre className="text-xs whitespace-pre-wrap">{debug}</pre>
      )}
    </div>
  )
}