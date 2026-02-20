import { authClient } from "@/lib/auth-client";
import { UserSignUp } from "@/types/user";
import { success, error as errorResponse } from "@/lib/api.response";
import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

import { signUpSchema } from "@/schemas/sign-up";

export async function POST(request: NextRequest) {
  const body: UserSignUp = await request.json();
  const parsedBody = signUpSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      errorResponse(
        undefined,
        parsedBody.error.message,
        StatusCodes.BAD_REQUEST,
      ),
    );
  }

  try {
    const { data, error } = await authClient.signUp.email({
      email: parsedBody.data.email,
      password: parsedBody.data.password,
      name: parsedBody.data.name,
    });

    if (error) {
      return NextResponse.json(
        errorResponse(undefined, error.message, StatusCodes.BAD_REQUEST),
      );
    }

    return NextResponse.json(
      success(data, "User created successfully", StatusCodes.CREATED),
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
