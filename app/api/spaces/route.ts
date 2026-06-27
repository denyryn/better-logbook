import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

import { Space } from "@/generated/prisma/client";
import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { spaceWithPositionsQuery } from "@/types/prisma/space";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    const spaces = await prisma.space.findMany({
      where: { userId: session?.user.id },
      ...spaceWithPositionsQuery,
    });

    return serverSuccessResponse(spaces, "Spaces fetched successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error fetching spaces:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await auth.api.getSession({ headers: request.headers });

    const space = await prisma.space.create({
      data: { ...body, userId: session?.user.id } as Space,
    });

    return serverSuccessResponse(space, "Space created successfully", StatusCodes.CREATED);
  } catch (err) {
    console.error("Error creating space:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
