import { useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  displayName: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/user");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, displayName: string) => {
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error("WebAuthn is not supported in this browser");
      }

      // Check if platform authenticator is available
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        throw new Error("Touch ID/Face ID is not available on this device");
      }

      // Start registration
      const startResponse = await fetch("/api/auth/register/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, displayName }),
      });

      if (!startResponse.ok) {
        const error = await startResponse.json();
        throw new Error(error.error || "Failed to start registration");
      }

      const { options } = await startResponse.json();

      // NUCLEAR OPTION: Completely override options to force Touch ID
      const touchIdOptions = {
        challenge: options.challenge,
        rp: {
          name: "Touch ID Demo",
          id: "localhost",
        },
        user: {
          id: options.user.id,
          name: username,
          displayName: displayName,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -35, type: "public-key" },
          { alg: -36, type: "public-key" },
          { alg: -257, type: "public-key" },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "required",
          requireResidentKey: true,
        },
        timeout: 60000,
        attestation: "none",
      };

      console.log("FORCING Touch ID with options:", touchIdOptions);

      // Use native navigator.credentials.create directly (bypass library)
      const credential = await navigator.credentials.create({
        publicKey: touchIdOptions as any,
      });

      if (!credential) {
        throw new Error("No credential returned");
      }

      // Convert to format expected by server
      const registrationResponse = {
        id: credential.id,
        rawId: credential.id,
        response: {
          attestationObject: Array.from(
            new Uint8Array((credential as any).response.attestationObject)
          ),
          clientDataJSON: Array.from(
            new Uint8Array((credential as any).response.clientDataJSON)
          ),
        },
        type: credential.type,
      };

      console.log("Registration response:", registrationResponse);

      // Finish registration
      const finishResponse = await fetch("/api/auth/register/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationResponse),
      });

      if (!finishResponse.ok) {
        const error = await finishResponse.json();
        throw new Error(error.error || "Failed to complete registration");
      }

      const result = await finishResponse.json();
      setUser(result.user);
      return result;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const login = async (username: string) => {
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error("WebAuthn is not supported in this browser");
      }

      // Check if platform authenticator is available
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        throw new Error("Touch ID/Face ID is not available on this device");
      }

      // Start authentication
      const startResponse = await fetch("/api/auth/login/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!startResponse.ok) {
        const error = await startResponse.json();
        throw new Error(error.error || "Failed to start authentication");
      }

      const { options } = await startResponse.json();

      // NUCLEAR OPTION: Force Touch ID for login too
      const touchIdLoginOptions = {
        challenge: options.challenge,
        rpId: "localhost",
        allowCredentials:
          options.allowCredentials?.map((cred: any) => ({
            id: cred.id,
            type: "public-key",
            transports: ["internal"], // Force internal/platform transport
          })) || [],
        userVerification: "required",
        timeout: 60000,
      };

      console.log("FORCING Touch ID login with options:", touchIdLoginOptions);

      // Use native navigator.credentials.get directly
      const assertion = await navigator.credentials.get({
        publicKey: touchIdLoginOptions as any,
      });

      if (!assertion) {
        throw new Error("No assertion returned");
      }

      // Convert to format expected by server
      const authResponse = {
        id: assertion.id,
        rawId: assertion.id,
        response: {
          authenticatorData: Array.from(
            new Uint8Array((assertion as any).response.authenticatorData)
          ),
          clientDataJSON: Array.from(
            new Uint8Array((assertion as any).response.clientDataJSON)
          ),
          signature: Array.from(
            new Uint8Array((assertion as any).response.signature)
          ),
          userHandle: (assertion as any).response.userHandle
            ? Array.from(new Uint8Array((assertion as any).response.userHandle))
            : null,
        },
        type: assertion.type,
      };

      // Finish authentication
      const finishResponse = await fetch("/api/auth/login/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authResponse),
      });

      if (!finishResponse.ok) {
        const error = await finishResponse.json();
        throw new Error(error.error || "Failed to complete authentication");
      }

      const result = await finishResponse.json();
      setUser(result.user);
      return result;
    } catch (error) {
      console.error("Authentication failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user,
    loading,
    register,
    login,
    logout,
  };
}
