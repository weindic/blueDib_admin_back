const mongoose = require('mongoose');
const { Schema } = mongoose;

const KycRequestSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    userId: { type: String, unique: true, required: true },
    adhaar: { type: String },
    adhaarNumber: { type: String},
    pan: { type: String},
    panNumber: { type: String },
    status: { type:String},
    createdAt: [{  type: Date, default: Date.now }],
}, { collection: 'KycRequest' });

const KycRequest = mongoose.model('KycRequest', KycRequestSchema);

module.exports = KycRequest;
