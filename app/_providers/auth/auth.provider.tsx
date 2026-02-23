"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { authClient } from "@/lib/auth-client";
import { UserSignUp, UserLogin, User } from "@/types/user";
import { signUpSchema } from "@/schemas/sign-up";
import { StatusCodes } from "http-status-codes";
import { successResponse, errorResponse } from "@/lib/api.response";
import { type ApiResponse } from "@/lib/api.response";
import { toast } from "sonner";
import { config } from "@/lib/config";

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
  signOut: () => Promise<ApiResponse<AuthResponse | null | undefined>>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      return errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };

  const handleSignOut = async (): Promise<
    ApiResponse<AuthResponse | null | undefined>
  > => {
    try {
      const { data, error } = await authClient.signOut();

      if (error) {
        return errorResponse(undefined, error.message, StatusCodes.BAD_REQUEST);
      }

      setUser(null);

      return successResponse(
        undefined,
        "Signed out successfully",
        StatusCodes.OK,
      );
    } catch (err) {
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
