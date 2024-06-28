const NotificationService = require("../Service/notif.service");

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const notificationData = req.body;
    const result = await NotificationService.createNotification(
      notificationData
    );

    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("An error occurred in createNotification controller:", error);
    return res.status(500).json({
      data: null,
      status: false,
      message: "Internal server error",
    });
  }
};

// Update notification status by notificationId
exports.updateStatus = async (req, res) => {
  try {
    const notificationId = req.body.notificationId;
    const newStatus = req.body.status; // Assuming the new status is passed in the request body

    const result = await NotificationService.updateStatus(
      notificationId,
      newStatus
    );

    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("An error occurred in updateStatus controller:", error);
    return res.status(500).json({
      data: null,
      status: false,
      message: "Internal server error",
    });
  }
};

// Delete a notification by notificationId
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.body.notificationId;
    const result = await NotificationService.deleteNotification(notificationId);

    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("An error occurred in deleteNotification controller:", error);
    return res.status(500).json({
      data: null,
      status: false,
      message: "Internal server error",
    });
  }
};

// Delete all notifications
exports.deleteAllNotifications = async (req, res) => {
  try {
    const result = await NotificationService.deleteAllNotifications();

    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(
      "An error occurred in deleteAllNotifications controller:",
      error
    );
    return res.status(500).json({
      data: null,
      status: false,
      message: "Internal server error",
    });
  }
};

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const result = await NotificationService.getAllNotifications();

    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(
      "An error occurred in getAllNotifications controller:",
      error
    );
    return res.status(500).json({
      data: null,
      status: false,
      message: "Internal server error",
    });
  }
};

// Get notifications by toId
exports.getNotificationsByToId = async (req, res) => {
  try {
    const toId = req.body.toId;
    const result = await NotificationService.getNotificationsByToId(toId);

    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error(
      "An error occurred in getNotificationsByToId controller:",
      error
    );
    return res.status(500).json({
      data: null,
      status: false,
      message: "Internal server error",
    });
  }
};
