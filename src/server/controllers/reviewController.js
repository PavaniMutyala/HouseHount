import { Review, Property } from "../../db/db.js";

// Add review for a property
export async function addReview(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    const { propertyId, rating, comment } = req.body;

    if (!propertyId || !rating || !comment) {
      return res
        .status(400)
        .json({ message: "Please provide rating and comment." });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be a number between 1 and 5." });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    const newReview = await Review.create({
      userId: req.user.id,
      propertyId,
      rating: numRating,
      comment,
    });

    return res.status(201).json({
      message: "Review added successfully!",
      review: newReview,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error adding review." });
  }
}

// Delete review
export async function deleteReview(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { id } = req.params;
    const reviews = await Review.find({ id });

    if (reviews.length === 0) {
      return res.status(404).json({ message: "Review not found." });
    }

    const review = reviews[0];

    // Only review owner or admin can delete
    if (review.userId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. You cannot delete this review." });
    }

    await Review.findByIdAndDelete(id);

    return res.json({ message: "Review deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error deleting review." });
  }
}
