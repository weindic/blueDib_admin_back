const mongoose = require("mongoose");
const { Schema } = mongoose;
const WebContentSchema = new mongoose.Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  emails: { type: [String] },
  mobiles: {
    type: [String],
    validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
  },
  website: { type: String },
  privacyPolicy: { type: String },
  terms: { type: String },
  refundPolicy: { type: String },
  RBIpolicy: { type: String },
  socialMedia: {
    facebookLink: String,
    twitterLink: String,
    InstagramLink: String,
    LinkedIn: String,
  },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "AdminData" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

function arrayLimit(val) {
  return val.length <= 10;
}

WebContentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  next();
});
module.exports = mongoose.model("WebContent", WebContentSchema);
