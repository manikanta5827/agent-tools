import { myEmitter } from "../gemini/emitter";
export let pendingRequests = new Map();

myEmitter.on("mcp_response", async (data: any) => {
  const resolver = pendingRequests.get(data.id);
  if (resolver) {
    pendingRequests.delete(data.id);
    resolver(data);
  }
});
