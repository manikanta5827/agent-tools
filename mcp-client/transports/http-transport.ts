import configFile from "../gemini.json";
import type { httpArgs } from "./types";

let http_servers_info = new Map();

export const initialiseHttpServers = async (data: any) => {
  try {
    for (const [key, value] of Object.entries(configFile.mcpServers)) {
      const serverSchema = value as unknown as httpArgs;
      const transport = serverSchema.transport;
      const url = serverSchema.url;

      if (transport === "http") {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData: any = await response.json();
        if (responseData.result?.serverInfo) {
          http_servers_info.set(data.result.serverInfo.name, data.result);
        }
      }
    }
  } catch (error) {
    console.log("error ", error);
  }
};
