import { Property, Review } from "../../db/db";

// Create a new property listing
export async function createProperty(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    const {
      title,
      description,
      location,
      city,
      state,
      country,
      price,
      bedrooms,
      bathrooms,
      kitchen,
      parking,
      area,
      propertyType,
      amenities,
      images,
    } = req.body;

    // Validate fields
    if (
      !title ||
      !description ||
      !location ||
      !city ||
      !state ||
      !country ||
      !price ||
      !bedrooms ||
      !bathrooms ||
      !area ||
      !propertyType
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    const numPrice = Number(price);
    const numBedrooms = Number(bedrooms);
    const numBathrooms = Number(bathrooms);
    const numArea = Number(area);

    if (isNaN(numPrice) || numPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number." });
    }

    // Default high-quality property placeholder images if none provided
    const propertyImages =
      images && images.length > 0
        ? images
        : [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
          ];

    const newProperty = await Property.create({
      ownerId: req.user.id,
      title,
      description,
      location,
      city,
      state,
      country,
      price: numPrice,
      bedrooms: numBedrooms,
      bathrooms: numBathrooms,
      kitchen: !!kitchen,
      parking: !!parking,
      area: numArea,
      propertyType,
      amenities: Array.isArray(amenities) ? amenities : [],
      images: propertyImages,
      availability: true,
      status: "pending", // Listings need admin approval by default
    });

    return res.status(201).json({
      message:
        "Property posted successfully! It will be live after admin approval.",
      property: newProperty,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error creating property." });
  }
}

// Get all properties with advanced filters
export async function getAllProperties(req, res) {
  try {
    const {
      search,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      propertyType,
      availability,
      sort,
    } = req.query;

    let properties = await Property.find();

    // Filters

    // 1. Approved status only for public listings (unless user is admin, but let's default to approved for public search)
    // We'll let admin see all via admin route or a toggle, let's keep public search restricted to approved.
    properties = properties.filter((p) => p.status === "approved");

    // 2. Search / Location search (title, description, location)
    if (search) {
      const q = String(search).toLowerCase();
      properties = properties.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q),
      );
    }

    // 3. City filter
    if (city && city !== "all") {
      const c = String(city).toLowerCase();
      properties = properties.filter((p) => p.city.toLowerCase() === c);
    }

    // 4. Property Type
    if (propertyType && propertyType !== "all") {
      const pt = String(propertyType).toLowerCase();
      properties = properties.filter(
        (p) => p.propertyType.toLowerCase() === pt,
      );
    }

    // 5. Price range
    if (minPrice) {
      properties = properties.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      properties = properties.filter((p) => p.price <= Number(maxPrice));
    }

    // 6. Bedrooms
    if (bedrooms && bedrooms !== "any") {
      properties = properties.filter((p) => p.bedrooms >= Number(bedrooms));
    }

    // 7. Bathrooms
    if (bathrooms && bathrooms !== "any") {
      properties = properties.filter((p) => p.bathrooms >= Number(bathrooms));
    }

    // 8. Availability
    if (availability === "true") {
      properties = properties.filter((p) => p.availability === true);
    }

    // Sort options
    if (sort === "price_asc") {
      properties.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      properties.sort((a, b) => b.price - a.price);
    } else {
      // Default: Newest first
      properties.sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
      );
    }

    return res.json({ properties });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error fetching properties." });
  }
}

// Get single property details
export async function getPropertyById(req, res) {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    // Fetch related properties (same city or type, excluding current one)
    const all = await Property.find();
    const related = all
      .filter(
        (p) =>
          p.status === "approved" &&
          p.id !== id &&
          (p.city === property.city ||
            p.propertyType === property.propertyType),
      )
      .slice(0, 3);

    // Fetch reviews for this property
    const reviews = await Review.find({ propertyId: id });

    return res.json({
      property,
      reviews,
      relatedProperties: related,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: error.message || "Server error fetching property details.",
      });
  }
}

// Update property
export async function updateProperty(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    // Only owner or admin can update
    if (property.ownerId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. You do not own this property." });
    }

    const updated = await Property.findByIdAndUpdate(id, req.body);

    return res.json({
      message: "Property listing updated successfully!",
      property: updated,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error updating property." });
  }
}

// Delete property
export async function deleteProperty(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    // Only owner or admin can delete
    if (property.ownerId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. You do not own this property." });
    }

    await Property.findByIdAndDelete(id);

    return res.json({ message: "Property listing deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error deleting property." });
  }
}

// Get user's own listed properties
export async function getMyProperties(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const all = await Property.find();
    // Filter specifically by ownerId, including pending/approved/rejected statuses
    const myProps = all.filter((p) => p.ownerId === req.user.id);

    return res.json({ properties: myProps });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: error.message || "Server error fetching your properties.",
      });
  }
}
