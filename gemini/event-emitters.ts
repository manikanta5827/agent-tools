import { myEmitter } from "./emitter";
import type { GeminiResponse } from "./types";
import { getGeminiData } from "./gemini-client";
import { Role } from "./types";
import {
  getLatitudeLongitudeOfUser,
  getLocationOfUser,
  getWeather,
  setLightValues,
} from "./gemini-functions";
import { getSessionMessages, setSessionMessages } from "./redis-store";

myEmitter.on("LLM_REQUEST", async (sessionId: string) => {
  console.log(`LLM_REQUEST is triggered with these args ${sessionId}`);

  // get the user messages from redis store using sessionId
  const sessionMessages = await getSessionMessages(sessionId);
  if (!sessionMessages)
    throw new Error("No messsages present for this sessionId");

  const res = (await getGeminiData(sessionMessages)) as GeminiResponse;

  const candidate = res.candidates?.[0];
  if (!candidate) {
    console.error("No candidates returned");
    return;
  }

  const funcPart = candidate.content?.parts?.find((p) => p.functionCall);
  if (!funcPart?.functionCall) {
    console.log(
      candidate.content?.parts?.map((p) => p.text).join("") ||
        `No response from LLM :: ${candidate.content}`
    );
    return;
  }

  const { name, args } = funcPart.functionCall;

  console.log("Tool requested :: ", name);
  console.log("Tool Args :: ", args);

  // push the llm message to array
  sessionMessages.push({
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

  await setSessionMessages(sessionId, sessionMessages);

  // emit the tool request event
  myEmitter.emit("TOOL_REQUEST", sessionId, name, args);
});

myEmitter.on(
  "TOOL_REQUEST",
  async (sessionId: string, name: string, args: Record<string, any>) => {
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
        output = getLocationOfUser(args.latitude, args.longitude);
        break;
      // get the weather using city name
      case "get_weather":
        output = await getWeather(args.city);
        break;
      // get co-ordinates of user
      case "get_latitude_longitude_of_user":
        output = getLatitudeLongitudeOfUser();
        break;
      case "set_light_values":
        output = setLightValues(args.brightness, args.color_temp);
        break;
      default:
        output = "No tool is supported";
    }

    // get the messages
    const sessionMessages = await getSessionMessages(sessionId);
    if (!sessionMessages)
      throw new Error("No messsages present for this sessionId");
    // store the tool response in messages
    sessionMessages.push({
      role: Role.USER,
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

    await setSessionMessages(sessionId, sessionMessages);

    console.log(`Tool response :: ${JSON.stringify(output)}`);

    // send the response back to llm by calling the event of it
    myEmitter.emit("LLM_REQUEST", sessionId);
  }
);
