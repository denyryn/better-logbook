import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

import { Company } from "@/generated/prisma/client";
import { error, success } from "@/lib/api.response";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } },
) {
  try {
    const { companyId } = params;
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        error(undefined, "Company not found", StatusCodes.NOT_FOUND),
      );
    }

    return NextResponse.json(
      success(company, "Company fetched successfully", StatusCodes.OK),
    );
  } catch (err) {
    console.error("Error fetching company:", err);
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { companyId: string } },
) {
  try {
    const { companyId } = params;
    const body = await request.json();
    const company = await prisma.company.update({
      data: body as Company,
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        error(undefined, "Company not found", StatusCodes.NOT_FOUND),
      );
    }

    return NextResponse.json(
      success(company, "Company updated successfully", StatusCodes.OK),
    );
  } catch (err) {
    console.error("Error updating company:", err);
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { companyId: string } },
) {
  try {
    const { companyId } = params;
    const company = await prisma.company.delete({ where: { id: companyId } });

    if (!company) {
      return NextResponse.json(
        error(undefined, "Company not found", StatusCodes.NOT_FOUND),
      );
    }

    return NextResponse.json(
      success(company, "Company deleted successfully", StatusCodes.OK),
    );
  } catch (err) {
    console.error("Error deleting company:", err);
    return NextResponse.json(
      error(
        undefined,
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
