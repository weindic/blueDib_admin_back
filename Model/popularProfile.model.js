const mongoose = require('mongoose');
const { Schema } = mongoose;

const popularProfileSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  userId: { type:Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'PopularProfile' });

const PopularProfile = mongoose.model('PopularProfile', popularProfileSchema);

module.exports = PopularProfile;