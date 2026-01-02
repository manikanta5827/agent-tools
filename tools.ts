import type { ToolConfiguration } from "@aws-sdk/client-bedrock-runtime";

export const toolConfig: ToolConfiguration = {
  toolChoice: {
    tool: {
      name: "getWeather",
    },
  },
  tools: [
    {
      toolSpec: {
        name: "getWeather",
        description: "Get the weather of a city",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              city: {
                type: "string",
                description:
                  "Name of the city to get the weather like Bengaluru, Hyderabad",
              },
            },
            required: ["city"],
          },
        },
      },
    },
    {
      toolSpec: {
        name: "changeLightsMode",
        description: "change the mode of lights from cold,warm",
        inputSchema: {
          json: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                description:
                  "mode specifying the light temperature EX: cold,warm",
              },
            },
            required: ["mode"],
          },
        },
      },
    },
  ],
};

export class Tools {
  get_weather(location: string): string {
    return `Weather in ${location} is sunny with 72F`;
  }

  change_lights_mode(mode: string): string {
    return `Lights mode is changed to ${mode}`;
  }
}
