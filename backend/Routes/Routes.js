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
// const {
//   sendMessage,
//   respondToMessage,
//   getReceivedMessages,
//   getSentMessages,
//   getMessagesByAcceptance,
// } = require("../Controllers/Message.controller");
const {
  sendMessage,
  getReceivedMessages,
  getMessagesByAcceptance,
} = require("../Controllers/Message.controller");

router.post(
  "/messages",
  ensureAuthenticated,
  checkUserType(["Requestor", "Reciever"]),
  sendMessage
);

// Receiver gets all received messages
router.get(
  "/messages/received",
  ensureAuthenticated,
  checkUserType(["Reciever"]),
  getReceivedMessages
);
// Add this route for both user types if needed
router.get(
  "/messages/acceptance/:acceptanceId",
  ensureAuthenticated,
  getMessagesByAcceptance
);
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
// router.post(
//   "/messages",
//   ensureAuthenticated,
//   checkUserType(["Requestor"]),
//   sendMessage
// );
// router.get(
//   "/messages/sent",
//   ensureAuthenticated,
//   checkUserType(["Requestor"]),
//   getSentMessages
// );

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
// router.post(
//   "/messages/:messageId/respond",
//   ensureAuthenticated,
//   checkUserType(["Reciever"]),
//   respondToMessage
// );
// router.get(
//   "/messages/received",
//   ensureAuthenticated,
//   checkUserType(["Reciever"]),
//   getReceivedMessages
// );
router.post(
  "/requests/:requestId/reject",
  ensureAuthenticated,
  checkUserType(["Reciever"]),
  rejectRequest
);
module.exports = router;
