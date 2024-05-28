const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
  
    chatType: {
        type: Object,
     
    },
    chatPricing:{
        type: Object,
      
     
    }
   
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Add unique compound index
// UserSchema.index({ email: 1, username: 1 }, { unique: true });

// Add model ID to schema
// UserSchema.index({ _id: 1 }, { unique: true });


const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
