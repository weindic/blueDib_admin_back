const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentMethodSchema = new mongoose.Schema({
  _id: { type: Schema.Types.ObjectId },
  upiId: { type: String },
  userId: { type: String },
});

module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
