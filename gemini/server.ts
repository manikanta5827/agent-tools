import readline from "node:readline";
import { myEmitter } from "./emitter";
import { randomUUID } from "node:crypto";
import { Role } from "./types";

import "./event-emitters";
import "../mcp-client/event-emitters";

// check health of redis
import {
  getSessionMessages,
  setSessionMessages,
  redisHealthCheck,
} from "./redis-store";

await redisHealthCheck();

const sessionId = randomUUID();

// Create line-based stdin reader
const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

// Read one JSON-RPC message per line
console.log("Ask anything...");
rl.on("line", async (userMessage) => {
  if (!userMessage.trim()) return;

  try {
    console.log(`user message :: `, userMessage);

    // get the user messages if exist
    const sessionMessages = await getSessionMessages(sessionId);
    console.log(sessionMessages);
    // if it is first message of user then only push this new message
    if (sessionMessages === null) {
      const message = [
        {
          role: Role.USER,
          parts: [{ text: userMessage }],
        },
      ];
      await setSessionMessages(sessionId, message);
    } else {
      // if already user is chatting then add this user message to existing messages
      sessionMessages.push({
        role: Role.USER,
        parts: [{ text: userMessage }],
      });

      await setSessionMessages(sessionId, sessionMessages);
    }

    // trigger llm request event

    myEmitter.emit("LLM_REQUEST", sessionId);

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
