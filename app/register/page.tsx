"use client";
import React, { useState } from "react";

export default function TouchAuth() {
  const [message, setMessage] = useState("");

  // Register new credential (sign up)
  const register = async () => {
    try {
      // Normally: fetch challenge/options from your server
      const options = {
        publicKey: {
          challenge: new Uint8Array(32), // replace with server challenge
          rp: { name: "My App" },
          user: {
            id: new TextEncoder().encode("user-id-123"),
            name: "user@example.com",
            displayName: "Test User",
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256
          authenticatorSelection: {
            authenticatorAttachment: "platform", // ensures Touch ID / Face ID
            userVerification: "required",
          },
          timeout: 60000,
        },
      };

      const credential = await navigator.credentials.create(options);
      console.log("New Credential:", credential);
      setMessage("✅ Registered with Touch ID!");
      // send credential to server for storage
    } catch (err) {
      console.error(err);
      setMessage("❌ Registration failed");
    }
  };

  // Authenticate (sign in)
  const login = async () => {
    try {
      // Normally: fetch challenge/options from your server
      const options = {
        publicKey: {
          challenge: new Uint8Array(32), // replace with server challenge
          allowCredentials: [], // you’d add registered credential IDs
          timeout: 60000,
          userVerification: "required",
        },
      };

      const assertion = await navigator.credentials.get(options);
      console.log("Assertion:", assertion);
      setMessage("✅ Authenticated with Touch ID!");
      // send assertion to server for verification
    } catch (err) {
      console.error(err);
      setMessage("❌ Authentication failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-xl font-bold">Touch ID Auth Demo</h2>
      <button
        onClick={register}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Register with Touch ID
      </button>
      <button
        onClick={login}
        className="px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Login with Touch ID
      </button>
      <p>{message}</p>
    </div>
  );
}
