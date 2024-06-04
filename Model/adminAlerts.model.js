const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminAlertSchema = new Schema({
  type: { type: Number, enum: [1, 2, 3], required: true },
  message: { type: String, required: true },
  role: { type: String, required: true },
  sourceId: { type: String, required: true },
  seenStatus: { type: Boolean, default: false },
  status: { type: Number, enum: [1, 2, 3], required: true },
  dateTime: { type: Date, default: Date.now }
}, { collection: 'AdminAlert' });

const AdminAlert = mongoose.model('AdminAlert', adminAlertSchema);

module.exports = AdminAlert;
