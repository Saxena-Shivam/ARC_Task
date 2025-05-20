import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
// import ChatModal from "./ChatModel";
function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userType, setUserType] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [requestContent, setRequestContent] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  // const [chatAcceptanceId, setChatAcceptanceId] = useState(null);
  // const [chatRecipientId, setChatRecipientId] = useState(null);
  console.log("userType", userType);
  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
    setUserType(localStorage.getItem("userType"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userType");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // Fetch pending requests for Receiver
  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(
        // "https://arc-task.onrender.com/services/requests",
        "https://arc-task.onrender.com/services/requests",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const data = await res.json();
      setPendingRequests(data.requests || []);
    } catch (err) {
      handleError(err);
    }
  };

  // Fetch sent messages for Requestor
  const fetchSentMessages = async () => {
    try {
      const res = await fetch(
        "https://arc-task.onrender.com/services/messages/sent",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const data = await res.json();
      setSentMessages(data.sentMessages || []);
    } catch (err) {
      handleError(err);
    }
  };

  // Fetch received messages for Receiver
  const fetchReceivedMessages = async () => {
    const res = await fetch(
      "https://arc-task.onrender.com/services/messages/received",
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    );
    const data = await res.json();
    setReceivedMessages(data.messages || []);
  };

  useEffect(() => {
    if (userType === "Requestor") {
      fetchSentMessages();
    } else if (userType === "Reciever") {
      fetchPendingRequests();
      fetchReceivedMessages();
    }
  }, [userType]);

  // Send a new request (Requestor)
  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://arc-task.onrender.com/services/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ content: requestContent }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        handleSuccess("Request sent!");
        setRequestContent("");
        fetchSentMessages();
      } else {
        handleError(data.message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  // Accept or reject a request (Receiver)
  const handleRequestAction = async (requestId, action) => {
    try {
      const res = await fetch(
        `https://arc-task.onrender.com/services/requests/${requestId}/${action}`,
        {
          method: "POST",
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const data = await res.json();
      if (res.ok) {
        handleSuccess(`Request ${action}ed!`);
        fetchPendingRequests();
      } else {
        handleError(data.message);
      }
    } catch (err) {
      handleError(err);
    }
  };
  const [sentRequests, setSentRequests] = useState([]);

  const fetchSentRequests = async () => {
    try {
      const res = await fetch(
        "https://arc-task.onrender.com/services/requests/sent",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const data = await res.json();
      setSentRequests(data.requests || []);
    } catch (err) {
      handleError(err);
    }
  };
  useEffect(() => {
    if (userType === "Requestor") {
      fetchSentRequests();
      fetchSentMessages();
    } else if (userType === "Reciever") {
      fetchPendingRequests();
      fetchReceivedMessages();
    }
  }, [userType]);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-purple-700 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">UniCom</span>
              <div className="ml-10">
                <span className="text-gray-200">Welcome, {loggedInUser}</span>
              </div>
            </div>
            {/* Profile Dropdown */}
            <div className="relative ml-3">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex text-sm rounded-full focus:outline-none transition-transform hover:scale-110"
              >
                <svg
                  className="h-8 w-8 text-gray-200 hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-1 bg-white backdrop-blur-sm bg-opacity-90">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {userType === "Requestor" ? (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Your Sent Requests
              </h1>
              <div className="mb-8">
                <form onSubmit={handleSendRequest} className="flex gap-4">
                  <input
                    type="text"
                    value={requestContent}
                    onChange={(e) => setRequestContent(e.target.value)}
                    placeholder="Enter your request..."
                    className="border-2 border-gray-200 px-6 py-3 rounded-xl w-full focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    Send Request
                  </button>
                </form>
              </div>
              <ul className="space-y-4">
                {sentRequests.map((req) => (
                  <li
                    key={req._id}
                    className="p-6 bg-white bg-opacity-90 rounded-2xl shadow-md hover:shadow-lg transition-shadow backdrop-blur-sm"
                  >
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-semibold text-blue-600">
                          Content:
                        </span>{" "}
                        {req.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-purple-600">
                          Status:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            req.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : req.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-semibold">By:</span>{" "}
                        {req.responder?.name || "Not assigned yet"}
                      </p>
                      {req.status === "accepted" && req.acceptance && (
                        <button
                          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all cursor-pointer shadow-md hover:shadow-lg"
                          onClick={() => {
                            navigate(`/chat/${req.acceptance._id}`, {
                              state: { recipientId: req.responder?._id },
                            });
                          }}
                        >
                          Open Chat
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : userType === "Reciever" ? (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Pending Requests
              </h1>
              <ul className="space-y-6">
                {pendingRequests
                  .filter((req) => req.status === "pending")
                  .map((req) => (
                    <li
                      key={req._id}
                      className="p-6 bg-white bg-opacity-90 rounded-2xl shadow-md hover:shadow-lg transition-shadow backdrop-blur-sm"
                    >
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          <span className="font-semibold text-blue-600">
                            From:
                          </span>{" "}
                          {req.requester?.name}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold text-purple-600">
                            Content:
                          </span>{" "}
                          {req.content}
                        </p>
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={() =>
                              handleRequestAction(req._id, "accept")
                            }
                            className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-all cursor-pointer shadow-md hover:shadow-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleRequestAction(req._id, "reject")
                            }
                            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-all cursor-pointer shadow-md hover:shadow-lg"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">
                Received Messages
              </h2>
              <ul className="space-y-4">
                {receivedMessages.map((msg) => (
                  <li
                    key={msg._id}
                    className="p-6 bg-white bg-opacity-90 rounded-2xl shadow-md hover:shadow-lg transition-shadow backdrop-blur-sm"
                  >
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-semibold text-blue-600">
                          From:
                        </span>{" "}
                        {msg.sender?.name}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold text-purple-600">
                          Message:
                        </span>{" "}
                        {msg.content}
                      </p>
                      {msg.acceptance && (
                        <button
                          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all cursor-pointer shadow-md hover:shadow-lg"
                          onClick={() => {
                            navigate(`/chat/${msg.acceptance}`, {
                              state: { recipientId: msg.sender?._id },
                            });
                          }}
                        >
                          Reply
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center text-gray-600">Loading...</div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-8 mt-12 rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-90">
            &copy; {new Date().getFullYear()} ARC. All rights reserved.
          </p>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}

export default Dashboard;
