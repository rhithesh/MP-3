
import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

export async function savePasskey(newPasskey) {
  await prisma.passkey.create({
    data: {
      userId: newPasskey.user.userid,
      userinfo: newPasskey.user.userinfo,
      webAuthnUserID: newPasskey.webAuthnUserID,
      credentialId: newPasskey.id,
      publicKey: Buffer.from(newPasskey.publicKey), // Ensure it's Uint8Array or string
      counter: newPasskey.counter,
      transports: newPasskey.transports?.join(','), // Store as CSV string
      deviceType: newPasskey.deviceType,
      backedUp: newPasskey.backedUp,
    },
  });
}


export async function getUserbyEmail(email:string) {
    return await prisma.passkey.findUnique({
    where: {
      userinfo: email,
    },
  });

  
}


export async function getUserById(userId: string) {
  // Assuming one Passkey per userId
  const passkey = await prisma.passkey.findFirst({
    where: { id: userId }, // Look up by userId (foreign key)
  });

  if (!passkey) {
    return null;
  }

  return {
    id: userId,
    passKey: {
      id: passkey.id,
      credentialId: passkey.credentialId,
      publicKey: passkey.publicKey,
      counter: passkey.counter,
      transports: passkey.transports,
    },
  };
}



export async function updateUserCounter(userId: string, newCounter: number) {
  // Update the counter field for the Passkey associated with the userId
  const updatedPasskey = await prisma.passkey.updateMany({
    where: { userId },
    data: {
      counter: newCounter,
    },
  });

  return updatedPasskey;
}
