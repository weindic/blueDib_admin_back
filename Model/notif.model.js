const mongoose = require("mongoose");

const notifSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  to: {
    type: String,
  },
  linkId: {
    type: String,
  },
  type: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

notifSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("notif", notifSchema);
