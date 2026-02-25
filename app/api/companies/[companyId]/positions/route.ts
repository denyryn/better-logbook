import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

import { error, status, success } from "@/lib/api.response";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> },
) {
  try {
    const { companyId } = await params;
    const position = await prisma.position.findMany({ where: { companyId } });

    return NextResponse.json(
      success(position, "Position fetched successfully", StatusCodes.OK),
    );
  } catch (err) {
    console.error("Error fetching position:", err);
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
