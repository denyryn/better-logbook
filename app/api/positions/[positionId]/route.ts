import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

import { Position } from "@/generated/prisma/client";
import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ positionId: string }> }) {
  try {
    const { positionId } = await params;
    const position = await prisma.position.findUnique({ where: { id: positionId } });

    if (!position) {
      return serverErrorResponse(undefined, "Position not found", StatusCodes.NOT_FOUND);
    }

    return serverSuccessResponse(position, "Position fetched successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error fetching position:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ positionId: string }> }) {
  try {
    const { positionId } = await params;
    const body = await request.json();
    const position = await prisma.position.update({
      data: body as Position,
      where: { id: positionId },
    });

    if (!position) {
      return serverErrorResponse(undefined, "Position not found", StatusCodes.NOT_FOUND);
    }

    return serverSuccessResponse(position, "Position updated successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error updating position:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ positionId: string }> }) {
  try {
    const { positionId } = await params;
    const position = await prisma.position.delete({ where: { id: positionId } });

    if (!position) {
      throw new Error("Position not found");
    }

    return serverSuccessResponse(position, "Position deleted successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error deleting position:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
