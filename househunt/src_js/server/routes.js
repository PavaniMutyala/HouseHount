import { Router } from "express";
import * as authController from "./controllers/authController";
import * as propertyController from "./controllers/propertyController";
import * as bookingController from "./controllers/bookingController";
import * as favoriteController from "./controllers/favoriteController";
import * as reviewController from "./controllers/reviewController";
import * as adminController from "./controllers/adminController";
import { authenticateToken, requireAdmin } from "./middleware/auth";

const router = Router();

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/profile", authenticateToken, authController.getProfile);
router.put("/auth/profile", authenticateToken, authController.updateProfile);
router.put(
  "/auth/change-password",
  authenticateToken,
  authController.changePassword,
);

// ==========================================
// PROPERTY ROUTES
// ==========================================
router.get("/properties", propertyController.getAllProperties);
router.post(
  "/properties",
  authenticateToken,
  propertyController.createProperty,
);
router.get(
  "/properties/my-properties",
  authenticateToken,
  propertyController.getMyProperties,
);
router.get("/properties/:id", propertyController.getPropertyById);
router.put(
  "/properties/:id",
  authenticateToken,
  propertyController.updateProperty,
);
router.delete(
  "/properties/:id",
  authenticateToken,
  propertyController.deleteProperty,
);

// ==========================================
// BOOKING ROUTES
// ==========================================
router.post("/bookings", authenticateToken, bookingController.createBooking);
router.get("/bookings", authenticateToken, bookingController.getMyBookings);
router.get(
  "/bookings/received",
  authenticateToken,
  bookingController.getReceivedBookings,
);
router.put(
  "/bookings/:id/status",
  authenticateToken,
  bookingController.updateBookingStatus,
);

// ==========================================
// FAVORITE ROUTES
// ==========================================
router.post("/favorites", authenticateToken, favoriteController.toggleFavorite);
router.get("/favorites", authenticateToken, favoriteController.getMyFavorites);

// ==========================================
// REVIEW ROUTES
// ==========================================
router.post("/reviews", authenticateToken, reviewController.addReview);
router.delete("/reviews/:id", authenticateToken, reviewController.deleteReview);

// ==========================================
// ADMIN DASHBOARD ROUTES
// ==========================================
router.get(
  "/admin/stats",
  authenticateToken,
  requireAdmin,
  adminController.getStats,
);
router.get(
  "/admin/bookings",
  authenticateToken,
  requireAdmin,
  adminController.getAllBookings,
);
router.put(
  "/admin/properties/:id/status",
  authenticateToken,
  requireAdmin,
  adminController.updatePropertyStatus,
);
router.get(
  "/admin/users",
  authenticateToken,
  requireAdmin,
  adminController.getAllUsers,
);
router.delete(
  "/admin/users/:id",
  authenticateToken,
  requireAdmin,
  adminController.deleteUser,
);

export default router;
