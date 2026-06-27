import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

import { GoogleAIProvider } from "@/lib/ai/providers/ai.google";
import { type AIProviderPrompts } from "@/lib/ai/providers/ai.provider.interface";
import { serverErrorResponse, serverSuccessResponse } from "@/lib/api.response";
import { config } from "@/lib/config";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TokenCalculator } from "@/lib/ai/token.calculator";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return serverErrorResponse(undefined, "Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const body = await request.json() as AIProviderPrompts;

    const usages = await prisma.aiTokenUsage.findMany({
      where: {userId: session.user.id}
    })

    const tokenCalculator = new TokenCalculator(usages);
    const remainingPercentage = tokenCalculator.calculateRemainingPercentage();

    if (remainingPercentage <= 0) {
      return serverErrorResponse(undefined, "You have exceeded your AI usage limit.", StatusCodes.FORBIDDEN)
    }

    const provider = new GoogleAIProvider(config.ai.googleai.apiKey, session.user.id);
    const response = await provider.generate(body);

    return serverSuccessResponse(
      response,
      "AI request processed successfully",
      StatusCodes.OK,
    );
  } catch (err) {
    console.error("AI request failed:", err);
    return serverErrorResponse(
      undefined,
      "Failed to process AI request",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
