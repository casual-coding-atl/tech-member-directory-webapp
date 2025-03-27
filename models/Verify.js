const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    code: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  }
);

// automatically remove the document when the code expires.
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Verification = mongoose.model("Verification", verificationSchema);

module.exports = Verification;
