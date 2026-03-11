import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { authRequest } from "@/lib/auth";
import { serverErrorResponse } from "./lib/api.response";
import { StatusCodes } from "http-status-codes";

export async function proxy(request: NextRequest) {
  let destination;
  const isAuthenticated = await authRequest(request);

  if (request.nextUrl.pathname.startsWith("/api")) {
    if (isAuthenticated) return NextResponse.next();
    return serverErrorResponse(undefined, "Unauthorized", StatusCodes.UNAUTHORIZED);
  }

  if (request.nextUrl.pathname === "/") {
    if (isAuthenticated) {
      destination = new URL("/dashboard", request.url);
      return NextResponse.redirect(destination);
    }
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (isAuthenticated) return NextResponse.next();
    destination = new URL("/auth/sign-in", request.url);
    return NextResponse.redirect(destination);
  }

  if (request.nextUrl.pathname.startsWith("/user")) {
    if (isAuthenticated) return NextResponse.next();
    destination = new URL("/auth/sign-in", request.url);
    return NextResponse.redirect(destination);
  }
}

export const config = { matcher: ["/", "/dashboard/:path*", "/user:path*"] };
