import React, { useEffect, useState, useRef } from "react";

function ChatModal({ acceptanceId, recipientId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages for this acceptance
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://arc-task.onrender.com/services/messages/acceptance/${acceptanceId}`,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      // Optionally handle error
      console.error("Error fetching messages:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    // Optionally, poll for new messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [acceptanceId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    try {
      await fetch("https://arc-task.onrender.com/services/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ acceptanceId, content }),
      });
      setContent("");
      await fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
    setSending(false);
  };

  // Filter messages to only show those from the last 1 hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentMessages = messages.filter(
    (msg) => new Date(msg.createdAt) >= oneHourAgo
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col h-[80vh] my-8">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center rounded-t-2xl">
        <h2 className="text-white text-lg font-semibold">Direct Message</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-purple-200 transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-purple-50 to-blue-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Start the conversation...
          </div>
        ) : (
          recentMessages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender?._id === recipientId
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                  msg.sender?._id === recipientId
                    ? "bg-white text-gray-800 shadow-md"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      msg.sender?._id === recipientId
                        ? "bg-purple-500 text-white"
                        : "bg-white text-purple-600"
                    }`}
                  >
                    {msg.sender?.name?.charAt(0) || "U"}
                  </div>
                  <span className="font-medium text-sm">
                    {msg.sender?.name || "Unknown"}
                  </span>
                </div>
                <p className="text-sm">{msg.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    msg.sender?._id === recipientId
                      ? "text-gray-500"
                      : "text-purple-100"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            placeholder="Type your message..."
            disabled={sending}
            required
          />
          <button
            type="submit"
            disabled={sending}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 rounded-xl hover:opacity-90 disabled:opacity-75 transition-all flex items-center justify-center"
          >
            {sending ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatModal;
