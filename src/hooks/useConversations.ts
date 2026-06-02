import { useCallback, useEffect, useState } from "react";
import { getConversations } from "../api/apiClient";
import type { Conversation } from "../types/chat";

interface UseConversationsResult {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  reloadConversations: () => Promise<void>;
}

export function useConversations(
  currentUserId: string
): UseConversationsResult {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getConversations(currentUserId);

      setConversations(response.conversations);
    } catch {
      setError("Could not load conversations.");
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    isLoading,
    error,
    reloadConversations: loadConversations,
  };
}