const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Chat = require("../Model/chat.model");
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const { Types } = mongoose;

async function enableChat(req, res) {
    try {
        const { userId, chatType, chatPricing } = req.body;
        
        // Check if a chat with the same userId exists
        let existingChat = await Chat.findOne({ userId });

        if (existingChat) {
            // If chat exists, update its chatType and chatPricing
            existingChat.chatType = chatType;
            existingChat.chatPricing = chatPricing;
            await existingChat.save();
            return res.status(200).json({ message: 'Chat updated successfully.' });
        } else {
            // If chat does not exist, create a new one
            const newChat = new Chat({
                userId,
                chatType,
                chatPricing
            });
            const savedChat = await newChat.save();
            return res.status(201).json(savedChat);
        }
    } catch (error) {
        console.error('Error enabling chat:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}



async function getSingleDataByUser(req, res) {
    try {
        // Retrieve the user ID from the request body
      
        const userId =   new Types.ObjectId(req.body.userId);

        const usersCollection = mongoose.connection.collection('User');
    
        // Find the user ID based on the Firebase ID
        const user = await usersCollection.findOne(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Get the user's Firebase ID
        const firebaseId = user.firebaseId;

        // Find chat data based on the user's Firebase ID
        const chat = await Chat.findOne({ userId: firebaseId });
        if (!chat) {
            throw new Error('Chat data not found for user');
        }

        // Return the chat data
        return chat;
    } catch (error) {
        throw error;
    }
}


async function disableChat(userId) {
    try {
        const updatedChat = await Chat.findOneAndUpdate({ userId: userId }, { chatType: "disabled" }, { new: true });
        return updatedChat;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    enableChat,
    getSingleDataByUser,
    disableChat
};
