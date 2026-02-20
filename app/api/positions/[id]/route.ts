import { NextRequest, NextResponse } from "next/server";
import { success, error, status } from "@/lib/api.response";
import { prisma } from "@/lib/prisma";
import { StatusCodes } from "http-status-codes";
import { Position } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.searchParams.get("id"));
    const position = await prisma.position.findUnique({ where: { id } });

    if (!position) {
      return NextResponse.json(
        error(
          undefined,
          "Position not found",
          status.ERROR,
          StatusCodes.NOT_FOUND,
        ),
      );
    }

    return NextResponse.json(
      success(
        position,
        "Position fetched successfully",
        status.SUCCESS,
        StatusCodes.OK,
      ),
    );
  } catch (e) {
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        status.ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.searchParams.get("id"));
    const body = await request.json();
    const position = await prisma.position.update({
      data: body as Position,
      where: { id },
    });

    if (!position) {
      return NextResponse.json(
        error(
          undefined,
          "Position not found",
          status.ERROR,
          StatusCodes.NOT_FOUND,
        ),
      );
    }

    return NextResponse.json(
      success(
        position,
        "Position updated successfully",
        status.SUCCESS,
        StatusCodes.OK,
      ),
    );
  } catch (e) {
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        status.ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.searchParams.get("id"));
    const position = await prisma.position.delete({ where: { id } });

    if (!position) {
      throw new Error("Position not found");
    }

    return NextResponse.json(
      success(
        position,
        "Position deleted successfully",
        status.SUCCESS,
        StatusCodes.OK,
      ),
    );
  } catch (e) {
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        status.ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
