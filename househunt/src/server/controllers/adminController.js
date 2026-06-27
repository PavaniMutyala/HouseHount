import { User, Property, Booking, PlatformStatistics, Notification } from "../../db/db";

// Fetch platform metrics & statistics
export async function getStats(req, res) {
  try {
    const stats = await PlatformStatistics.getStats();

    // Fetch lists of recent users and recent property listings to populate dashboard
    const allUsers = await User.find();
    const sortedUsers = [...allUsers]
      .sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
      )
      .slice(0, 5)
      .map(({ passwordHash, ...safeUser }) => safeUser);

    const allProps = await Property.find();
    const sortedProps = [...allProps]
      .sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
      )
      .slice(0, 5);

    return res.json({
      stats,
      recentUsers: sortedUsers,
      recentProperties: sortedProps,
      allProperties: allProps,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error loading stats." });
  }
}

// Get all bookings on the platform
export async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find();
    return res.json({ bookings });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: error.message || "Server error fetching platform bookings.",
      });
  }
}

// Manage property status (approve/reject)
export async function updatePropertyStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected' | 'pending'

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid listing status." });
    }

    const updated = await Property.findByIdAndUpdate(id, { status });

    if (!updated) {
      return res.status(404).json({ message: "Property not found." });
    }

    return res.json({
      message: `Property listing successfully ${status}!`,
      property: updated,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message:
          error.message || "Server error updating property listing status.",
      });
  }
}

// Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    const safeUsers = users.map(({ passwordHash, ...safeUser }) => safeUser);
    return res.json({ users: safeUsers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error loading users." });
  }
}

// Delete user from platform
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Prevent self deletion
    if (req.user && req.user.id === id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own admin account." });
    }

    const success = await User.findByIdAndDelete(id);
    if (!success) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      message: "User account and associated records deleted successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error deleting user." });
  }
}

// Get admin notifications
export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find();
    return res.json({ notifications });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error loading notifications." });
  }
}

// Mark a notification as read
export async function markNotificationRead(req, res) {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(id, { read: true });
    if (!updated) {
      return res.status(404).json({ message: "Notification not found." });
    }
    return res.json({ message: "Notification marked as read.", notification: updated });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error updating notification." });
  }
}

// Clear all notifications
export async function clearAllNotifications(req, res) {
  try {
    await Notification.deleteMany();
    return res.json({ message: "All notifications cleared successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error clearing notifications." });
  }
}
