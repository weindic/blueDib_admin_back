const mongoose = require("mongoose");
const { Schema } = mongoose;

const NewsletterSchema = new Schema(
  {
    // _id: { type: Schema.Types.ObjectId, required: true },
    emailId: { type: [String], required: true },
    title: { type: String },

    users: { type: [String] },
    template: { type: String },
    status: { type: Number, required: true, default: 1 },
    createdBy: { type: Schema.Types.ObjectId, ref: "adminData" },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

NewsletterSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Newsletter", NewsletterSchema);
