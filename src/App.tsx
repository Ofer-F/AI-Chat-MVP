import { useState } from "react";
import type { User } from "./types/chat";
import { ChatLayout } from "./components/ChatLayout/ChatLayout";
import { mockUsers } from "./api/mockData";
import { AuthScreen } from "./components/AuthScreen/AuthScreen";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (!currentUser) {
    return <AuthScreen users={mockUsers} onLogin={setCurrentUser} />;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="topbar__title">Signed in as {currentUser.name}</span>
        <button
          type="button"
          className="btn"
          onClick={() => setCurrentUser(null)}
        >
          Log out
        </button>
      </header>
      <ChatLayout currentUser={currentUser} />
    </div>
  );
}
