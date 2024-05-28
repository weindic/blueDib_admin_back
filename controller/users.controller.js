const Service = require("../Service/users.service");
const chatService = require("../Service/chat.service");

// users controller=======================//

// getAll admins
exports.getAllUsers = async (req, res) => {
    try {
      const data = await Service.getAllUsers();
      return res.status(200).json(data);
    } catch (error) {
      console.error("An error occurred in getAllAdmins controller:", error);
      return res.status(500).json({
        data: null,
        status: false,
        message: "Internal server error",
      });
    }
  };


  exports.getTransactions = async (req, res) => {
    try {
      const data = await Service.getTransactions();
      return res.status(200).json(data);
    } catch (error) {
      console.error("An error occurred in getAllAdmins controller:", error);
      return res.status(500).json({
        data: null,
        status: false,
        message: "Internal server error",
      });
    }
  };


  exports.getWithdrawData = async (req, res) => {
    try {
      const data = await Service.getWithdrawData();
      return res.status(200).json(data);
    } catch (error) {
      console.error("An error occurred in getAllAdmins controller:", error);
      return res.status(500).json({
        data: null,
        status: false,
        message: "Internal server error",
      });
    }
  };


  exports.getPaymentRequest = async (req, res) => {
    try {
      const data = await Service.getPaymentRequest();
      return res.status(200).json(data);
    } catch (error) {
      console.error("An error occurred in getAllAdmins controller:", error);
      return res.status(500).json({
        data: null,
        status: false,
        message: "Internal server error",
      });
    }
  };




  // ============chat function =================//

  exports.enableChat = async (req, res) => {
    try {
      const data = await chatService.enableChat(req, res);
      return res.status(200).json(data);
    } catch (error) {
      console.error("An error occurred in getAllAdmins controller:", error);
      return res.status(500).json({
        data: null,
        status: false,
        message: "Internal server error",
      });
    }
  };


  exports.getChat = async (req, res) => {
    try {
      const data = await chatService.getSingleDataByUser(req, res);
      return res.status(200).json(data);
    } catch (error) {
      console.error("An error occurred in getAllAdmins controller:", error);
      return res.status(500).json({
        data: null,
        status: false,
        message: "Internal server error",
      });
    }
  };

  exports.loginController = async (req, res) => {
    try {
        const result = await Service.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "Email and password are required!") {
            res.status(400).json({ message: error.message });
        } else if (error.message === "User doesn't exist" || error.message === "Invalid password") {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

exports.deactivateUser = async(req, res) => {
  const {id} = req.body;
  try {
    const user = await Service.deactivateUser(id);
    res.status(200).json({ status: true, message:user.error??`User ${user.deactivated?'deactivated':'activated'} successfully`, data: user });
  } catch(error){
    res.status(400).json({ status: false, message: error.message });
  }
}

exports.makePopularUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
      const result = await Service.makePopularUser(userId);
      return res.status(200).json(result);
  } catch (error) {
      console.error('Error in making user VIP:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};