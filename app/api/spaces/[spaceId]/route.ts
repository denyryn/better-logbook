import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

import { Space } from "@/generated/prisma/client";
import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ spaceId: string }> },
) {
  try {
    const { spaceId } = await params;
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      return serverErrorResponse(undefined, "Space not found", StatusCodes.NOT_FOUND);
    }

    return serverSuccessResponse(space, "Space fetched successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error fetching space:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{spaceId: string}> },
) {
  try {
    const { spaceId } = await params;
    const body = await request.json();
    const space = await prisma.space.update({
      data: body as Space,
      where: { id: spaceId },
    });

    if (!space) {
      return serverErrorResponse(undefined, "Space not found", StatusCodes.NOT_FOUND);
    }

    return serverSuccessResponse(space, "Space updated successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error updating space:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ spaceId: string }> },
) {
  try {
    const { spaceId } = await params;
    const space = await prisma.space.delete({ where: { id: spaceId } });

    return serverSuccessResponse(space, "Space deleted successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error deleting space:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
