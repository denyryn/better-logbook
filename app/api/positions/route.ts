import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Position } from "@/generated/prisma/client";
import { success, error, status } from "@/lib/api.response";
import { StatusCodes } from "http-status-codes";

export async function GET() {
  try {
    const positions = await prisma.position.findMany();
    return NextResponse.json(
      success(
        positions,
        "Positions fetched successfully",
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const position = await prisma.position.create({ data: body as Position });
    return NextResponse.json(
      success(
        position,
        "Position created successfully",
        status.SUCCESS,
        StatusCodes.CREATED,
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
