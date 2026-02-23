import { config } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { GoogleAIProvider } from "@/lib/ai/providers/ai.google";
import { AIProviderService } from "@/services/ai.provider.service";
import { errorResponse, successResponse } from "@/lib/api.response";
import { StatusCodes } from "http-status-codes";
import { LogbookAIService } from "@/services/ai.generate.service";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const ai = new AIProviderService(
    new GoogleAIProvider(config.ai.googleai.apiKey),
  );

  try {
    const prompt = await new LogbookAIService(body.prompt).improveText(
      "server",
    );

    const response = await ai.ask(prompt as string);

    return NextResponse.json(
      successResponse(
        response,
        "AI request processed successfully",
        StatusCodes.OK,
      ),
    );
  } catch (err) {
    console.error("AI request failed:", err);
    return NextResponse.json(
      errorResponse(
        undefined,
        "Failed to process AI request",
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
}
