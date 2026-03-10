"use client"

import { authClient } from "../auth-client";
import { clientDevice } from "../client-device";

export async function getPasskeys() {
  const { data, error } = await authClient.passkey.listUserPasskeys();

  if (error) {
    console.error("Error fetching passkeys:", error);
    throw new Error("Failed to fetch passkeys");
  }

  return data;
}

export async function createPasskey() {
  const { data, error } = await authClient.passkey.addPasskey({
    name: clientDevice.name()
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
