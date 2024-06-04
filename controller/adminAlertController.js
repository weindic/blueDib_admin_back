const adminAlertService = require('../Service/adminAlertService');

exports.createAdminAlert = async (req, res) => {
  try {
    const adminAlert = await adminAlertService.createAdminAlert(req.body);
    res.status(201).json(adminAlert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminAlerts = async (req, res) => {
  try {
    const adminAlerts = await adminAlertService.getAdminAlerts();
    res.status(200).json(adminAlerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminAlertById = async (req, res) => {
  try {
    const adminAlert = await adminAlertService.getAdminAlertById(req.params.id);
    if (!adminAlert) {
      return res.status(404).json({ message: 'AdminAlert not found' });
    }
    res.status(200).json(adminAlert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAdminAlert = async (req, res) => {
  try {
    const adminAlert = await adminAlertService.updateAdminAlert(req.params.id, req.body);
    if (!adminAlert) {
      return res.status(404).json({ message: 'AdminAlert not found' });
    }
    res.status(200).json(adminAlert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAdminAlert = async (req, res) => {
  try {
    const adminAlert = await adminAlertService.deleteAdminAlert(req.params.id);
    if (!adminAlert) {
      return res.status(404).json({ message: 'AdminAlert not found' });
    }
    res.status(200).json({ message: 'AdminAlert deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
