import { useConversations } from "../../hooks/useConversations";
import { ConversationListPresentational } from "./ConversationListPresentational";

interface ConversationListContainerProps {
  currentUserId: string;
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationListContainer({
  currentUserId,
  selectedConversationId,
  onSelectConversation,
}: ConversationListContainerProps) {
  const { conversations, isLoading, error } =
    useConversations(currentUserId);

  return (
    <ConversationListPresentational
      conversations={conversations}
      selectedConversationId={selectedConversationId}
      onSelectConversation={onSelectConversation}
      isLoading={isLoading}
      error={error}
    />
  );
}