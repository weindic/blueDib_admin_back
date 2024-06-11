const mongoose = require("mongoose");
const { Schema } = mongoose;

const withdrawalRequestSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      required: true,
    },
    failedReason: { type: String },
    transactionId: { type: String },
    created: { type: Date, default: Date.now },
  },
  { collection: "WithDrawalRequest" }
);

const WithDrawalRequest = mongoose.model(
  "WithDrawalRequest",
  withdrawalRequestSchema
);

module.exports = WithDrawalRequest;
