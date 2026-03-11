"use client"

import { authClient } from "../auth-client";

export async function getPasskeys() {
  const { data, error } = await authClient.passkey.listUserPasskeys();

  if (error) {
    console.error("Error fetching passkeys:", error);
    throw new Error("Failed to fetch passkeys");
  }

  return data;
}

export async function createPasskey() {
  const { data: session } = await authClient.getSession();

  const { data, error } = await authClient.passkey.addPasskey({
    name: session?.user.email
  });

  if (error) {
    console.error("Error creating passkey:", error);
    throw new Error("Failed to create passkey");
  }

  return data;
}

export async function deletePasskey(passkeyId: string) {
  const { data, error } = await authClient.passkey.deletePasskey({
      id: passkeyId,
  });

  if (error) {
    console.error("Error deleting passkey:", error);
    throw new Error("Failed to delete passkey");
  }

  return data;
}

export async function getSessions() {
  const { data, error } = await authClient.listSessions()

  if (error) {
    console.error("Error fetching sessions:", error);
    throw new Error("Failed to fetch sessions")
  }

  return data;
}

export async function deleteSession(tokenId: string) {
  const { data, error } = await authClient.revokeSession({
    token: tokenId,
  });

  if (error) {
    console.error("Error deleting session:", error);
    throw new Error("Failed to delete session");
  }

  return data;
}
