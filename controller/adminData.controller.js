const Service = require("../Service/adminData.service");




exports.addAdmin = async (req, res) => {
  const {  email, name,  phone, role} = req.body;
  let responseData = {};

  if (!name || !email || !phone || !role) {
    responseData = {
      data: null,
      status: false,
      message: "Please fill the data properly",
    };

    return res.send(responseData);
  }
  const data = await Service.addAdmin(req.body);
  console.log(data);

  return res.send(data);

};


// admin login
exports.userLogin =  async (req, res) => {
    try {
    const { email, password } = req.body;
    const token = await Service.loginAdmin(email, password);

    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }

}



// getAll admins
exports.getAllAdmins = async (req, res) => {
  try {
    const data = await Service.getAllAdmins();
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


// get single admin data==========//

exports.getAdminById = async (req, res) => {
  try {
    const adminId = req.body.id;
    const data = await Service.getAdminById(adminId);
    return res.status(200).json(data);
  } catch (error) {
    console.error("An error occurred in getAdminById controller:", error);
    return res.status(500).json({
      data: null,
      status: false,
      message: "Internal server error",
    });
  }
};



// update single data=========//

exports.updateAdmin = async (req, res) => {
  try {
    const adminId = req.body.id;
    const updateData = req.body;
    const data = await Service.updateAdmin(adminId, updateData);
    return res.status(200).json(data);
  } catch (error) {
    console.error("An error occurred in updateAdmin controller:", error);
    return res.status(500).json({
      data: null,
      status: false,
      message: "Internal server error",
    });
  }
};


// deactivate data=======//

exports.deactivateAdmin = async (req, res) => {
  try {
    const adminId = req.body.id;
    const data = await Service.deactivateAdmin(adminId);
    return res.status(200).json(data);
  } catch (error) {
    console.error("An error occurred in deactivateAdmin controller:", error);
    return res.status(500).json({
      data: null,
      status: false,
      message: "Internal server error",
    });
  }
};


// delete data===========//

exports.deleteAdmin = async (req, res) => {
  try {
    const adminId = req.body.id;
    const data = await Service.deleteAdmin(adminId);
    return res.status(200).json(data);
  } catch (error) {
    console.error("An error occurred in deleteAdmin controller:", error);
    return res.status(500).json({
      data: null,
      status: false,
      message: "Internal server error",
    });
  }
};


exports.getMasterData = async (req,res)=>{
  try{
    const result = await Service.masterData();
    return res.status(200).send({result});
  }catch(err){
    console.log(err);
    return res.status(500).json({
      data: null,
      status: false,
      message:err.error,
    });
  }
}





