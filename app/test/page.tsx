"use client";

import { useState } from "react";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

const SERVER_URL = "http://localhost:3000";

export default function PasskeyAuth() {
  const [email, setEmail] = useState("rhithesh1947@gmail.com");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function signup() {

    console.log("Hello")
    try {
      // 1. Get challenge from server
      const initResponse = await fetch(
        `${SERVER_URL}/api/auth/challenge?email=${encodeURIComponent(email)}`,
        { credentials: "include" }
      );
      const options = await initResponse.json();
      
      console.log("options is",options)

      // 2. Create passkey
      const registrationJSON = await startRegistration(options);
      // 3. Save passkey in DB
      const verifyResponse = await fetch(`${SERVER_URL}/api/auth/verify`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationJSON),
      });
      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        return showMessage(verifyData.error);
      }

      if (verifyData.verified) {
        showMessage(`Successfully registered ${email}`);
      } else {
        showMessage("Failed to register");
      }
    } catch (err) {
      console.error(err);
      showMessage("Something went wrong during signup");
    }
  }

  async function login() {
    try {
      // 1. Get challenge from server
      const initResponse = await fetch(
        `${SERVER_URL}/api/auth/challenge?email=${encodeURIComponent(email)}`,
        { credentials: "include" }
      );
      const options = await initResponse.json();
      if (!initResponse.ok) {
        return showMessage(options.error);
      }

      // 2. Get passkey
      const authJSON = await startAuthentication(options);

      // 3. Verify passkey with DB
      const verifyResponse = await fetch(`${SERVER_URL}/api/auth/verify-auth`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authJSON),
      });
      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        return showMessage(verifyData.error);
      }

      if (verifyData.verified) {
        showMessage(`Successfully logged in ${email}`);
      } else {
        showMessage("Failed to log in");
      }
    } catch (err) {
      console.error(err);
      showMessage("Something went wrong during login");
    }
  }

  function showMessage(text: string) {
    setMessage(text);
    setIsOpen(true);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2 w-64"
      />

      <div className="flex gap-3">
        <button
          onClick={signup}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign up
        </button>
        <button
          onClick={login}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Log in
        </button>
      </div>

      {isOpen && (
        <dialog open className="p-4 rounded-md shadow-lg border">
          <p>{message}</p>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </dialog>
      )}
    </div>
  );
}
