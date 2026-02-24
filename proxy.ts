import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authRequest } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  let destination;
  const isAuthenticated = await authRequest(request);

  if (request.nextUrl.pathname === "/") {
    if (isAuthenticated) {
      destination = new URL("/dashboard", request.url);
      return NextResponse.redirect(destination);
    }
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (isAuthenticated) return NextResponse.next();
    destination = new URL("/auth/sign-in", request.url);
  }
}

export const config = { matcher: ["/", "/dashboard/:path*"] };
