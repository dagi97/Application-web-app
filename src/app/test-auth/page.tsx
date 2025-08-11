"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting sign in with:", { email, password });
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      console.log("Sign in result:", result);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Session Status:</h2>
        <p>Status: {status}</p>
        <p>Authenticated: {session ? "Yes" : "No"}</p>
        {session && (
          <div className="mt-2">
            <p>Email: {session.user?.email}</p>
            <p>Role: {(session as any)?.user?.role}</p>
            <p>Access Token: {(session as any)?.access ? "Present" : "Missing"}</p>
          </div>
        )}
      </div>

      {!session ? (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
      ) : (
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      )}

      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p>Check the browser console for detailed logs</p>
        <p>Session data: {JSON.stringify(session, null, 2)}</p>
      </div>
    </div>
  );
}
