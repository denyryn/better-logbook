import { NextRequest, NextResponse } from "next/server";
import { success, error } from "@/lib/api.response";
import { prisma } from "@/lib/prisma";
import { StatusCodes } from "http-status-codes";
import { Company } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.searchParams.get("id"));
    const company = await prisma.company.findUnique({ where: { id } });

    if (!company) {
      return NextResponse.json(
        error(undefined, "Company not found", StatusCodes.NOT_FOUND),
      );
    }

    return NextResponse.json(
      success(company, "Company fetched successfully", StatusCodes.OK),
    );
  } catch (e) {
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.searchParams.get("id"));
    const body = await request.json();
    const company = await prisma.company.update({
      data: body as Company,
      where: { id },
    });

    if (!company) {
      return NextResponse.json(
        error(undefined, "Company not found", StatusCodes.NOT_FOUND),
      );
    }

    return NextResponse.json(
      success(company, "Company updated successfully", StatusCodes.OK),
    );
  } catch (e) {
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = Number(request.nextUrl.searchParams.get("id"));
    const company = await prisma.company.delete({ where: { id } });

    if (!company) {
      return NextResponse.json(
        error(undefined, "Company not found", StatusCodes.NOT_FOUND),
      );
    }

    return NextResponse.json(
      success(company, "Company deleted successfully", StatusCodes.OK),
    );
  } catch (e) {
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
