import { useCallback, useEffect, useReducer } from "react";
import { getMessages, sendMessage } from "../api/apiClient";
import type { Message } from "../types/chat";
import { createOptimisticMessage } from "./useMessages.utils";
import {
  initialMessagesState,
  messagesReducer,
} from "./useMessages.reducer";

interface UseMessagesResult {
  messages: Message[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMoreMessages: () => Promise<void>;
  sendNewMessage: (body: string, senderId: string) => Promise<void>;
  clearError: () => void;
}

export function useMessages(conversationId: string | null): UseMessagesResult {
  const [state, dispatch] = useReducer(messagesReducer, initialMessagesState);

  const loadInitialMessages = useCallback(async (): Promise<void> => {
    if (!conversationId) {
      dispatch({ type: "reset" });
      return;
    }

    dispatch({ type: "initialLoadStarted" });

    try {
      const response = await getMessages(conversationId);
      dispatch({
        type: "initialLoadSucceeded",
        messages: response.messages,
        nextCursor: response.nextCursor,
      });
    } catch {
      dispatch({
        type: "initialLoadFailed",
        error: "Could not load messages.",
      });
    }
  }, [conversationId]);

  const loadMoreMessages = useCallback(async (): Promise<void> => {
    if (!conversationId || !state.nextCursor || state.isLoadingMore) {
      return;
    }

    dispatch({ type: "loadMoreStarted" });

    try {
      const response = await getMessages(conversationId, state.nextCursor);
      dispatch({
        type: "loadMoreSucceeded",
        messages: response.messages,
        nextCursor: response.nextCursor,
      });
    } catch {
      dispatch({
        type: "loadMoreFailed",
        error: "Could not load more messages.",
      });
    }
  }, [conversationId, state.nextCursor, state.isLoadingMore]);

  const sendNewMessage = useCallback(
    async (body: string, senderId: string): Promise<void> => {
      if (!conversationId) return;

      const trimmedBody = body.trim();
      if (!trimmedBody) return;

      const optimisticMessage = createOptimisticMessage(
        conversationId,
        senderId,
        trimmedBody
      );

      dispatch({ type: "messageOptimisticAdded", message: optimisticMessage });

      try {
        const response = await sendMessage(conversationId, senderId, {
          body: trimmedBody,
        });
        dispatch({
          type: "messageSendConfirmed",
          temporaryId: optimisticMessage.id,
          message: response.message,
        });
      } catch {
        dispatch({
          type: "messageSendFailed",
          temporaryId: optimisticMessage.id,
          error: "Could not send message.",
        });
      }
    },
    [conversationId]
  );

  useEffect(() => {
    void loadInitialMessages();
  }, [loadInitialMessages]);

  const clearError = useCallback((): void => {
    dispatch({ type: "errorDismissed" });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    isLoadingMore: state.isLoadingMore,
    error: state.error,
    hasMore: state.nextCursor !== null,
    loadMoreMessages,
    sendNewMessage,
    clearError,
  };
  
}