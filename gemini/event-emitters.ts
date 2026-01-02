import { myEmitter } from "./emitter";
import type { Message, GeminiResponse } from "./types";
import { getGeminiData } from "./gemini-client";
import { Role } from "./types";
import {
  getLatitudeLongitudeOfUser,
  getLocationOfUser,
  getWeather,
} from "./gemini-functions";

myEmitter.on("LLM_REQUEST", async (sessionId: string, messages: Message[]) => {
  console.log(`LLM_REQUEST is triggered with these args ${sessionId}`);

  const res = (await getGeminiData(messages)) as GeminiResponse;

  const candidate = res.candidates?.[0];
  if (!candidate) {
    console.error("No candidates returned");
    return;
  }

  const funcPart = candidate.content.parts.find((p) => p.functionCall);
  if (!funcPart?.functionCall) {
    console.log(candidate.content.parts.map((p) => p.text).join(""));
    return;
  }

  const { name, args } = funcPart.functionCall;

  console.log("Tool requested :: ", name);
  console.log("Tool Args :: ", args);

  // push the llm message to array
  messages.push({
    role: Role.MODEL,
    parts: [
      {
        functionCall: {
          name,
          args,
        },
      },
    ],
  });

  // emit the tool request event
  myEmitter.emit("TOOL_REQUEST", sessionId, messages, name, args);
});

myEmitter.on(
  "TOOL_REQUEST",
  async (
    sessionId: string,
    messages: Message[],
    name: string,
    args: Record<string, any>
  ) => {
    console.log(
      `TOOL_REQUEST is triggered these are args ${sessionId}, ${name} , ${JSON.stringify(
        args
      )}`
    );

    // call the tool using mcp client
    let output = undefined;
    switch (name) {
      // get the location of user
      case "get_location_of_user_using_latitude_longitude":
        output = getLocationOfUser({
          latitude: args.latitude,
          longitude: args.longitude,
        });
        break;
      // get the weather using city name
      case "get_weather":
        output = getWeather({ city: args.city });
        break;
      // get co-ordinates of user
      case "get_latitude_longitude_of_user":
        output = getLatitudeLongitudeOfUser();
        break;
      default:
        output = "No tool is supported";
    }

    // store the tool response in messages
    messages.push({
      role: Role.MODEL,
      parts: [
        {
          functionResponse: {
            name,
            response: {
              output,
            },
          },
        },
      ],
    });

    console.log(`Tool response :: ${JSON.stringify(output)}`);

    // send the response back to llm by calling the event of it
    myEmitter.emit("LLM_REQUEST", sessionId, messages);
  }
);
