
const User = require("../Model/users.model");
const PopularProfile = require("../Model/popularProfile.model")
const kycRequest = require("../Model/kycRequest.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const KycRequest = require("../Model/kycRequest.model");
const ObjectId = mongoose.Types.ObjectId;
const AddFundRequest = require("../Model/addFundRequest.model"); // Assuming your model is named AddFundRequest
const PlatformSellRequest = require("../Model/PlatformSellRequest.model");






exports.changeAddFundRequestStatus = async (requestId, status) => {
    try {
      // Ensure requestId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return {
          status: false,
          message: 'Invalid request ID format'
        };
      }
  
      const addFundRequest = await AddFundRequest.findById('65a8ff705d6832a9343df179');
  
      console.log('addFundRequest', addFundRequest, requestId)

      if (!addFundRequest) {
        return {
          status: false,
          message: 'AddFundRequest not found'
        };
      }
  
      addFundRequest.status = status;
  
      if (status === 'ACCEPTED') {
        const user = await User.findById(addFundRequest.userId);
        if (!user) {
          return {
            status: false,
            message: 'User not found'
          };
        }
        user.balance += parseFloat(addFundRequest.amount);
        await user.save();
      }
  
      await addFundRequest.save();
  
      return {
        status: true,
        message: `AddFundRequest status changed to ${status}`,
        addFundRequest
      };
    } catch (error) {
      console.error('Error occurred while changing AddFundRequest status:', error);
      return {
        status: false,
        message: 'An error occurred while changing AddFundRequest status',
        error
      };
    }
  };



  exports.executeSellRequest = async (requestId, status) => {
    try {
        // Step 1: Retrieve the requested sell request data
        const sellRequest = await PlatformSellRequest.findById(requestId);
        if (!sellRequest) {
            return {
                status: false,
                message: 'Sell request not found',
            };
        }

        const userId = sellRequest.userId;
        const amount = sellRequest.amount; // Percentage of equity to sell (e.g., 2%)
        
        // Step 2: Fetch user data to get current share price and other details
        const user = await User.findById(userId);
        if (!user) {
            return {
                status: false,
                message: 'User not found',
            };
        }

        const currentShares = user.shares;
        const currentSharePrice = user.price;

        // Step 3: Calculate the amount in shares to be sold
        const sharesToSell = (amount / 100) * currentShares;

        // Step 4: Calculate sale proceeds based on current share price
        const saleProceeds = sharesToSell * currentSharePrice;

        // Step 5: Calculate new share price after selling shares
        const newShares = currentShares - sharesToSell;
        const newSharePrice = newShares > 0 ? saleProceeds / newShares : 0; // Ensure newSharePrice is not NaN

        // Step 6: Update user's share price and shares in User collection
        user.shares = newShares;
        user.price = newSharePrice;
        
        // Step 7: Update status based on input status
        if (status === 'ACCEPTED') {
            // Perform additional actions if status is ACCEPTED (e.g., update other fields)
            // Example: user.updatedAt = new Date();
            // For now, no additional actions specified in the request

            // Log the action
            console.log(`Sell request for user ${userId} accepted.`);
        } else if (status === 'REJECTED') {
            // Update status and possibly other fields if status is REJECTED
            // Example: user.someField = someValue;
            // For now, just update status in the sell request
            sellRequest.status = status;

            // Log the action
            console.log(`Sell request for user ${userId} rejected.`);
        } else {
            return {
                status: false,
                message: 'Invalid status provided',
            };
        }

        // Save changes to both User and PlatformSellRequest collections
        await user.save();
        await sellRequest.save();

        return {
            status: true,
            message: `Sell request executed successfully with status: ${status}`,
            newSharePrice: newSharePrice,
        };
    } catch (error) {
        console.error('Error occurred while executing sell request:', error);
        return {
            status: false,
            message: 'An error occurred while executing sell request',
            error: error,
        };
    }
};



  exports.getPlatformSellRequests = async () => {
    try {
        const platformSellRequestCollection = mongoose.connection.collection('PlatformSellRequest');
        const requests = await platformSellRequestCollection.aggregate([
            {
                $lookup: {
                    from: 'User', // Corrected to match the collection name 'User'
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: {
                    path: '$userData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    amount: 1,
                    status: 1,
                    created: 1,
                    'userData.username': 1,
                    
                    'userData.email': 1,
                    'userData.avatarPath': 1
                }
            }
        ]).toArray();

        return {
            data: requests,
            status: true,
            message: 'Platform Sell Requests retrieved successfully',
        };
    } catch (error) {
        console.error('Error occurred while retrieving Platform Sell Requests:', error);
        return {
            data: null,
            status: false,
            message: 'An error occurred while retrieving Platform Sell Requests',
        };
    }
};
  




exports.getPaymentRequest = async () => {
    try {
        // Access the 'AddFundRequest' collection using Mongoose's existing connection
        const addFundRequestCollection = mongoose.connection.collection('AddFundRequest');

        // Perform the lookup between AddFundRequest and User collections
        const requests = await addFundRequestCollection.aggregate([
            {
                $lookup: {
                    from: 'User', // Name of the 'User' collection
                    localField: 'userId', // Field in 'AddFundRequest' collection
                    foreignField: '_id', // Field in 'User' collection
                    as: 'userData' // Output array field name for user data
                }
            },
            {
                $unwind: {
                    path: '$userData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'PaymentMethod', // Name of the 'PaymentMethod' collection (if needed)
                    localField: 'userData._id', // Field in 'AddFundRequest' collection (through user data)
                    foreignField: 'userId', // Field in 'PaymentMethod' collection
                    as: 'paymentMethodData' // Output array field name for payment method data
                }
            },
            {
                $unwind: {
                    path: '$paymentMethodData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    txnId: 1,
                    amount: 1,
                    status: 1,
                    created: 1,
                    'userData.name': 1,
                    'userData.avatarPath': 1,
                    'paymentMethodData.methodName': 1, // Include payment method data fields as needed
                    'paymentMethodData.accountNumber': 1,
                    'paymentMethodData.expiryDate': 1
                }
            }
        ]).toArray();

    

        return {
            data: requests,
            status: true,
            message: 'Payment requests retrieved successfully',
        };
    } catch (error) {
        console.error('Error occurred while retrieving Payment requests:', error);
        return {
            data: null,
            status: false,
            message: 'An error occurred while retrieving Payment requests',
        };
    }
};



exports.getAllUsers = async () => {
    try {
        const users = await User.find({});
        const usersWithStatus = await Promise.all(users.map(async (user) => {
            const kycDetails = await kycRequest.findOne({userId:user._id})
            const popularProfileEntry = await PopularProfile.findOne({ userId: user._id, status: 1 });
            return {
                ...user.toObject(),
                hasPopularProfile: !!popularProfileEntry,
                kycDetails
            };
        }));

        return {
            data: usersWithStatus,
            status: true,
            message: 'Users retrieved successfully',
        };
    } catch (error) {
        console.error('Error occurred while retrieving users:', error);
        return {
            data: null,
            status: false,
            message: 'An error occurred while retrieving users',
        };
    }
};

exports.makePopularUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const existingProfile = await PopularProfile.findOne({ userId });
        if (existingProfile) {
            existingProfile.status = !existingProfile.status;
            await existingProfile.save()
            return { message: `Popular Profile tag ${existingProfile.status == 1 ? 'restored' : 'removed'} successfully`, success: true, existingProfile };
        }
        const newProfile = new PopularProfile({
            _id: new mongoose.Types.ObjectId(),
            userId,
            status: 1,
        });

        await newProfile.save();
        return { message: 'User added to popular profile', success: true, newProfile };
    } catch (error) {
        console.error('Error occurred while making user Profile Popular:', error);
        return {
            success: false,
            message: 'An error occurred while making user Profile Popular',
        };
    }
};

exports.kycupdate = async (id,status) => {
    try{
        const kyc = await KycRequest.findByIdAndUpdate(
            id,
            [{ $set: { status: status } }],
            { new: true }
        )
        if (!kyc) {
            return { error: 'kyc details not found' }
        }
        return kyc; 
    }catch(error){
        console.error('Error occurred while updating kyc', error);
        return {
            success: false,
            message: JSON.stringify(error),
        };
    }
}

exports.getTransactions = async () => {
    try {
        // Access the 'Transaction' collection using Mongoose's existing connection
        const transactionCollection = mongoose.connection.collection('Transaction');

        // Perform the lookup between Transaction and User collections
        const transactions = await transactionCollection.aggregate([
            {
                $lookup: {
                    from: 'User', // Name of the 'User' collection
                    localField: 'buyer_id', // Field in 'Transaction' collection
                    foreignField: '_id', // Field in 'User' collection
                    as: 'buyerData' // Output array field name for buyer data
                }
            },
            {
                $lookup: {
                    from: 'User', // Name of the 'User' collection
                    localField: 'seller_id', // Field in 'Transaction' collection
                    foreignField: '_id', // Field in 'User' collection
                    as: 'sellerData' // Output array field name for seller data
                }
            },
            {
                $unwind: {
                    path: '$buyerData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$sellerData',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).toArray();


        console.log(transactions)

        return {
            data: transactions,
            status: true,
            message: 'Transactions retrieved successfully',
        };
    } catch (error) {
        console.error('Error occurred while retrieving Transactions:', error);
        return {
            data: null,
            status: false,
            message: 'An error occurred while retrieving Transactions',
        };
    }
};


exports.getWithdrawData = async () => {
    try {
        // Access the 'WithDrawalRequest' collection using Mongoose's existing connection
        const withDrawalRequestCollection = mongoose.connection.collection('WithDrawalRequest');

        // Perform the lookup between WithDrawalRequest and User collections
        const requests = await withDrawalRequestCollection.aggregate([
            {
                $lookup: {
                    from: 'User', // Name of the 'User' collection
                    localField: 'userId', // Field in 'WithDrawalRequest' collection
                    foreignField: '_id', // Field in 'User' collection
                    as: 'userData' // Output array field name for user data
                }
            },
            {
                $unwind: {
                    path: '$userData',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).toArray();

        console.log(requests);

        return {
            data: requests,
            status: true,
            message: 'Withdrawal requests retrieved successfully',
        };
    } catch (error) {
        console.error('Error occurred while retrieving Withdrawal requests:', error);
        return {
            data: null,
            status: false,
            message: 'An error occurred while retrieving Withdrawal requests',
        };
    }
};



exports.getPaymentRequest = async () => {
    try {
        // Access the 'AddFundRequest' collection using Mongoose's existing connection
        const addFundRequestCollection = mongoose.connection.collection('AddFundRequest');

        // Perform the lookup between AddFundRequest and User collections
        const requests = await addFundRequestCollection.aggregate([
            {
                $lookup: {
                    from: 'User', // Name of the 'User' collection
                    localField: 'userId', // Field in 'AddFundRequest' collection
                    foreignField: '_id', // Field in 'User' collection
                    as: 'userData' // Output array field name for user data
                }
            },
            {
                $unwind: {
                    path: '$userData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'PaymentMethod', // Name of the 'PaymentMethod' collection
                    localField: 'userData._id', // Field in 'AddFundRequest' collection (through user data)
                    foreignField: 'userId', // Field in 'PaymentMethod' collection
                    as: 'paymentMethodData' // Output array field name for payment method data
                }
            },
            {
                $unwind: {
                    path: '$paymentMethodData',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).toArray();

        console.log(requests);

        return {
            data: requests,
            status: true,
            message: 'Payment requests retrieved successfully',
        };
    } catch (error) {
        console.error('Error occurred while retrieving Payment requests:', error);
        return {
            data: null,
            status: false,
            message: 'An error occurred while retrieving Payment requests',
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
        { userId: user._id, email: user.email }, process.env.JWTPRIVATEKEY, { expiresIn: "1h" }
    );
    return {
        data: { user, token },
        message: "Login successful"
    }
}

exports.deactivateUser = async (userId) => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            [{ $set: { deactivated: { $not: "$deactivated" } } }],
            { new: true }
        )
        if (!user) {
            return { error: 'user not found' }
        }
        return user;
    } catch (error) {
        throw error;
    }
}