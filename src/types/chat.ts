export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export type MessageStatus = 'sent' | 'pending' | 'failed';

export interface Message {
    id: string;
    conversationId: string;
    body: string;
    senderId: string;
    createdAt: string;
    status: MessageStatus;
}

export interface Conversation {
    id: string;
    title: string;
    participantIds: string[];
    lastMessage: Message | null;
    updatedAt: string;
}

export interface LoginRequest {
    userId: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface GetConversationsResponse {
    conversations: Conversation[];
}

export interface GetMessagesRequest {
    conversationId: string;
    cursor?: string;
    limit?: number;
}

export interface CreateMessageRequest {
    body: string;
}

export interface GetMessagesResponse {
    messages: Message[];
    nextCursor: string | null;
}

export interface CreateMessageResponse {
    message: Message;
}   