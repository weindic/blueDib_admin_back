const mongoose = require("mongoose");
const {
  addTimestampsToExistingRecords,
} = require("./Service/updateTransactionRecords");
require("dotenv").config({ path: "./env" });
require("./connection/DB");

(async () => {
  try {
    await addTimestampsToExistingRecords();
    console.log("Timestamps updated successfully!");
  } catch (error) {
    console.error("Error fetching or saving data:", error);
  } finally {
    mongoose.connection.close(); // Close the database connection when done
  }
})();
