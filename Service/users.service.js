const User = require("../Model/users.model");
const PopularProfile = require("../Model/popularProfile.model");
const kycRequest = require("../Model/kycRequest.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const KycRequest = require("../Model/kycRequest.model");
const ObjectId = mongoose.Types.ObjectId;
const PaymentMethod = require("../Model/paymentMethod.model");
const Withdrawal = require("../Model/withdrawalRequest.model");
const WithDrawalRequest = require("../Model/withdrawalRequest.model");
exports.getAllUsers = async () => {
  try {
    const users = await User.find({});
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const kycDetails = await kycRequest.findOne({ userId: user._id });
        const popularProfileEntry = await PopularProfile.findOne({
          userId: user._id,
          status: 1,
        });
        return {
          ...user.toObject(),
          hasPopularProfile: !!popularProfileEntry,
          kycDetails,
        };
      })
    );

    return {
      data: usersWithStatus,
      status: true,
      message: "Users retrieved successfully",
    };
  } catch (error) {
    console.error("Error occurred while retrieving users:", error);
    return {
      data: null,
      status: false,
      message: "An error occurred while retrieving users",
    };
  }
};

exports.makePopularUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const existingProfile = await PopularProfile.findOne({ userId });
    if (existingProfile) {
      existingProfile.status = !existingProfile.status;
      await existingProfile.save();
      return {
        message: `Popular Profile tag ${
          existingProfile.status == 1 ? "restored" : "removed"
        } successfully`,
        success: true,
        existingProfile,
      };
    }
    const newProfile = new PopularProfile({
      _id: new mongoose.Types.ObjectId(),
      userId,
      status: 1,
    });

    await newProfile.save();
    return {
      message: "User added to popular profile",
      success: true,
      newProfile,
    };
  } catch (error) {
    console.error("Error occurred while making user Profile Popular:", error);
    return {
      success: false,
      message: "An error occurred while making user Profile Popular",
    };
  }
};

exports.kycupdate = async (id, status) => {
  try {
    const kyc = await KycRequest.findByIdAndUpdate(
      id,
      [{ $set: { status: status } }],
      { new: true }
    );
    if (!kyc) {
      return { error: "kyc details not found" };
    }
    return kyc;
  } catch (error) {
    console.error("Error occurred while updating kyc", error);
    return {
      success: false,
      message: JSON.stringify(error),
    };
  }
};

exports.getTransactions = async () => {
  try {
    // Access the 'Transaction' collection using Mongoose's existing connection
    const transactionCollection = mongoose.connection.collection("Transaction");

    // Perform the lookup between Transaction and User collections
    const transactions = await transactionCollection
      .aggregate([
        {
          $lookup: {
            from: "User", // Name of the 'User' collection
            localField: "buyer_id", // Field in 'Transaction' collection
            foreignField: "_id", // Field in 'User' collection
            as: "buyerData", // Output array field name for buyer data
          },
        },
        {
          $lookup: {
            from: "User", // Name of the 'User' collection
            localField: "seller_id", // Field in 'Transaction' collection
            foreignField: "_id", // Field in 'User' collection
            as: "sellerData", // Output array field name for seller data
          },
        },
        {
          $unwind: {
            path: "$buyerData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$sellerData",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    // console.log(transactions);

    return {
      data: transactions,
      status: true,
      message: "Transactions retrieved successfully",
    };
  } catch (error) {
    console.error("Error occurred while retrieving Transactions:", error);
    return {
      data: null,
      status: false,
      message: "An error occurred while retrieving Transactions",
    };
  }
};

exports.getWithdrawData = async () => {
  try {
    // Access the 'WithDrawalRequest' collection using Mongoose's existing connection
    const withDrawalRequestCollection =
      mongoose.connection.collection("WithDrawalRequest");

    // Perform the lookup between WithDrawalRequest and User collections
    const requests = await withDrawalRequestCollection
      .aggregate([
        {
          $lookup: {
            from: "User", // Name of the 'User' collection
            localField: "userId", // Field in 'WithDrawalRequest' collection
            foreignField: "_id", // Field in 'User' collection
            as: "userData", // Output array field name for user data
          },
        },
        {
          $lookup: {
            from: "PaymentMethod", // Name of the 'PaymentMethod' collection
            localField: "userId", // Field in 'WithDrawalRequest' collection
            foreignField: "userId", // Field in 'PaymentMethod' collection
            as: "UPI", // Output array field name for payment method data
          },
        },
        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    // console.log(requests);

    return {
      data: requests,
      status: true,
      message: "Withdrawal requests retrieved successfully",
    };
  } catch (error) {
    console.error(
      "Error occurred while retrieving Withdrawal requests:",
      error
    );
    return {
      data: null,
      status: false,
      message: "An error occurred while retrieving Withdrawal requests",
    };
  }
};

exports.getPaymentRequest = async () => {
  try {
    // Access the 'AddFundRequest' collection using Mongoose's existing connection
    const addFundRequestCollection =
      mongoose.connection.collection("AddFundRequest");

    // Perform the lookup between AddFundRequest and User collections
    const requests = await addFundRequestCollection
      .aggregate([
        {
          $lookup: {
            from: "User", // Name of the 'User' collection
            localField: "userId", // Field in 'AddFundRequest' collection
            foreignField: "_id", // Field in 'User' collection
            as: "userData", // Output array field name for user data
          },
        },
        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "PaymentMethod", // Name of the 'PaymentMethod' collection
            localField: "userData._id", // Field in 'AddFundRequest' collection (through user data)
            foreignField: "userId", // Field in 'PaymentMethod' collection
            as: "paymentMethodData", // Output array field name for payment method data
          },
        },
        {
          $unwind: {
            path: "$paymentMethodData",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    // console.log(requests);

    return {
      data: requests,
      status: true,
      message: "Payment requests retrieved successfully",
    };
  } catch (error) {
    console.error("Error occurred while retrieving Payment requests:", error);
    return {
      data: null,
      status: false,
      message: "An error occurred while retrieving Payment requests",
    };
  }
};

exports.login = async (data) => {
  const { email, password } = data;
  if (!email || !password) {
    throw new Error("Email and password are required!");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User doesn't exist");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "1h" }
  );
  return {
    data: { user, token },
    message: "Login successful",
  };
};

exports.deactivateUser = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      [{ $set: { deactivated: { $not: "$deactivated" } } }],
      { new: true }
    );
    if (!user) {
      return { error: "user not found" };
    }
    return user;
  } catch (error) {
    throw error;
  }
};

exports.changeWithdrawStatus = async (data) => {
  const { id, transactionId, failedReason, status } = data;
  const withdrawal = await WithDrawalRequest.findById(id);

  if (!withdrawal) {
    throw new Error("Withdrawal not found!");
  }
  if (status === "SUCCESS" && transactionId) {
    withdrawal.transactionId = transactionId;
    withdrawal.status = "SUCCESS";
  } else if (status === "FAILED" && failedReason) {
    withdrawal.failedReason = failedReason;
    withdrawal.status = "FAILED";
  } else {
    throw new Error("Invalid status or missing data");
  }

  await withdrawal.save();
  return withdrawal;
};
