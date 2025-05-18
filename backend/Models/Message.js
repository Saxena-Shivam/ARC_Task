const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MessageSchema = new Schema(
  {
    acceptance: {
      type: Schema.Types.ObjectId,
      ref: "acceptances",
      required: true,
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
      index: { expires: "1h" }, // TTL index for auto-deletion after 1 hour
    },
  },
  { timestamps: true }
);

// Pre-save hook to set expiresAt = now + 1 hour
MessageSchema.pre("save", function (next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  }
  next();
});

const MessageModel = mongoose.model("messages", MessageSchema);

module.exports = MessageModel;
