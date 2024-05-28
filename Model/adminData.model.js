const mongoose = require("mongoose");
const AdminDataSchema = new mongoose.Schema({

  email: {
    type: String,
    unique:true
  },
  profile : {
    type: String,
  },
  name: {
    type: String,
  },

  phone: {
    type: Number,
  },

password:{
  type: String,
},

  loginHistory:{
    type:Array
  },

  role:{
    type: String, //true - false only
  },

  status:{
    type: String,
  },
  token:{
    type:String
  },


  createdAt: {
    type: String,
  },

  updatedAt: {
    type: String,
  },
});

module.exports = mongoose.model("adminData", AdminDataSchema);
