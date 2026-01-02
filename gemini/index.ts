import readline from "node:readline";
import { myEmitter } from "./emitter";
import { randomUUID } from "node:crypto";
import type { Message } from "./types";
import { Role } from "./types";

import "./event-emitters";

// Create line-based stdin reader
const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

// Read one JSON-RPC message per line
console.log('Ask anything...')
rl.on("line", async (userMessage) => {
  if (!userMessage.trim()) return;

  try {
    console.log(`user message :: `, userMessage);
    let messages: Message[] = [];

    // store the user message
    messages = [
      {
        role: Role.USER,
        parts: [{ text: userMessage }],
      },
    ];

    // trigger llm request event

    myEmitter.emit("LLM_REQUEST", randomUUID(), messages);

    console.log(`emitted event`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    process.stdout.write(errorMessage + "\n");
  }
});

myEmitter.on("error", (err) => {
  console.error("Captured rejection:", err.message);
});

// Shutdown cleanly
process.on("SIGTERM", () => {
  console.error("Gemini CLI shutting down");
  rl.close();
  process.exit(0);
});
