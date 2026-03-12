"use client"

import { UserLogin, UserSignUp } from "@/types/user";
import { authClient } from "../auth-client";
import { config } from "../config";

export async function getPasskeys() {
  const { data, error } = await authClient.passkey.listUserPasskeys();

  if (error) {
    console.error("Error fetching passkeys:", error);
    throw new Error(error.message);
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
    throw new Error(error.message);
  }

  return data;
}

export async function deletePasskey(passkeyId: string) {
  const { data, error } = await authClient.passkey.deletePasskey({
      id: passkeyId,
  });

  if (error) {
    console.error("Error deleting passkey:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getSessions() {
  const { data, error } = await authClient.listSessions()

  if (error) {
    console.error("Error fetching sessions:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteSession(tokenId: string) {
  const { data, error } = await authClient.revokeSession({
    token: tokenId,
  });

  if (error) {
    console.error("Error deleting session:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function signInWithEmail(credentials: UserLogin) {
  const { data, error } = await authClient.signIn.email({
    email: credentials.email,
    password: credentials.password,
    callbackURL: config.app.home
  });

  if (error) {
    console.error("Error signing in with email:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function signUpWithEmail(credentials: UserSignUp) {
  const { data, error } = await authClient.signUp.email({
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
    callbackURL: "/auth/sign-in"
  });

  if (error) {
    console.error("Error signing up with email:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function signOut() {
  const { data, error } = await authClient.signOut();

  if (error) {
    console.error("Error signing out:", error);
    throw new Error(error.message);
  }

  return data;
}
