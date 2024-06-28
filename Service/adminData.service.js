const User = require("../Model/adminData.model");
const appUsers = require("../Model/users.model");
const WithDrawalRequest = require("../Model/withdrawalRequest.model");
const PopularProfile = require("../Model/popularProfile.model");
const Transaction = require("../Model/transaction.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();

exports.addAdmin = async (data) => {
  let responseData = {};
  const { email, name, password, role, phone } = data;
  let prf = null;
  if (data.profile !== null) {
    prf = data.profile;
  } else {
    prf = "profile.jpg";
  }

  try {
    // Validation
    if (!email || !name || !password || !role || !phone) {
      throw new Error("All fields are required");
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      responseData = {
        data: null,
        status: false,
        message: "Email is already exist",
      };
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        name,
        password: hashedPassword,
        role,
        profile: prf,
        phone,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Save the user to the database
      const savedUser = await newUser.save();

      responseData = {
        data: savedUser,
        status: true,
        message: "Admin added successfully",
      };
    }
  } catch (error) {
    responseData = {
      data: null,
      status: false,
      message: error.message || "An error occurred while adding admin",
    };
  }

  return responseData;
};

// login admin service================//

exports.loginAdmin = async (email, password) => {
  try {
    const secretKey = process.env.JWT_KEY;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(password);

    if (!isPasswordValid) {
      throw new Error("Invalid Password!");
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });

    return token;
  } catch (error) {
    console.error("Error in authService.login:", error);
    throw new Error("Authentication failed");
  }
};

// get all admin=================//

exports.getAllAdmins = async () => {
  try {
    const admins = await User.find().sort({ updatedAt: 1 });
    return {
      data: admins,
      status: true,
      message: "Admins retrieved successfully",
    };
  } catch (error) {
    return {
      data: null,
      status: false,
      message: "An error occurred while retrieving admins",
    };
  }
};

// get single admin data============//

exports.getAdminById = async (adminId) => {
  try {
    const admin = await User.findById(adminId);
    if (!admin) {
      return {
        data: null,
        status: false,
        message: "Admin not found",
      };
    }
    return {
      data: admin,
      status: true,
      message: "Admin retrieved successfully",
    };
  } catch (error) {
    return {
      data: null,
      status: false,
      message: "An error occurred while retrieving admin",
    };
  }
};

// update admin data=============//

exports.updateAdmin = async (adminId, updateData) => {
  try {
    const { password } = updateData;

    // Check if password is provided and not empty
    if (password) {
      // Fetch the existing user data
      const existingUser = await User.findById(adminId);

      // Check if the existing user and its password are valid
      if (existingUser) {
        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        );

        // If the password is not valid, hash the provided password
        if (!isPasswordValid) {
          updateData.password = await bcrypt.hash(password, 10);
        }
      }
    }

    const setData = {
      name: updateData.name,
      email: updateData.email,
      phone: updateData.mobile,
      password: updateData.password,
      role: updateData.role,

      updatedAt: new Date(),
    };

    const admin = await User.findByIdAndUpdate(adminId, setData, { new: true });

    if (!admin) {
      return {
        data: null,
        status: false,
        message: "Admin not found",
      };
    }

    return {
      data: admin,
      status: true,
      message: "Admin updated successfully",
    };
  } catch (error) {
    return {
      data: null,
      status: false,
      message: "An error occurred while updating admin",
    };
  }
};

// deactivate the admin data==========//

exports.deactivateAdmin = async (adminId) => {
  try {
    // Find the admin to toggle status
    const admin = await User.findById(adminId);

    if (!admin) {
      return {
        data: null,
        status: false,
        message: "Admin not found",
      };
    }

    // Toggle the status (activate if deactivated, deactivate if activated)
    const newStatus = admin.status == 1 ? 0 : 1;

    // Update the status
    const updatedAdmin = await User.findByIdAndUpdate(
      adminId,
      { status: newStatus },
      { new: true }
    );

    return {
      data: updatedAdmin,
      status: true,
      message: `Admin status toggled successfully (new status: ${
        newStatus == 1 ? "Unblocked" : "Blocked"
      })`,
    };
  } catch (error) {
    console.error("Error toggling admin status:", error); // Log the error for debugging

    return {
      data: null,
      status: false,
      message: "An error occurred while toggling admin status",
      error: error.message, // Include the actual error message in the response
    };
  }
};

// delete admin data===========//

exports.deleteAdmin = async (adminId) => {
  try {
    const admin = await User.findById(adminId);

    if (!admin) {
      return {
        data: null,
        status: false,
        message: "Admin not found",
      };
    }

    // Check if the admin has role 1
    if (admin.role === "1") {
      // Check if there are other admins with role 1
      const otherRoleOneAdmins = await User.countDocuments({
        role: "1",
        _id: { $ne: adminId },
      });

      if (otherRoleOneAdmins === 0) {
        return {
          data: null,
          status: false,
          message: "Cannot delete the last admin with role admin",
        };
      }
    }

    // If not the last admin with role 1, proceed with deletion
    const deletedAdmin = await User.findByIdAndRemove(adminId);

    return {
      data: deletedAdmin,
      status: true,
      message: "Admin deleted successfully",
    };
  } catch (error) {
    return {
      data: null,
      status: false,
      message: "An error occurred while deleting admin",
    };
  }
};

exports.masterData = async () => {
  try {
    const userCount = await appUsers.count();
    const paymentsCount = await Transaction.count();
    const withdrawalRequestCount = await WithDrawalRequest.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const withdrawalRequestSum =
      withdrawalRequestCount.length > 0
        ? withdrawalRequestCount[0].totalAmount
        : 0;
    const adminCount = await User.count();
    const popularProfiles = await PopularProfile.find({ status: 1 }).populate(
      "userId"
    );
    return {
      userCount,
      paymentsCount,
      withdrawalRequestSum,
      adminCount,
      popularProfiles,
    };
  } catch (err) {
    return err;
  }
};
