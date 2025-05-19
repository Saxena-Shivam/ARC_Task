const express = require("express");
const router = express.Router();
const { ensureAuthenticated, checkUserType } = require("../Middlewares/Auth");
const {
  createRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
  getSentRequests,
} = require("../Controllers/Request.controller");
const {
  sendMessage,
  respondToMessage,
  getReceivedMessages,
  getSentMessages,
} = require("../Controllers/Message.controller");

// Type A (Requestor) Routes
router.post(
  "/requests",
  ensureAuthenticated,
  checkUserType(["Requestor"]),
  createRequest
);
router.get(
  "/requests/sent",
  ensureAuthenticated,
  checkUserType(["Requestor"]),
  getSentRequests
);
router.post(
  "/messages",
  ensureAuthenticated,
  checkUserType(["Requestor"]),
  sendMessage
);
router.get(
  "/messages/sent",
  ensureAuthenticated,
  checkUserType(["Requestor"]),
  getSentMessages
);

// Type B (Reciever) Routes
router.get(
  "/requests",
  ensureAuthenticated,
  checkUserType(["Reciever"]),
  getRequests
);
router.post(
  "/requests/:requestId/accept",
  ensureAuthenticated,
  checkUserType(["Reciever"]),
  acceptRequest
);
router.post(
  "/messages/:messageId/respond",
  ensureAuthenticated,
  checkUserType(["Reciever"]),
  respondToMessage
);
router.get(
  "/messages/received",
  ensureAuthenticated,
  checkUserType(["Reciever"]),
  getReceivedMessages
);
router.post(
  "/requests/:requestId/reject",
  ensureAuthenticated,
  checkUserType(["Reciever"]),
  rejectRequest
);
module.exports = router;
