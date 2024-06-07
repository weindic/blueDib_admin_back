const mongoose = require("mongoose");
const { Schema } = mongoose;

const NewsletterSchema = new Schema({
  // _id: { type: Schema.Types.ObjectId, required: true },
  emailId: { type: [String], required: true },
  users: { type: [String] },
  template: { type: String },
  status: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "AdminData" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Newsletter", NewsletterSchema);
