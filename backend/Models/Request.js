const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RequestSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User", // <-- Changed from "Users" to "User"
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    responder: {
      type: Schema.Types.ObjectId,
      ref: "User", // <-- Changed from "Users" to "User"
    },
  },
  { timestamps: true }
);
const RequestModel = mongoose.model("Request", RequestSchema); // <-- Use singular

module.exports = RequestModel;
