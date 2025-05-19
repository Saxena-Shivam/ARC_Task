const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    acceptance: {
      type: Schema.Types.ObjectId,
      ref: "Acceptance", // Use the correct model name, not collection name
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    response: {
      content: String,
      createdAt: Date,
    },
    remindersSent: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      index: { expires: "1h" },
    },
  },
  { timestamps: true }
);

MessageSchema.pre("save", function (next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model("Message", MessageSchema); // Use singular, capitalized
