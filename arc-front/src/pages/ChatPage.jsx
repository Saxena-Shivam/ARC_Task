import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ChatModal from "./ChatModel";

function ChatPage() {
  const { acceptanceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Get recipientId from navigation state
  const recipientId = location.state?.recipientId;

  if (!recipientId) {
    // If user navigates directly, show error or redirect
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">Recipient not specified.</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      {/* <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center">
          <button
            className="mr-4 text-white hover:text-purple-200 transition-colors"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <span className="text-2xl font-bold text-white font-mono tracking-wide">
            ARC Conversations
          </span>
        </nav>
      </header> */}
      <main className="flex-grow flex items-center justify-center p-4">
        <ChatModal
          acceptanceId={acceptanceId}
          recipientId={recipientId}
          onClose={() => navigate(-1)}
        />
      </main>
    </div>
  );
}

export default ChatPage;
