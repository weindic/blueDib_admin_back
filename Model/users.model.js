const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    firebaseId: { type: String, unique: true, required: true },
    avatarPath: { type: String },
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    bio: { type: String },
    followersIDs: [{ type: Schema.Types.ObjectId }],
    followingIDs: [{ type: Schema.Types.ObjectId }],
    PostLikedIDs: [{ type: Schema.Types.ObjectId }],
    pan: { type: String },
    shares: { type: Number, default: 10000000 },
    balance: { type: Number, default: 0 },
    price: { type: Number, default: 1 },
    userEquity: { type: Number, default: 10 },
    platformEquity: { type: Number, default: 2.5 },
    mobile: { type: String },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] },
    dob: { type: Date },
    verified: { type: Boolean, default: false },
    otpSentTime: { type: Date },
    otp: { type: Number },
    activated: { type: Boolean, default: false },
    deactivated:{ type: Boolean, default: false }
}, { collection: 'User' });

const User = mongoose.model('User', userSchema);

module.exports = User;
