import { AxiosResponse } from "axios";

import { ApiResponse } from "../api.response";
import { api } from "../axios";
import { config } from "../config";

type Role = "system" | "user" | "administrator";

export class AIPromptBuilder {
  private prompt: Array<string>;
  private role: Role;
  private defaultOutputFormat = {
    content: "output",
  };

  constructor(role: Role) {
    this.role = role;
    this.prompt = [];
  }

  base() {
    this.prompt.push(`You are a helpful assistant for ${config.app.name}.`);
    this.prompt.push(`You are acting as a ${this.role}.`);
    this.prompt.push(`Answer accurately and concisely.`);
    this.prompt.push(
      `Return only the result using the EXPECTED_OUTPUT_FORMAT.`,
    );
    return this;
  }

  initialize(): AIPromptBuilder {
    return this;
  }

  addInstruction(instruction: string): AIPromptBuilder {
    this.prompt.push(instruction);
    return this;
  }

  formatOutput<T = string>(
    expectedOutput?: Record<string, T> | string,
  ): AIPromptBuilder {
    if (expectedOutput) {
      this.prompt.push("EXPECTED_OUTPUT_FORMAT : " + expectedOutput);
    } else {
      this.prompt.push(
        "EXPECTED_OUTPUT_FORMAT : " + JSON.stringify(this.defaultOutputFormat),
      );
    }
    return this;
  }

  async execute(): Promise<string> {
    return this.prompt.join("\n");
  }
}
