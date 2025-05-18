const RequestModel = require("../Models/Request");
const AcceptanceModel = require("../Models/Acceptance");
const UserModel = require("../Models/User");

// Create a request (Type A only)
exports.createRequest = async (req, res) => {
  try {
    const requesterId = req.user._id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    const newRequest = new RequestModel({
      requester: requesterId,
      content: content,
    });
    await newRequest.save();

    res.status(201).json({ message: "Request created", request: newRequest });
  } catch (err) {
    console.error("Error in createRequest:", err); // <-- Add this line
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get pending requests (Type B only)
exports.getRequests = async (req, res) => {
  try {
    const responderId = req.user._id;
    // Find requests not yet accepted/rejected by this responder
    const requests = await RequestModel.find()
      .populate("requester", "name email")
      .lean();
    const pendingRequests = await Promise.all(
      requests.map(async (request) => {
        const acceptance = await AcceptanceModel.findOne({
          request: request._id,
          responder: responderId,
        });
        return acceptance ? null : request; // Exclude already accepted/rejected
      })
    );
    res.status(200).json({ requests: pendingRequests.filter(Boolean) });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept a request (Type B only)
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const responderId = req.user._id;

    // Prevent duplicate acceptance
    const existing = await AcceptanceModel.findOne({
      request: requestId,
      responder: responderId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Already accepted/rejected this request" });
    }

    const acceptance = new AcceptanceModel({
      request: requestId,
      responder: responderId,
      status: "accepted",
    });
    await acceptance.save();
    res.status(200).json({ message: "Request accepted", acceptance });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// module.exports = { ensureAuthenticated, checkUserType };
