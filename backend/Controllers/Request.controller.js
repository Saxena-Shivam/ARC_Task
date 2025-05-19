const RequestModel = require("../Models/Request");
const AcceptanceModel = require("../Models/Acceptance");
const UserModel = require("../Models/User");

// Create a request (Type A only)
exports.createRequest = async (req, res) => {
  try {
    const requesterId = req.user._id;
    const { content, responderId } = req.body; // <-- get responderId from frontend

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    const newRequest = new RequestModel({
      requester: requesterId,
      responder: responderId || undefined, // <-- set responder if provided
      content: content,
    });
    await newRequest.save();

    res.status(201).json({ message: "Request created", request: newRequest });
  } catch (err) {
    console.error("Error in createRequest:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get pending requests (Type B only)
exports.getRequests = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.log("No user in request");
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    const responderId = req.user._id;
    console.log("Responder ID:", responderId);

    const requests = await RequestModel.find()
      .populate("requester", "name email")
      .lean();
    console.log("Requests found:", requests.length);

    const pendingRequests = await Promise.all(
      requests.map(async (request) => {
        const acceptance = await AcceptanceModel.findOne({
          request: request._id,
          responder: responderId,
        });
        return acceptance ? null : request;
      })
    );
    res.status(200).json({ requests: pendingRequests.filter(Boolean) });
  } catch (err) {
    console.error("Error in getRequests:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
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
    await RequestModel.findByIdAndUpdate(requestId, { status: "accepted" });
    res.status(200).json({ message: "Request accepted", acceptance });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// module.exports = { ensureAuthenticated, checkUserType };
// Reject a request (Type B only)
exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const responderId = req.user._id;

    const existing = await AcceptanceModel.findOne({
      request: requestId,
      responder: responderId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Already accepted/rejected this request" });
    }

    const rejection = new AcceptanceModel({
      request: requestId,
      responder: responderId,
      status: "rejected",
    });
    await rejection.save();
    await RequestModel.findByIdAndUpdate(requestId, { status: "rejected" });
    res.status(200).json({ message: "Request rejected", rejection });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getSentRequests = async (req, res) => {
  try {
    const requests = await RequestModel.find({ requester: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const requestsWithStatus = await Promise.all(
      requests.map(async (req) => {
        const acceptance = await AcceptanceModel.findOne({
          request: req._id,
        }).populate("responder", "name email");
        return {
          ...req,
          status: acceptance ? acceptance.status : "pending",
          responder: acceptance ? acceptance.responder : null,
        };
      })
    );

    res.status(200).json({ requests: requestsWithStatus });
  } catch (err) {
    console.error("Error in getSentRequests:", err); // Add this for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};
