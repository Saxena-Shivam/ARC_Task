import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userType, setUserType] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [requestContent, setRequestContent] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
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
    try {
      const res = await fetch(
        "https://arc-task.onrender.com/services/messages/received",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const data = await res.json();
      setReceivedMessages(data.receivedMessages || []);
    } catch (err) {
      handleError(err);
    }
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">ARC</span>
              <div className="ml-10">
                <span className="text-gray-700">Welcome, {loggedInUser}</span>
              </div>
            </div>
            {/* Profile Dropdown */}
            <div className="relative ml-3">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300"
              >
                <svg
                  className="h-8 w-8 text-gray-400"
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
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Your Sent Requests
              </h1>
              <div className="mb-8">
                <form onSubmit={handleSendRequest} className="flex gap-2">
                  <input
                    type="text"
                    value={requestContent}
                    onChange={(e) => setRequestContent(e.target.value)}
                    placeholder="Enter your request"
                    className="border px-4 py-2 rounded w-full"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                  >
                    Send Request
                  </button>
                </form>
              </div>
              <ul>
                {sentRequests.map((req) => (
                  <li
                    key={req._id}
                    className="mb-4 p-4 bg-white rounded shadow"
                  >
                    <div>
                      <span className="font-semibold">Content:</span>{" "}
                      {req.content}
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={
                          req.status === "accepted"
                            ? "text-green-600 font-bold"
                            : req.status === "rejected"
                            ? "text-red-600 font-bold"
                            : "text-yellow-600 font-bold"
                        }
                      >
                        {req.status.charAt(0).toUpperCase() +
                          req.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">By:</span>{" "}
                      {req.responder?.name || "Not assigned yet"} (
                      {req.responder?.email || "N/A"})
                    </div>
                    {/* Show Chat button only if accepted */}
                    {req.status === "accepted" && (
                      <button
                        className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        onClick={() => {
                          // Open chat modal or navigate to chat page
                          // Example: navigate(`/chat/${req._id}`);
                          alert("Open chat for request " + req._id);
                        }}
                      >
                        Chat
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : userType === "Reciever" ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Pending Requests
              </h1>
              <ul>
                {pendingRequests
                  .filter((req) => req.status === "pending")
                  .map((req) => (
                    <li
                      key={req._id}
                      className="mb-4 p-4 bg-white rounded shadow"
                    >
                      <div>
                        <span className="font-semibold">From:</span>{" "}
                        {req.requester?.name || "N/A"} (
                        {req.requester?.email || "N/A"})
                      </div>
                      <div>
                        <span className="font-semibold">Content:</span>{" "}
                        {req.content}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleRequestAction(req._id, "accept")}
                          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestAction(req._id, "reject")}
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
              <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                Received Messages
              </h2>
              <ul>
                {receivedMessages.map((msg) => (
                  <li
                    key={msg._id}
                    className="mb-4 p-4 bg-white rounded shadow"
                  >
                    <div>
                      <span className="font-semibold">From:</span>{" "}
                      {msg.sender?.name || "N/A"} ({msg.sender?.email || "N/A"})
                    </div>
                    <div>
                      <span className="font-semibold">Message:</span>{" "}
                      {msg.content}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div>Loading...{userType}</div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ARC. All rights reserved.
          </p>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}

export default Dashboard;
