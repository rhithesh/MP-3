import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'
import type {
  GenerateRegistrationOptionsOpts,
  GenerateAuthenticationOptionsOpts,
  VerifyRegistrationResponseOpts,
  VerifyAuthenticationResponseOpts,
} from '@simplewebauthn/server'

const rpID = process.env.RP_ID || 'localhost'
const rpName = process.env.RP_NAME || 'Touch ID Demo'
const origin = process.env.RP_ORIGIN || 'http://localhost:3000'

export const webAuthnConfig = {
  rpID,
  rpName,
  origin,
}

export {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
}

