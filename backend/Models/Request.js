const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RequestSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "Users",
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
      ref: "Users",
    },
  },
  { timestamps: true }
);
const RequestModel = mongoose.model("requests", RequestSchema);

module.exports = RequestModel;
