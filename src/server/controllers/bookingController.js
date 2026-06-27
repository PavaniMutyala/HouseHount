import { Booking, Property, Notification } from "../../db/db";
import { BookingEmailService } from "../services/emailService";

// Create a property booking
export async function createBooking(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    const { propertyId, moveInDate } = req.body;

    if (!propertyId || !moveInDate) {
      return res
        .status(400)
        .json({ message: "Please specify the property and move-in date." });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    if (!property.availability || property.status !== "approved") {
      return res
        .status(400)
        .json({ message: "This property is not available for booking." });
    }

    // Check if the tenant is booking their own property
    if (property.ownerId === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot book your own property!" });
    }

    // Create the booking
    const newBooking = await Booking.create({
      propertyId,
      tenantId: req.user.id,
      ownerId: property.ownerId,
      bookingDate: new Date().toISOString(),
      moveInDate,
      status: "pending", // Booking starts pending until owner or admin approves
    });

    // Send automated email notifications in background to both guest and host
    BookingEmailService.sendBookingRequestedNotification({
      bookingId: newBooking.id,
      propertyTitle: property.title,
      propertyLocation: `${property.location}, ${property.city}`,
      moveInDate: newBooking.moveInDate,
      price: property.price,
      tenantName: req.user.name || "Valued Guest",
      tenantEmail: req.user.email || "",
      tenantPhone: req.user.phone || "",
      ownerName: property.owner?.name || "Property Host",
      ownerEmail: property.owner?.email || "",
      ownerPhone: property.owner?.phone || "",
    }).catch((err) => {
      console.error("Error sending automated booking request emails:", err);
    });

    // Create admin notification
    await Notification.create({
      type: "booking",
      title: "New Booking Requested",
      message: `${req.user.name || "Tenant"} requested a lease on "${property.title}" for move-in ${moveInDate}.`
    }).catch(err => console.error("Error creating booking notification:", err));

    return res.status(201).json({
      message: "Booking request sent successfully! Owner will review it.",
      booking: newBooking,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error creating booking." });
  }
}

// Get tenant's own bookings history
export async function getMyBookings(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    // Find bookings where tenantId matches
    const bookings = await Booking.find({ tenantId: req.user.id });
    return res.json({ bookings });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error fetching bookings." });
  }
}

// Get bookings received on owner's properties
export async function getReceivedBookings(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    // Find bookings where ownerId matches
    const bookings = await Booking.find({ ownerId: req.user.id });
    return res.json({ bookings });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: error.message || "Server error fetching received bookings.",
      });
  }
}

// Update booking status (owner approving, rejecting, tenant cancelling)
export async function updateBookingStatus(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected' | 'cancelled'

    if (!["approved", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid booking status." });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Authorization checks:
    // - Owner can approve/reject
    // - Tenant can cancel
    // - Admin can do any
    const isOwner = booking.ownerId === req.user.id;
    const isTenant = booking.tenantId === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isTenant && !isAdmin) {
      return res
        .status(403)
        .json({
          message: "Access denied. Unauthorized to manage this booking.",
        });
    }

    if (status === "approved" && !isOwner && !isAdmin) {
      return res
        .status(403)
        .json({
          message: "Only the property owner or an admin can approve bookings.",
        });
    }

    if (status === "rejected" && !isOwner && !isAdmin) {
      return res
        .status(403)
        .json({
          message: "Only the property owner or an admin can reject bookings.",
        });
    }

    if (status === "cancelled" && !isTenant && !isAdmin) {
      return res
        .status(403)
        .json({
          message: "Only the tenant who booked can cancel the booking.",
        });
    }

    const updated = await Booking.findByIdAndUpdate(id, { status });

    // If a booking is approved, optionally make the property unavailable
    if (status === "approved") {
      await Property.findByIdAndUpdate(booking.propertyId, {
        availability: false,
      });

      // Send automated booking confirmation email with full details
      BookingEmailService.sendBookingConfirmedNotification({
        bookingId: booking.id,
        propertyTitle: booking.property?.title || "Rental Listing",
        propertyLocation: booking.property
          ? `${booking.property.location}, ${booking.property.city}`
          : "Unknown Location",
        moveInDate: booking.moveInDate,
        price: booking.property?.price || 0,
        tenantName: booking.tenant?.name || "Valued Guest",
        tenantEmail: booking.tenant?.email || "",
        tenantPhone: booking.tenant?.phone || "",
        ownerName: booking.owner?.name || "Property Host",
        ownerEmail: booking.owner?.email || "",
        ownerPhone: booking.owner?.phone || "",
      }).catch((err) => {
        console.error(
          "Error sending automated booking confirmation emails:",
          err,
        );
      });
    } else if (status === "cancelled" || status === "rejected") {
      await Property.findByIdAndUpdate(booking.propertyId, {
        availability: true,
      });
    }

    return res.json({
      message: `Booking request successfully ${status}!`,
      booking: updated,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: error.message || "Server error updating booking status.",
      });
  }
}
