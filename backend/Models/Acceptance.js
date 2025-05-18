const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AcceptanceSchema = new Schema(
  {
    request: {
      type: Schema.Types.ObjectId,
      ref: "requests",
      required: true,
    },
    responder: {
      type: Schema.Types.ObjectId,
      ref: "users", // Matches your UserModel's collection name
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

const AcceptanceModel = mongoose.model("acceptances", AcceptanceSchema);
module.exports = AcceptanceModel;
