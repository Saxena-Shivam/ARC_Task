// const MessageModel = require("../Models/Message");
// const AcceptanceModel = require("../Models/Acceptance");
const MessageModel = require("../Models/Message");
const AcceptanceModel = require("../Models/Acceptance");
const mongoose = require("mongoose");
// Send a message (Requestor to accepted Receiver)
exports.sendMessage = async (req, res) => {
  try {
    const { acceptanceId, content } = req.body;
    const senderId = req.user._id;
    console.log("acceptanceId", acceptanceId);
    console.log("content", content);
    // Find acceptance and check status
    const acceptance = await AcceptanceModel.findById(acceptanceId);
    console.log("acceptance", acceptance);
    if (!acceptance) {
      console.log("Acceptance not found");
      return res.status(400).json({ message: "Invalid or unaccepted request" });
    }
    if (acceptance.status !== "accepted") {
      console.log("Invalid acceptance");
      return res.status(400).json({ message: "Invalid or unaccepted request" });
    }
    console.log("senderId:", senderId);
    console.log("acceptance.request:", acceptance.request);
    console.log("acceptance.responder:", acceptance.responder);
    // Only requestor or responder can send message
    if (
      String(acceptance.requester) !== String(senderId) &&
      String(acceptance.responder) !== String(senderId)
    ) {
      console.log("Not authorized");
      return res.status(403).json({ message: "Not authorized" });
    }

    // Determine recipient: if sender is requester, recipient is responder, and vice versa

    let recipient;
    if (String(acceptance.requester) === String(senderId)) {
      recipient = acceptance.responder;
    } else {
      recipient = acceptance.requester;
    }

    const newMessage = new MessageModel({
      acceptance: acceptanceId,
      sender: senderId,
      recipient,
      content,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent", data: newMessage });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all messages for a receiver (for dashboard)
exports.getReceivedMessages = async (req, res) => {
  try {
    const receiverId = req.user._id;
    const messages = await MessageModel.find({ recipient: receiverId })
      .populate("sender", "name email")
      .populate("acceptance", "_id") // Only populate the _id
      .sort({ createdAt: -1 });

    // Map messages to ensure acceptance is just the ID
    const mappedMessages = messages.map((msg) => ({
      ...msg.toObject(),
      acceptance: msg.acceptance?._id ? msg.acceptance._id : msg.acceptance,
    }));

    res.status(200).json({ messages: mappedMessages });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
// Send message by acceptanceId (Type A to accepted Type B)
// exports.sendMessageByAcceptance = async (req, res) => {
//   try {
//     const { acceptanceId, content } = req.body;
//     const acceptance = await AcceptanceModel.findById(acceptanceId);
//     if (!acceptance || acceptance.status !== "accepted") {
//       return res.status(400).json({ message: "Invalid acceptance" });
//     }
//     // You may want to set sender and recipient here as well
//     const newMessage = new MessageModel({
//       acceptance: acceptanceId,
//       sender: req.user._id,
//       recipient: acceptance.requester, // or acceptance.responder, depending on your logic
//       content,
//     });
//     await newMessage.save();
//     res.status(201).json({ message: "Message sent", data: newMessage });
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// // Example backend controller
exports.getMessagesByAcceptance = async (req, res) => {
  try {
    const { acceptanceId } = req.params;
    const messages = await MessageModel.find({ acceptance: acceptanceId })
      .populate("sender", "name email")
      .populate("recipient", "name email")
      .sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
// // Send message by sender/recipient (generic)
// exports.sendMessage = async (req, res) => {
//   try {
//     const senderId = req.user._id;
//     const { recipientId, content, acceptanceId } = req.body;

//     if (!recipientId || !content || !acceptanceId) {
//       return res
//         .status(400)
//         .json({ message: "Recipient, content, and acceptanceId are required" });
//     }

//     // Check if acceptance exists and is accepted
//     const acceptance = await AcceptanceModel.findById(acceptanceId);
//     if (!acceptance || acceptance.status !== "accepted") {
//       return res
//         .status(403)
//         .json({ message: "Chat not enabled until request is accepted." });
//     }

//     const newMessage = new MessageModel({
//       sender: senderId,
//       recipient: recipientId,
//       content,
//       acceptance: acceptanceId,
//     });
//     await newMessage.save();

//     res
//       .status(200)
//       .json({ message: "Message sent successfully", sentMessage: newMessage });
//   } catch (err) {
//     console.error("Error in sendMessage:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Respond to message (Type B only)
// exports.respondToMessage = async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     const { responseContent } = req.body;
//     const message = await MessageModel.findById(messageId);
//     if (message.expiresAt < new Date()) {
//       return res.status(400).json({ message: "Message expired" });
//     }
//     message.response = { content: responseContent, createdAt: new Date() };
//     await message.save();
//     res.status(200).json({ message: "Response saved", data: message });
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Get received messages for Type B
// exports.getReceivedMessages = async (req, res) => {
//   try {
//     const messages = await MessageModel.find()
//       .populate({
//         path: "acceptance",
//         populate: { path: "requester", select: "name email" },
//       })
//       .sort({ createdAt: -1 });
//     res.status(200).json({ messages });
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Get sent messages for Type A (by sender)
// exports.getSentMessages = async (req, res) => {
//   try {
//     const senderId = req.user._id;
//     const sentMessages = await MessageModel.find({ sender: senderId }).populate(
//       "recipient",
//       "name email"
//     );
//     res.status(200).json({ sentMessages });
//   } catch (err) {
//     console.error("Error in getSentMessages:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // // Reject a request (Type B only)
// // exports.rejectRequest = async (req, res) => {
// //   try {
// //     const { requestId } = req.params;
// //     const responderId = req.user._id;

// //     const existing = await AcceptanceModel.findOne({
// //       request: requestId,
// //       responder: responderId,
// //     });
// //     if (existing) {
// //       return res
// //         .status(400)
// //         .json({ message: "Already accepted/rejected this request" });
// //     }

// //     const rejection = new AcceptanceModel({
// //       request: requestId,
// //       responder: responderId,
// //       status: "rejected",
// //     });
// //     await rejection.save();
// //     res.status(200).json({ message: "Request rejected", rejection });
// //   } catch (err) {
// //     res.status(500).json({ message: "Internal server error" });
// //   }
// // };
