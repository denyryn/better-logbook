import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

import { Company } from "@/generated/prisma/client";
import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> },
) {
  try {
    const { companyId } = await params;
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return serverErrorResponse(undefined, "Company not found", StatusCodes.NOT_FOUND);
    }

    return serverSuccessResponse(company, "Company fetched successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error fetching company:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{companyId: string}> },
) {
  try {
    const { companyId } = await params;
    const body = await request.json();
    const company = await prisma.company.update({
      data: body as Company,
      where: { id: companyId },
    });

    if (!company) {
      return serverErrorResponse(undefined, "Company not found", StatusCodes.NOT_FOUND);
    }

    return serverSuccessResponse(company, "Company updated successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error updating company:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> },
) {
  try {
    const { companyId } = await params;
    const company = await prisma.company.delete({ where: { id: companyId } });

    if (!company) {
      return serverErrorResponse(undefined, "Company not found", StatusCodes.NOT_FOUND);
    }

    return serverSuccessResponse(company, "Company deleted successfully", StatusCodes.OK);
  } catch (err) {
    console.error("Error deleting company:", err);
    return serverErrorResponse(
      undefined,
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
