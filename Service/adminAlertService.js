const AdminAlert = require('../Model/adminAlerts.model');

exports.createAdminAlert = async (adminAlertData) => {
  const adminAlert = new AdminAlert(adminAlertData);
  return await adminAlert.save();
};

exports.getAdminAlerts = async () => {
  return await AdminAlert.find();
};

exports.getAdminAlertById = async (id) => {
  return await AdminAlert.findById(id);
};

exports.updateAdminAlert = async (id, adminAlertData) => {
  return await AdminAlert.findByIdAndUpdate(id, adminAlertData, { new: true });
};

exports.deleteAdminAlert = async (id) => {
  return await AdminAlert.findByIdAndDelete(id);
};
