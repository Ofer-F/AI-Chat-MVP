import type { Message } from "../types/chat";

export function createOptimisticMessage(
  conversationId: string,
  senderId: string,
  body: string
): Message {
  return {
    id: `temp-${crypto.randomUUID()}`,
    conversationId,
    senderId,
    body,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
}
