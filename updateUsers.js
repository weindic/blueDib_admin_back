const mongoose = require("mongoose");
const User = require("./Model/users.model");

mongoose.connect(
  "mongodb+srv://sharib:UppVZIXmsFpRZbcK@cluster0.fuv8bli.mongodb.net/socialmedia?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const updateUsers = async () => {
  try {
    const users = await User.find({ createdAt: { $exists: false } });

    for (let user of users) {
      user.createdAt = user._id.getTimestamp(); // Use the ObjectId timestamp as the creation time
      user.updatedAt = user.updatedAt || new Date(); // Set updatedAt to now if it doesn't exist
      await user.save();
    }

    console.log("All users updated with createdAt field.");
  } catch (error) {
    console.error("Error updating users:", error);
  } finally {
    mongoose.connection.close();
  }
};

updateUsers();
