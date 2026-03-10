"use client";

import { StatusCodes } from "http-status-codes";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import { errorResponse, successResponse } from "@/lib/api.response";
import { type ApiResponse } from "@/lib/api.response";
import { authClient } from "@/lib/auth-client";
import { config } from "@/lib/config";
import { signUpSchema } from "@/schemas/sign-up";
import { User, UserLogin, UserSignUp } from "@/types/user";
import { useRouter } from "next/navigation";
import { Passkey } from "@better-auth/passkey/client";

interface AuthResponse {
  token?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  signUp: (
    data: UserSignUp,
  ) => Promise<ApiResponse<AuthResponse | null | undefined>>;
  signIn: (
    data: UserLogin,
  ) => Promise<ApiResponse<AuthResponse | null | undefined>>;
  socialSignIn: (provider: "google") => void;
  passkeySignIn: () => Promise<ApiResponse<undefined>>;
  registerPasskey: () => Promise<ApiResponse<undefined>>;
  fetchPasskeys: () => Promise<ApiResponse<Passkey[] | undefined>>;
  deletePasskey: (passkeyId: string) => Promise<ApiResponse<undefined>>;
  signOut: () => Promise<ApiResponse<AuthResponse | null | undefined>>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) setUser(data.user);
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  /* ------------------ Plain Email ------------------ */

  const handleSignUp = async (
    userData: UserSignUp,
  ): Promise<ApiResponse<AuthResponse | null | undefined>> => {
    const parsedBody = signUpSchema.safeParse(userData);

    if (!parsedBody.success) {
      return errorResponse(
        undefined,
        parsedBody.error.message,
        StatusCodes.BAD_REQUEST,
      );
    }

    try {
      const { data, error } = await authClient.signUp.email({
        email: parsedBody.data.email,
        password: parsedBody.data.password,
        name: parsedBody.data.name,
        callbackURL: config.app.home,
      });

      if (error) {
        toast.error(error.message);
        return errorResponse(undefined, error.message, StatusCodes.BAD_REQUEST);
      }

      if (data?.user) {
        setUser(data.user);
      }

      toast.success("User created successfully");
      return successResponse(
        { user: data?.user, token: data?.token || undefined },
        "User created successfully",
        StatusCodes.CREATED,
      ) as ApiResponse<AuthResponse>;
    } catch (err) {
      if (err instanceof Error) console.error("Sign-up failed:", err.message);
      toast.error("Something went wrong");
      return errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };

  const handleSignIn = async (
    credentials: UserLogin,
  ): Promise<ApiResponse<AuthResponse | null | undefined>> => {
    try {
      const { data, error } = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
        callbackURL: config.app.home,
      });

      if (error) {
        return errorResponse(
          undefined,
          error.message,
          StatusCodes.UNAUTHORIZED,
        );
      }

      if (data?.user) {
        setUser(data.user);
      }

      return successResponse(
        { user: data?.user, token: data?.token || undefined },
        "Signed in successfully",
        StatusCodes.OK,
      ) as ApiResponse<AuthResponse>;
    } catch (err) {
      console.error("Sign-in failed:", err);
      return errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /* ------------------ Social ------------------ */

  const handleSocialSignIn = (provider: "google") => {
    authClient.signIn.social({
      provider: provider,
      callbackURL: config.app.home,
      newUserCallbackURL: config.app.home,
    })
  }

  /* ------------------ Passkey ------------------ */

  const handleRegisterPasskey = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.passkey.addPasskey();

      if (error) {
        return errorResponse(
          undefined,
          error.message,
          StatusCodes.UNAUTHORIZED,
        );
      }

      toast.success("Passkey registered successfully");

      return successResponse(
        undefined,
        "Passkey registered successfully",
        StatusCodes.OK,
      ) as ApiResponse<undefined>;
    } catch (err) {
      console.error("Passkey registration failed:", err);
      return errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handlePasskeySignIn = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.signIn.passkey({
        autoFill: true,
        fetchOptions: {
          onSuccess: () => {
            window.location.href = config.app.home;
          },
          onError: (err) => {
            console.error("Passkey sign-in error:", err);
          }
        }
      });

      if (error) {
        return errorResponse(
          undefined,
          error.message,
          StatusCodes.UNAUTHORIZED,
        );
      }

      return successResponse(
        undefined,
        "Signed in with passkey successfully",
        StatusCodes.OK,
      ) as ApiResponse<undefined>;
    } catch (err) {
      console.error("Passkey sign-in failed:", err);
      return errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleFetchPasskeys = async ()=> {
    try {
      const { data: passkeys, error } = await authClient.passkey.listUserPasskeys();

      if (error) {
        return errorResponse(
          undefined,
          error.message,
          StatusCodes.UNAUTHORIZED,
        );
      }

      return successResponse(
        passkeys || null,
        "Passkeys fetched successfully",
        StatusCodes.OK,
      ) as ApiResponse<Passkey[] | undefined>;
    } catch (err) {
      console.error("Fetching passkeys failed:", err);
      return errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  const handleDeletePasskey = async (passkeyId: string) => {
    try {
      const { data, error } = await authClient.passkey.deletePasskey({
          id: passkeyId,
      });

      if (error) {
        return errorResponse(
          undefined,
          error.message,
          StatusCodes.UNAUTHORIZED,
        );
      }

      return successResponse(
        undefined,
        "Passkeys removed successfully",
        StatusCodes.OK,
      ) as ApiResponse<undefined>;
    } catch (err) {
      console.error("Deleting passkey failed:", err);
      return errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* ------------------ Shared ------------------ */

  const handleSignOut = async (): Promise<
    ApiResponse<AuthResponse | null | undefined>
  > => {
    try {
      const { data, error } = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(config.app.home);
          },
        }
      });

      if (error) {
        return errorResponse(undefined, error.message, StatusCodes.BAD_REQUEST);
      }

      setUser(null);
      toast.info("Signed out successfully");

      return successResponse(
        undefined,
        "Signed out successfully",
        StatusCodes.OK,
      );
    } catch (err) {
      console.error("Sign-out failed:", err);
      toast.error("Something went wrong during sign-out");
      return errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        socialSignIn: handleSocialSignIn,
        passkeySignIn: handlePasskeySignIn,
        registerPasskey: handleRegisterPasskey,
        fetchPasskeys: handleFetchPasskeys,
        deletePasskey: handleDeletePasskey,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
