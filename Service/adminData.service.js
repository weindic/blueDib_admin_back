const User = require("../Model/adminData.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;


exports.addAdmin  = async (data) => {
  let responseData = {};
  const { email, name, password, role,  phone } = data;
 let prf = null
  if(data.profile!==null){
    prf = data.profile;
  }
  else{
    prf = 'profile.jpg';
  }

  try {

    
    // Validation
    if (!email || !name || !password || !role  || !phone) {
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
        password:hashedPassword,
        role,
        profile:prf,
        phone,
        status:1,
        createdAt:new Date(),
        updatedAt:new Date(),

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

exports.loginAdmin = async (data) => {
  let responseData = {};

  const { email, password, ipAddress } = data;

  console.log('Payload', data);

  try {
    // Validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Find the user with the provided email
    const user = await User.findOne({ email });

    console.log('User', user);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.status != 1) {
      throw new Error("Your account is blocked by management.");
    }

    // Check if the provided password matches the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('Is Password Valid', isPasswordValid);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const loginDetails = {
      ip: ipAddress,
      lastLoginTime: new Date(),
    };

    user.loginHistory.push(loginDetails);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "recycleBaba", // Replace with your actual secret key
      { expiresIn: "1h" } // Set the token expiration time
    );

    // Save the token to the user model (if needed)
    user.token = token;
    await user.save();

    responseData = {
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          profile: user.profile,
          phone: user.phone,
        },
        token,
        loginHistory: user.loginHistory,
      },
      status: true,
      message: "Login successful",
    };
  } catch (error) {
    console.error('Error in loginAdmin:', error); // Log the error for debugging
    responseData = {
      data: null,
      status: false,
      message: error.message || "An error occurred while logging in",
    };
  }

  console.log('Response Data', responseData);

  return responseData;
};




// get all admin=================//


exports.getAllAdmins = async () => {
  try {
    const admins = await User.find();
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
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        
        // If the password is not valid, hash the provided password
        if (!isPasswordValid) {
          updateData.password = await bcrypt.hash(password, 10);
        }
      }
    }



    const setData = {
      "name": updateData.name,         
      "email": updateData.email,
      "phone": updateData.mobile,    
      "password": updateData.password,
      "role": updateData.role,

      updatedAt:new Date(),
    }

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
    const updatedAdmin = await User.findByIdAndUpdate(adminId, { status: newStatus }, { new: true });

    return {
      data: updatedAdmin,
      status: true,
      message: `Admin status toggled successfully (new status: ${newStatus==1? 'Unblocked':'Blocked'})`,
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
    if (admin.role === '1') {
      // Check if there are other admins with role 1
      const otherRoleOneAdmins = await User.countDocuments({ role: '1', _id: { $ne: adminId } });

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


