import { Favorite, Property } from "../../db/db";

// Toggle favorite status of a property
export async function toggleFavorite(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ message: "Please provide a property ID." });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    // Check if already favorited
    const existing = await Favorite.find({ userId: req.user.id, propertyId });

    if (existing.length > 0) {
      // Remove from favorites
      await Favorite.findOneAndDelete({ userId: req.user.id, propertyId });
      return res.json({
        message: "Property removed from favorites.",
        isFavorite: false,
      });
    } else {
      // Add to favorites
      await Favorite.create({ userId: req.user.id, propertyId });
      return res.status(201).json({
        message: "Property added to favorites!",
        isFavorite: true,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error managing favorites." });
  }
}

// Get user's favorites
export async function getMyFavorites(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const favorites = await Favorite.find({ userId: req.user.id });
    // Filter out null properties (e.g. if property was deleted)
    const validFavorites = favorites.filter((f) => f.property !== null);

    return res.json({ favorites: validFavorites });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error fetching favorites." });
  }
}
