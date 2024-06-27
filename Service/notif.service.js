const Notification = require("../Model/notif.model");

// Create a new notification
exports.createNotification = async (req) => {
  try {
    const notifData = {
      title: req.title,

      to: req.toId,

      linkId: req.linkId,

      type: req.type,
    };

    const newNotification = new Notification(notifData);
    const savedNotification = await newNotification.save();

    return {
      data: savedNotification,
      status: true,
      message: "Notification created successfully",
    };
  } catch (error) {
    console.error("An error occurred in createNotification service:", error);
    return {
      data: null,
      status: false,
      message: "Internal server error",
    };
  }
};

// Update notification status by notificationId
exports.updateStatus = async (notificationId, newStatus) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { status: newStatus, updatedAt: new Date().toISOString() },
      { new: true }
    );

    if (!notification) {
      return {
        data: null,
        status: false,
        message: "Notification not found",
      };
    }

    return {
      data: notification,
      status: true,
      message: "Notification status updated successfully",
    };
  } catch (error) {
    console.error("An error occurred in updateStatus service:", error);
    return {
      data: null,
      status: false,
      message: "Internal server error",
    };
  }
};

// Delete a notification by notificationId
exports.deleteNotification = async (notificationId) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );

    if (!deletedNotification) {
      return {
        data: null,
        status: false,
        message: "Notification not found",
      };
    }

    return {
      data: deletedNotification,
      status: true,
      message: "Notification deleted successfully",
    };
  } catch (error) {
    console.error("An error occurred in deleteNotification service:", error);
    return {
      data: null,
      status: false,
      message: "Internal server error",
    };
  }
};

// Delete all notifications
exports.deleteAllNotifications = async () => {
  try {
    await Notification.deleteMany();

    return {
      data: null,
      status: true,
      message: "All notifications deleted successfully",
    };
  } catch (error) {
    console.error(
      "An error occurred in deleteAllNotifications service:",
      error
    );
    return {
      data: null,
      status: false,
      message: "Internal server error",
    };
  }
};

// Get all notifications
exports.getAllNotifications = async () => {
  try {
    const notifications = await Notification.find();

    return {
      data: notifications,
      status: true,
      message: "Notifications retrieved successfully",
    };
  } catch (error) {
    console.error("An error occurred in getAllNotifications service:", error);
    return {
      data: null,
      status: false,
      message: "Internal server error",
    };
  }
};

// Get notifications by toId
exports.getNotificationsByToId = async (toId) => {
  try {
    const notifications = await Notification.find({ to: toId });

    return {
      data: notifications,
      status: true,
      message: "Notifications retrieved successfully",
    };
  } catch (error) {
    console.error(
      "An error occurred in getNotificationsByToId service:",
      error
    );
    return {
      data: null,
      status: false,
      message: "Internal server error",
    };
  }
};
