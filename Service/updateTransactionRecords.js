const Transaction = require("../Model/transaction.model");
const mongoose = require("mongoose");
async function addTimestampsToExistingRecords() {
  try {
    await mongoose.connect(
      "mongodb+srv://sharib:UppVZIXmsFpRZbcK@cluster0.fuv8bli.mongodb.net/socialmedia?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");

    // Fetch existing documents to verify
    const existingDocs = await Transaction.find({});
    console.log(
      `Found ${existingDocs.length} documents in Transaction collection`
    );

    // Perform update operation
    const result = await Transaction.updateMany(
      {}, // Empty filter to update all documents
      { $set: { createdAt: new Date(), updatedAt: new Date() } }
    );

    console.log("Updated records:", result);
    console.log(`Modified ${result.nModified} documents`);
  } catch (error) {
    console.error("Error updating records:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

module.exports = {
  addTimestampsToExistingRecords,
};
