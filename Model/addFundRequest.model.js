const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for AddFundRequest
const AddFundRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    txnId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "ACCEPTED",
        "REJECTED",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PENDING",
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
AddFundRequestSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
// Create and export the AddFundRequest model
const AddFundRequest = mongoose.model("AddFundRequest", AddFundRequestSchema);

module.exports = AddFundRequest;
