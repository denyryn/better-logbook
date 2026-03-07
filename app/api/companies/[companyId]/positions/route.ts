import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> },
) {
  try {
    const { companyId } = await params;
    const position = await prisma.position.findMany({ where: { companyId } });

    return serverSuccessResponse(
      position, "Position fetched successfully", StatusCodes.OK
    );
  } catch (err) {
    console.error("Error fetching position:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
