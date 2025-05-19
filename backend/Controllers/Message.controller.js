const MessageModel = require("../Models/Message");
const AcceptanceModel = require("../Models/Acceptance");

// Send message by acceptanceId (Type A to accepted Type B)
exports.sendMessageByAcceptance = async (req, res) => {
  try {
    const { acceptanceId, content } = req.body;
    const acceptance = await AcceptanceModel.findById(acceptanceId);
    if (!acceptance || acceptance.status !== "accepted") {
      return res.status(400).json({ message: "Invalid acceptance" });
    }
    // You may want to set sender and recipient here as well
    const newMessage = new MessageModel({
      acceptance: acceptanceId,
      sender: req.user._id,
      recipient: acceptance.requester, // or acceptance.responder, depending on your logic
      content,
    });
    await newMessage.save();
    res.status(201).json({ message: "Message sent", data: newMessage });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send message by sender/recipient (generic)
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { recipientId, content } = req.body; // Use 'content' for clarity

    if (!recipientId || !content) {
      return res
        .status(400)
        .json({ message: "Recipient and content are required" });
    }

    const newMessage = new MessageModel({
      sender: senderId,
      recipient: recipientId,
      content,
    });
    await newMessage.save();

    res
      .status(200)
      .json({ message: "Message sent successfully", sentMessage: newMessage });
  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Respond to message (Type B only)
exports.respondToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { responseContent } = req.body;
    const message = await MessageModel.findById(messageId);
    if (message.expiresAt < new Date()) {
      return res.status(400).json({ message: "Message expired" });
    }
    message.response = { content: responseContent, createdAt: new Date() };
    await message.save();
    res.status(200).json({ message: "Response saved", data: message });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get received messages for Type B
exports.getReceivedMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find()
      .populate({
        path: "acceptance",
        populate: { path: "requester", select: "name email" },
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get sent messages for Type A (by sender)
exports.getSentMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const sentMessages = await MessageModel.find({ sender: senderId }).populate(
      "recipient",
      "name email"
    );
    res.status(200).json({ sentMessages });
  } catch (err) {
    console.error("Error in getSentMessages:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// // Reject a request (Type B only)
// exports.rejectRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params;
//     const responderId = req.user._id;

//     const existing = await AcceptanceModel.findOne({
//       request: requestId,
//       responder: responderId,
//     });
//     if (existing) {
//       return res
//         .status(400)
//         .json({ message: "Already accepted/rejected this request" });
//     }

//     const rejection = new AcceptanceModel({
//       request: requestId,
//       responder: responderId,
//       status: "rejected",
//     });
//     await rejection.save();
//     res.status(200).json({ message: "Request rejected", rejection });
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
