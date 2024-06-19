const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    txn_id: { type: Schema.Types.ObjectId, auto: true, required: true },
    buyerUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    buyer_id: { type: Schema.Types.ObjectId, required: true },
    price: { type: Number, default: 0 },
    amount: { type: Number, required: true },
    newPrice: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ["WALLET", "REFERRAL", "SELL"],
    },
    sellerUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller_id: { type: Schema.Types.ObjectId, required: true },
    created: { type: Date, default: Date.now },
  },
  { collection: "Transaction" }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
