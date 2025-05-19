const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AcceptanceSchema = new Schema(
  {
    request: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    responder: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const AcceptanceModel = mongoose.model("Acceptance", AcceptanceSchema);
module.exports = AcceptanceModel;
