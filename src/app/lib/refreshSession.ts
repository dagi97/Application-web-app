import { signIn, signOut, useSession } from "next-auth/react";

export async function refreshSession() {
  // This will force a session update by calling signIn with redirect: false
  // and the current provider ("credentials" in this case)
  // You may want to call this after a profile update to refresh the session data
  await signIn("credentials", { redirect: false });
}
