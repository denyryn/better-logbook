import { AxiosResponse } from "axios";

import { ApiResponse } from "../api.response";
import { api } from "../axios";
import { config } from "../config";

type Role = "system" | "user" | "administrator";

export class AIPromptBuilder {
  private prompt: Array<{ role: Role; content: string }>;
  private defaultOutputFormat = {
    content: "output",
  };

  constructor() {
    this.prompt = [];
  }

  base() {
    this.prompt.push({role: "system", content : `You are a helpful assistant for ${config.app.name}.`});
    this.prompt.push({role: "system", content : `Answer accurately and concisely.`});
    this.prompt.push(
      {role: "system", content : `Return only the result using the EXPECTED_OUTPUT_FORMAT.`},
    );
    return this;
  }

  initialize(): AIPromptBuilder {
    return this;
  }

  addInstruction(instruction: { role: Role; content: string }): AIPromptBuilder {
    this.prompt.push(instruction);
    return this;
  }

  formatOutput<T = string>(
    expectedOutput?: Record<string, T> | string,
  ): AIPromptBuilder {
    if (expectedOutput) {
      this.prompt.push({role: "system", content: "EXPECTED_OUTPUT_FORMAT : " + expectedOutput});
    } else {
      this.prompt.push(
        {role: "system", content: "EXPECTED_OUTPUT_FORMAT : " + JSON.stringify(this.defaultOutputFormat)}
      );
    }
    return this;
  }

  async execute(): Promise<string> {
    return this.prompt
      .map((p) => `${p.role}: ${p.content}`)
      .join("\n");
  }
}
