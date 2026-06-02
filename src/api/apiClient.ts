import type {
    CreateMessageRequest,
    CreateMessageResponse,
    GetConversationsResponse,
    GetMessagesResponse,
    LoginRequest,
    LoginResponse,
  } from "../types/chat";
  
  import { mockConversations, mockMessages, mockUsers } from "./mockData";
  
  const MOCK_DELAY_MS = 500;
  const DEFAULT_MESSAGES_LIMIT = 20;
  const SHOULD_FAIL_SEND_RATE = 0.25;

  
  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }
  
  export async function login(
    request: LoginRequest
  ): Promise<LoginResponse> {
    await delay(MOCK_DELAY_MS);
  
    const user = mockUsers.find((mockUser) => mockUser.id === request.userId);
  
    if (!user) {
      throw new Error("User not found");
    }
  
    return {
      token: `mock-token-${user.id}`,
      user,
    };
  }
  
  export async function getConversations(
    currentUserId: string
  ): Promise<GetConversationsResponse> {
    await delay(MOCK_DELAY_MS);
  
    const conversations = mockConversations
      .filter((conversation) =>
        conversation.participantIds.includes(currentUserId)
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      );
  
    return { conversations };
  }
  
  export async function getMessages(
    conversationId: string,
    cursor?: string
  ): Promise<GetMessagesResponse> {
    await delay(MOCK_DELAY_MS);
  
    const allMessages = mockMessages
      .filter((message) => message.conversationId === conversationId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );
      
    const startIndex = cursor ? Number(cursor) : 0;
    const endIndex = startIndex + DEFAULT_MESSAGES_LIMIT;
    const messages = allMessages.slice(startIndex, endIndex);
    
    const nextCursor = endIndex < allMessages.length ? String(endIndex) : null;

  
    return {
      messages,
      nextCursor,
    };
  }
  
  export async function sendMessage(
    conversationId: string,
    senderId: string,
    request: CreateMessageRequest
  ): Promise<CreateMessageResponse> {
    await delay(MOCK_DELAY_MS);

    const shouldFail = Math.random() < SHOULD_FAIL_SEND_RATE;

    if (shouldFail) {
      throw new Error("Failed to send message");
    }
  
    const now = new Date().toISOString();
  
    return {
      message: {
        id: crypto.randomUUID(),
        conversationId,
        senderId,
        body: request.body,
        createdAt: now,
        status: "sent",
      },
    };
  }