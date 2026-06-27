import fs from "fs/promises";
import path from "path";
import mongoose, { Schema } from "mongoose";

// Local database path
const DB_FILE = path.join(process.cwd(), "src", "db", "db.json");

// Interface declarations matching user model requirements

// Initial seed data to make the app look like a real production platform instantly
const INITIAL_DATABASE = {
  users: [
    {
      id: "admin-1",
      name: "Sarah Jenkins",
      email: "admin@househunt.com",
      phone: "+91 9876543210",
      passwordHash:
        "$2a$10$f3DInWv694bH9x92YpI6nOQ34n0T3I4F1p2yY1n/Z7N88yJ/l1iK6", // Admin123!
      role: "admin",
      profileImage:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      address: "742 Jubilee Hills, Hyderabad",
      createdDate: new Date("2026-01-15T08:30:00Z").toISOString(),
    },
    {
      id: "user-1",
      name: "Alex Rivera",
      email: "tenant@househunt.com",
      phone: "+91 9988776655",
      passwordHash:
        "$2a$10$p0Y9OUnL4Z6R/Yn1uKzTgu75tIcoEBe4Y6v0N2zVz8gN1Lh71YF9q", // User123!
      role: "user",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      address: "Indiranagar, Bangalore",
      createdDate: new Date("2026-02-10T11:15:00Z").toISOString(),
    },
    {
      id: "user-2",
      name: "Emily Watson",
      email: "emily@househunt.com",
      phone: "+91 9123456789",
      passwordHash:
        "$2a$10$p0Y9OUnL4Z6R/Yn1uKzTgu75tIcoEBe4Y6v0N2zVz8gN1Lh71YF9q", // User123!
      role: "user",
      profileImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      address: "Gachibowli, Hyderabad",
      createdDate: new Date("2026-03-01T14:20:00Z").toISOString(),
    },
  ],
  properties: [
    {
      id: "prop-1",
      ownerId: "user-2",
      title: "Executive 1 BHK Studio Room near DLF",
      description:
        "Super clean, fully furnished 1 BHK Studio Room located in Gachibowli, Hyderabad. Comes with high-speed WiFi, modern work desk, air conditioning, microwave, smart TV, and attached private washroom. Perfect for IT professionals working in DLF Cybercity, Gachibowli or HITEC City.",
      location: "DLF Road, Gachibowli",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      price: 14500,
      bedrooms: 1,
      bathrooms: 1,
      kitchen: true,
      parking: true,
      area: 650,
      propertyType: "Apartment",
      amenities: [
        "WiFi",
        "Air Conditioning",
        "Workspace",
        "Smart TV",
        "Housekeeping",
        "Power Backup",
      ],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      ],
      availability: true,
      status: "approved",
      createdDate: new Date("2026-04-10T10:00:00Z").toISOString(),
    },
    {
      id: "prop-2",
      ownerId: "user-2",
      title: "Luxury 3 BHK Penthouse with City View",
      description:
        "Stunning, ultra-modern 3 BHK penthouse located in premium Jubilee Hills, Hyderabad. Features open-concept timber ceilings, private garden terrace with panoramic city views, modern modular kitchen with gas and stove, 3 attached spa-like luxury bathrooms, and automatic biometric lock. Walking distance to premium cafes and metro station.",
      location: "Road No. 36, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      price: 48000,
      bedrooms: 3,
      bathrooms: 3,
      kitchen: true,
      parking: true,
      area: 2400,
      propertyType: "Penthouse",
      amenities: [
        "WiFi",
        "Air Conditioning",
        "Rooftop Terrace",
        "City View",
        "Private Security",
        "Modular Kitchen",
        "Gym Access",
      ],
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
      ],
      availability: true,
      status: "approved",
      createdDate: new Date("2026-04-12T09:30:00Z").toISOString(),
    },
    {
      id: "prop-3",
      ownerId: "admin-1",
      title: "Premium Fully Furnished 2 BHK Flat",
      description:
        "Spacious 2 BHK home in a quiet community in Banjara Hills, Hyderabad. Offers premium woodwork, private balcony, power backup, high-speed lift, 24/7 security, geysers, modular cupboards, and dedicated parking. Easy commute to IT parks and popular malls.",
      location: "Road No. 12, Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      price: 29000,
      bedrooms: 2,
      bathrooms: 2,
      kitchen: true,
      parking: true,
      area: 1350,
      propertyType: "Apartment",
      amenities: [
        "WiFi",
        "Air Conditioning",
        "Balcony",
        "Power Backup",
        "Lift",
        "Geyser",
        "Security",
      ],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
      ],
      availability: true,
      status: "approved",
      createdDate: new Date("2026-04-20T14:00:00Z").toISOString(),
    },
    {
      id: "prop-4",
      ownerId: "user-1",
      title: "Co-living Shared Room for Professionals",
      description:
        "Well-managed co-living PG room for single or shared occupancy in Madhapur, Hyderabad. Includes daily healthy meals, housekeeping, high-speed WiFi, water purifiers, washing machines, and common gaming zone. Perfect and cost-effective room for tech interns or corporate freshers.",
      location: "Kavuri Hills, Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      price: 11000,
      bedrooms: 1,
      bathrooms: 1,
      kitchen: false,
      parking: true,
      area: 400,
      propertyType: "Room",
      amenities: [
        "WiFi",
        "Food Included",
        "Housekeeping",
        "Laundry",
        "RO Water",
        "Power Backup",
      ],
      images: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      ],
      availability: true,
      status: "approved",
      createdDate: new Date("2026-05-02T16:15:00Z").toISOString(),
    },
    {
      id: "prop-5",
      ownerId: "user-2",
      title: "Charming Garden 3 BHK Flat in Kondapur",
      description:
        "Stunning 3 BHK flat opposite Botanical Garden, Kondapur, Hyderabad. Features large balconies, high-speed lift, gym access, power backup, dedicated 2-car covered parking, and 24/7 gated security. Beautiful views and fresh air with proximity to HITEC City.",
      location: "Botanical Garden Road, Kondapur",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      price: 37000,
      bedrooms: 3,
      bathrooms: 3,
      kitchen: true,
      parking: true,
      area: 1800,
      propertyType: "Apartment",
      amenities: [
        "WiFi",
        "Air Conditioning",
        "Garden View",
        "Gym",
        "Gated Security",
        "Lift",
        "Power Backup",
      ],
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      ],
      availability: true,
      status: "approved",
      createdDate: new Date("2026-05-05T12:00:00Z").toISOString(),
    },
    {
      id: "prop-6",
      ownerId: "user-2",
      title: "Trendy 2 BHK Flat near Indiranagar",
      description:
        "Charming, well-ventilated 2 BHK flat in Bangalore's trendiest area, Indiranagar. Features elegant wooden floors, cozy living area, spacious closets, and close proximity to top corporate parks and Indiranagar Metro.",
      location: "100 Feet Road, Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      price: 34000,
      bedrooms: 2,
      bathrooms: 2,
      kitchen: true,
      parking: true,
      area: 1200,
      propertyType: "Apartment",
      amenities: [
        "WiFi",
        "Air Conditioning",
        "Balcony",
        "Wooden Floors",
        "Gated Parking",
        "Metro Connectivity",
      ],
      images: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      ],
      availability: true,
      status: "approved",
      createdDate: new Date("2026-05-06T11:00:00Z").toISOString(),
    },
    {
      id: "prop-7",
      ownerId: "user-2",
      title: "Luxury Sea-Facing 2 BHK Flat",
      description:
        "Stunning 2 BHK apartment with gorgeous direct view of the sea in Bandra, Mumbai. Features premium modular structure, double balconies, fully air-conditioned, high-end design, secure society, and secure car parking.",
      location: "Carter Road, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      price: 68000,
      bedrooms: 2,
      bathrooms: 2,
      kitchen: true,
      parking: true,
      area: 1100,
      propertyType: "Apartment",
      amenities: [
        "WiFi",
        "Air Conditioning",
        "Sea View",
        "Balcony",
        "Gated Society",
        "Elevator",
      ],
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      ],
      availability: true,
      status: "approved",
      createdDate: new Date("2026-05-07T15:00:00Z").toISOString(),
    },
  ],
  bookings: [
    {
      id: "book-1",
      propertyId: "prop-1",
      tenantId: "user-1",
      ownerId: "user-2",
      bookingDate: new Date("2026-05-10T10:00:00Z").toISOString(),
      moveInDate: "2026-07-01",
      status: "approved",
    },
  ],
  favorites: [
    {
      id: "fav-1",
      userId: "user-1",
      propertyId: "prop-1",
    },
  ],
  reviews: [
    {
      id: "rev-1",
      userId: "user-1",
      propertyId: "prop-1",
      rating: 5,
      comment:
        "An absolutely breathtaking experience. Very neat and close to the main road. The host was incredibly responsive and accommodated all of our special requests. Highly recommend!",
      date: new Date("2026-05-25T14:30:00Z").toISOString(),
    },
  ],
};

// Check if MongoDB should be used (MERN Stack support)
const MONGODB_URI = process.env.MONGODB_URI;
let useMongo = false;

// Mongoose Schemas & Models definition
const MongoUserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profileImage: { type: String, default: "" },
  address: { type: String, default: "" },
  createdDate: { type: String, default: () => new Date().toISOString() },
});

const MongoPropertySchema = new Schema({
  ownerId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  location: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "" },
  price: { type: Number, required: true },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  kitchen: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  area: { type: Number, default: 0 },
  propertyType: { type: String, default: "Apartment" },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] },
  availability: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdDate: { type: String, default: () => new Date().toISOString() },
});

const MongoBookingSchema = new Schema({
  propertyId: { type: String, required: true },
  tenantId: { type: String, required: true },
  ownerId: { type: String, required: true },
  bookingDate: { type: String, default: () => new Date().toISOString() },
  moveInDate: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending",
  },
});

const MongoFavoriteSchema = new Schema({
  userId: { type: String, required: true },
  propertyId: { type: String, required: true },
});

const MongoReviewSchema = new Schema({
  userId: { type: String, required: true },
  propertyId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, default: "" },
  date: { type: String, default: () => new Date().toISOString() },
});

// Compile Mongoose Models (Casted as any to circumvent TS type constraints on complex query builder chaining)
export const MongoUser =
  mongoose.models.User || mongoose.model("User", MongoUserSchema);
export const MongoProperty =
  mongoose.models.Property || mongoose.model("Property", MongoPropertySchema);
export const MongoBooking =
  mongoose.models.Booking || mongoose.model("Booking", MongoBookingSchema);
export const MongoFavorite =
  mongoose.models.Favorite || mongoose.model("Favorite", MongoFavoriteSchema);
export const MongoReview =
  mongoose.models.Review || mongoose.model("Review", MongoReviewSchema);

// Mapper utility for Mongoose -> JSON compatibility
function mapDoc(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

// Helper to identify if MONGODB_URI is a placeholder or invalid format
const isPlaceholderUri = (uri) => {
  if (!uri) return true;
  const cleaned = uri.trim().toLowerCase();
  return (
    cleaned === "" ||
    cleaned === "123" ||
    cleaned === "placeholder" ||
    cleaned.includes("your_") ||
    cleaned.includes("<username>") ||
    (!cleaned.startsWith("mongodb://") && !cleaned.startsWith("mongodb+srv://"))
  );
};

if (!isPlaceholderUri(MONGODB_URI)) {
  console.log(
    "MONGODB_URI detected with valid format. Initializing connection to MongoDB...",
  );
  mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      console.log("Successfully connected to MongoDB!");
      useMongo = true;
      // Auto-seed MongoDB with initial data if empty to ensure instant dynamic content
      try {
        const userCount = await MongoUser.countDocuments().exec();
        if (userCount === 0) {
          console.log("MongoDB is empty. Seeding initial MERN stack data...");
          // Keep a map of original IDs to new seeded IDs
          const idMap = {};

          // Seed Users
          for (const user of INITIAL_DATABASE.users) {
            const newUser = new MongoUser({
              name: user.name,
              email: user.email,
              phone: user.phone,
              passwordHash: user.passwordHash,
              role: user.role,
              profileImage: user.profileImage,
              address: user.address,
              createdDate: user.createdDate,
            });
            await newUser.save();
            idMap[user.id] = newUser._id.toString();
          }

          // Seed Properties
          for (const prop of INITIAL_DATABASE.properties) {
            const newProp = new MongoProperty({
              ownerId: idMap[prop.ownerId] || prop.ownerId,
              title: prop.title,
              description: prop.description,
              location: prop.location,
              city: prop.city,
              state: prop.state,
              country: prop.country,
              price: prop.price,
              bedrooms: prop.bedrooms,
              bathrooms: prop.bathrooms,
              kitchen: prop.kitchen,
              parking: prop.parking,
              area: prop.area,
              propertyType: prop.propertyType,
              amenities: prop.amenities,
              images: prop.images,
              availability: prop.availability,
              status: prop.status,
              createdDate: prop.createdDate,
            });
            await newProp.save();
            idMap[prop.id] = newProp._id.toString();
          }

          // Seed Bookings
          for (const b of INITIAL_DATABASE.bookings) {
            const newBooking = new MongoBooking({
              propertyId: idMap[b.propertyId] || b.propertyId,
              tenantId: idMap[b.tenantId] || b.tenantId,
              ownerId: idMap[b.ownerId] || b.ownerId,
              bookingDate: b.bookingDate,
              moveInDate: b.moveInDate,
              status: b.status,
            });
            await newBooking.save();
          }

          // Seed Favorites
          for (const fav of INITIAL_DATABASE.favorites) {
            const newFav = new MongoFavorite({
              userId: idMap[fav.userId] || fav.userId,
              propertyId: idMap[fav.propertyId] || fav.propertyId,
            });
            await newFav.save();
          }

          // Seed Reviews
          for (const r of INITIAL_DATABASE.reviews) {
            const newReview = new MongoReview({
              userId: idMap[r.userId] || r.userId,
              propertyId: idMap[r.propertyId] || r.propertyId,
              rating: r.rating,
              comment: r.comment,
              date: r.date,
            });
            await newReview.save();
          }
          console.log("Seeding completed successfully!");
        }
      } catch (err) {
        console.warn("Warning during MongoDB seeding:", err);
      }
    })
    .catch((err) => {
      console.warn(
        "Notice: Could not connect to MongoDB, falling back to local JSON DB. Reason:",
        err.message || err,
      );
      useMongo = false;
    });
} else {
  console.log(
    'MongoDB connection skipped: MONGODB_URI is empty, invalid, or placeholder ("' +
      (MONGODB_URI || "") +
      '"). Operating with the local JSON database engine.',
  );
  useMongo = false;
}

// Database utility class to load, read, and write schema (JSON DB Manager)
class DatabaseManager {
  cache = null;
  initializing = null;

  async init() {
    if (this.cache) return this.cache;
    if (this.initializing) return this.initializing;

    this.initializing = (async () => {
      try {
        await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
        try {
          const content = await fs.readFile(DB_FILE, "utf-8");
          const data = JSON.parse(content);
          // Ensure structure compatibility
          this.cache = {
            users: data.users || [],
            properties: data.properties || [],
            bookings: data.bookings || [],
            favorites: data.favorites || [],
            reviews: data.reviews || [],
          };
        } catch {
          // If file not found or corrupted, write the initial seed database
          await fs.writeFile(
            DB_FILE,
            JSON.stringify(INITIAL_DATABASE, null, 2),
            "utf-8",
          );
          this.cache = JSON.parse(JSON.stringify(INITIAL_DATABASE));
        }
        return this.cache;
      } catch (error) {
        console.error("Failed to initialize database file:", error);
        this.cache = JSON.parse(JSON.stringify(INITIAL_DATABASE));
        return this.cache;
      } finally {
        this.initializing = null;
      }
    })();

    return this.initializing;
  }

  async save(data) {
    this.cache = data;
    try {
      await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving database to file:", err);
    }
  }
}

const dbManager = new DatabaseManager();

// Mongoose-like Active Record style Models with Seamless MongoDB delegation
export class User {
  static async find() {
    if (useMongo) {
      const users = await MongoUser.find().exec();
      return users.map((u) => mapDoc(u));
    }
    const db = await dbManager.init();
    return db.users;
  }

  static async findOne(query) {
    if (useMongo) {
      const mQuery = { ...query };
      if (mQuery.id) {
        mQuery._id = mQuery.id;
        delete mQuery.id;
      }
      const user = await MongoUser.findOne(mQuery).exec();
      return mapDoc(user);
    }
    const db = await dbManager.init();
    const keys = Object.keys(query);
    const user = db.users.find((u) => keys.every((k) => u[k] === query[k]));
    return user || null;
  }

  static async findById(id) {
    if (useMongo) {
      try {
        const user = await MongoUser.findById(id).exec();
        return mapDoc(user);
      } catch {
        return null;
      }
    }
    const db = await dbManager.init();
    return db.users.find((u) => u.id === id) || null;
  }

  static async create(userData) {
    if (useMongo) {
      const user = new MongoUser({
        ...userData,
        createdDate: new Date().toISOString(),
      });
      await user.save();
      return mapDoc(user);
    }
    const db = await dbManager.init();
    const newUser = {
      ...userData,
      id: "user-" + Date.now() + Math.random().toString(36).substring(2, 6),
      createdDate: new Date().toISOString(),
    };
    db.users.push(newUser);
    await dbManager.save(db);
    return newUser;
  }

  static async findByIdAndUpdate(id, update) {
    if (useMongo) {
      try {
        const user = await MongoUser.findByIdAndUpdate(id, update, {
          new: true,
        }).exec();
        return mapDoc(user);
      } catch {
        return null;
      }
    }
    const db = await dbManager.init();
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    db.users[index] = { ...db.users[index], ...update };
    await dbManager.save(db);
    return db.users[index];
  }

  static async findByIdAndDelete(id) {
    if (useMongo) {
      try {
        const res = await MongoUser.findByIdAndDelete(id).exec();
        return !!res;
      } catch {
        return false;
      }
    }
    const db = await dbManager.init();
    const originalLength = db.users.length;
    db.users = db.users.filter((u) => u.id !== id);
    if (db.users.length !== originalLength) {
      await dbManager.save(db);
      return true;
    }
    return false;
  }
}

export class Property {
  static async find(query = {}) {
    if (useMongo) {
      const mQuery = { ...query };
      if (mQuery.id) {
        mQuery._id = mQuery.id;
        delete mQuery.id;
      }
      // Separate search, sort, min/max price for query matching
      let search = "";
      let sort = "newest";
      let minPrice = 0;
      let maxPrice = Infinity;

      if (mQuery.search) {
        search = mQuery.search;
        delete mQuery.search;
      }
      if (mQuery.sort) {
        sort = mQuery.sort;
        delete mQuery.sort;
      }
      if (mQuery.minPrice) {
        minPrice = Number(mQuery.minPrice);
        delete mQuery.minPrice;
      }
      if (mQuery.maxPrice) {
        maxPrice = Number(mQuery.maxPrice);
        delete mQuery.maxPrice;
      }

      const mongoQuery = {};
      // Copy exact matching fields
      Object.keys(mQuery).forEach((key) => {
        if (
          mQuery[key] !== "all" &&
          mQuery[key] !== "any" &&
          mQuery[key] !== undefined
        ) {
          mongoQuery[key] = mQuery[key];
        }
      });

      // Price ranges
      if (minPrice > 0 || maxPrice < Infinity) {
        mongoQuery.price = {};
        if (minPrice > 0) mongoQuery.price.$gte = minPrice;
        if (maxPrice < Infinity) mongoQuery.price.$lte = maxPrice;
      }

      // Keyword search matches
      if (search) {
        mongoQuery.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ];
      }

      let q = MongoProperty.find(mongoQuery);
      // Sorting
      if (sort === "price_asc") q = q.sort({ price: 1 });
      else if (sort === "price_desc") q = q.sort({ price: -1 });
      else q = q.sort({ createdDate: -1 });

      const properties = await q.exec();
      const mapped = properties.map((p) => mapDoc(p));
      // Populate owner
      const populated = [];
      for (const p of mapped) {
        const ownerDoc = await MongoUser.findById(p.ownerId).exec();
        const owner = mapDoc(ownerDoc);
        const { passwordHash, ...ownerSafe } = owner || {
          id: p.ownerId,
          name: "Unknown Owner",
          email: "",
          phone: "",
          role: "user",
          profileImage: "",
          address: "",
          createdDate: "",
        };
        populated.push({
          ...p,
          owner: ownerSafe,
        });
      }
      return populated;
    }

    const db = await dbManager.init();
    let results = [...db.properties];

    // Filter by key-values if query is structured as record
    if (query && typeof query === "object") {
      const keys = Object.keys(query).filter(
        (k) => k !== "price" && k !== "sort",
      );
      results = results.filter((p) => keys.every((k) => p[k] === query[k]));
    }

    // Populate owners in a Mongoose-style
    const populated = results.map((p) => {
      const owner = db.users.find((u) => u.id === p.ownerId);
      const { passwordHash, ...ownerSafe } = owner || {
        id: p.ownerId,
        name: "Unknown Owner",
        email: "",
        phone: "",
        role: "user",
        profileImage: "",
        address: "",
        createdDate: "",
      };
      return {
        ...p,
        owner: ownerSafe,
      };
    });

    return populated;
  }

  static async findById(id) {
    if (useMongo) {
      try {
        const pDoc = await MongoProperty.findById(id).exec();
        if (!pDoc) return null;
        const p = mapDoc(pDoc);
        const ownerDoc = await MongoUser.findById(p.ownerId).exec();
        const owner = mapDoc(ownerDoc);
        const { passwordHash, ...ownerSafe } = owner || {
          id: p.ownerId,
          name: "Unknown Owner",
          email: "",
          phone: "",
          role: "user",
          profileImage: "",
          address: "",
          createdDate: "",
        };
        return {
          ...p,
          owner: ownerSafe,
        };
      } catch {
        return null;
      }
    }
    const db = await dbManager.init();
    const p = db.properties.find((item) => item.id === id);
    if (!p) return null;

    const owner = db.users.find((u) => u.id === p.ownerId);
    const { passwordHash, ...ownerSafe } = owner || {
      id: p.ownerId,
      name: "Unknown Owner",
      email: "",
      phone: "",
      role: "user",
      profileImage: "",
      address: "",
      createdDate: "",
    };
    return {
      ...p,
      owner: ownerSafe,
    };
  }

  static async create(propData) {
    if (useMongo) {
      const p = new MongoProperty({
        ...propData,
        createdDate: new Date().toISOString(),
      });
      await p.save();
      return mapDoc(p);
    }
    const db = await dbManager.init();
    const newProp = {
      ...propData,
      id: "prop-" + Date.now() + Math.random().toString(36).substring(2, 6),
      createdDate: new Date().toISOString(),
    };
    db.properties.push(newProp);
    await dbManager.save(db);
    return newProp;
  }

  static async findByIdAndUpdate(id, update) {
    if (useMongo) {
      try {
        await MongoProperty.findByIdAndUpdate(id, update, { new: true }).exec();
        return this.findById(id);
      } catch {
        return null;
      }
    }
    const db = await dbManager.init();
    const index = db.properties.findIndex((p) => p.id === id);
    if (index === -1) return null;
    db.properties[index] = { ...db.properties[index], ...update };
    await dbManager.save(db);
    return this.findById(id);
  }

  static async findByIdAndDelete(id) {
    if (useMongo) {
      try {
        await MongoProperty.findByIdAndDelete(id).exec();
        await MongoBooking.deleteMany({ propertyId: id }).exec();
        await MongoFavorite.deleteMany({ propertyId: id }).exec();
        await MongoReview.deleteMany({ propertyId: id }).exec();
        return true;
      } catch {
        return false;
      }
    }
    const db = await dbManager.init();
    const originalLength = db.properties.length;
    // Delete any dependent bookings, reviews, favorites to keep DB integral and consistent
    db.properties = db.properties.filter((p) => p.id !== id);
    db.bookings = db.bookings.filter((b) => b.propertyId !== id);
    db.favorites = db.favorites.filter((f) => f.propertyId !== id);
    db.reviews = db.reviews.filter((r) => r.propertyId !== id);
    if (db.properties.length !== originalLength) {
      await dbManager.save(db);
      return true;
    }
    return false;
  }
}

export class Booking {
  static async find(query = {}) {
    if (useMongo) {
      const bookings = await MongoBooking.find(query).exec();
      const mapped = bookings.map((b) => mapDoc(b));
      const populated = [];
      for (const b of mapped) {
        const propDoc = await MongoProperty.findById(b.propertyId).exec();
        const tenantDoc = await MongoUser.findById(b.tenantId).exec();
        const ownerDoc = await MongoUser.findById(b.ownerId).exec();
        const property = mapDoc(propDoc);
        const tenant = mapDoc(tenantDoc);
        const owner = mapDoc(ownerDoc);

        const tenantSafe = tenant
          ? {
              id: tenant.id,
              name: tenant.name,
              email: tenant.email,
              phone: tenant.phone,
            }
          : null;
        const ownerSafe = owner
          ? {
              id: owner.id,
              name: owner.name,
              email: owner.email,
              phone: owner.phone,
            }
          : null;

        populated.push({
          ...b,
          property,
          tenant: tenantSafe,
          owner: ownerSafe,
        });
      }
      return populated;
    }
    const db = await dbManager.init();
    let results = [...db.bookings];

    if (query && typeof query === "object") {
      const keys = Object.keys(query);
      results = results.filter((b) => keys.every((k) => b[k] === query[k]));
    }

    // Populate property, tenant, and owner
    return results.map((b) => {
      const property = db.properties.find((p) => p.id === b.propertyId);
      const tenant = db.users.find((u) => u.id === b.tenantId);
      const owner = db.users.find((u) => u.id === b.ownerId);

      const tenantSafe = tenant
        ? {
            id: tenant.id,
            name: tenant.name,
            email: tenant.email,
            phone: tenant.phone,
          }
        : null;
      const ownerSafe = owner
        ? {
            id: owner.id,
            name: owner.name,
            email: owner.email,
            phone: owner.phone,
          }
        : null;

      return {
        ...b,
        property,
        tenant: tenantSafe,
        owner: ownerSafe,
      };
    });
  }

  static async findById(id) {
    if (useMongo) {
      try {
        const bDoc = await MongoBooking.findById(id).exec();
        if (!bDoc) return null;
        const b = mapDoc(bDoc);
        const propDoc = await MongoProperty.findById(b.propertyId).exec();
        const tenantDoc = await MongoUser.findById(b.tenantId).exec();
        const ownerDoc = await MongoUser.findById(b.ownerId).exec();

        const property = mapDoc(propDoc);
        const tenant = mapDoc(tenantDoc);
        const owner = mapDoc(ownerDoc);

        const tenantSafe = tenant
          ? {
              id: tenant.id,
              name: tenant.name,
              email: tenant.email,
              phone: tenant.phone,
            }
          : null;
        const ownerSafe = owner
          ? {
              id: owner.id,
              name: owner.name,
              email: owner.email,
              phone: owner.phone,
            }
          : null;

        return {
          ...b,
          property,
          tenant: tenantSafe,
          owner: ownerSafe,
        };
      } catch {
        return null;
      }
    }
    const db = await dbManager.init();
    const b = db.bookings.find((item) => item.id === id);
    if (!b) return null;

    const property = db.properties.find((p) => p.id === b.propertyId);
    const tenant = db.users.find((u) => u.id === b.tenantId);
    const owner = db.users.find((u) => u.id === b.ownerId);

    const tenantSafe = tenant
      ? {
          id: tenant.id,
          name: tenant.name,
          email: tenant.email,
          phone: tenant.phone,
        }
      : null;
    const ownerSafe = owner
      ? {
          id: owner.id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
        }
      : null;

    return {
      ...b,
      property,
      tenant: tenantSafe,
      owner: ownerSafe,
    };
  }

  static async create(bookingData) {
    if (useMongo) {
      const b = new MongoBooking({
        ...bookingData,
        bookingDate: new Date().toISOString(),
      });
      await b.save();
      return mapDoc(b);
    }
    const db = await dbManager.init();
    const newBooking = {
      ...bookingData,
      id: "book-" + Date.now() + Math.random().toString(36).substring(2, 6),
    };
    db.bookings.push(newBooking);
    await dbManager.save(db);
    return newBooking;
  }

  static async findByIdAndUpdate(id, update) {
    if (useMongo) {
      try {
        await MongoBooking.findByIdAndUpdate(id, update, { new: true }).exec();
        return this.findById(id);
      } catch {
        return null;
      }
    }
    const db = await dbManager.init();
    const index = db.bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;
    db.bookings[index] = { ...db.bookings[index], ...update };
    await dbManager.save(db);
    return this.findById(id);
  }

  static async findByIdAndDelete(id) {
    if (useMongo) {
      try {
        await MongoBooking.findByIdAndDelete(id).exec();
        return true;
      } catch {
        return false;
      }
    }
    const db = await dbManager.init();
    const originalLength = db.bookings.length;
    db.bookings = db.bookings.filter((b) => b.id !== id);
    if (db.bookings.length !== originalLength) {
      await dbManager.save(db);
      return true;
    }
    return false;
  }
}

export class Favorite {
  static async find(query = {}) {
    if (useMongo) {
      const favorites = await MongoFavorite.find(query).exec();
      const mapped = favorites.map((f) => mapDoc(f));
      const populated = [];
      for (const f of mapped) {
        const propDoc = await MongoProperty.findById(f.propertyId).exec();
        let propertyPopulated = null;
        if (propDoc) {
          const property = mapDoc(propDoc);
          const ownerDoc = await MongoUser.findById(property.ownerId).exec();
          const owner = mapDoc(ownerDoc);
          const ownerSafe = owner
            ? {
                id: owner.id,
                name: owner.name,
                email: owner.email,
                phone: owner.phone,
              }
            : null;
          propertyPopulated = {
            ...property,
            owner: ownerSafe,
          };
        }
        populated.push({
          ...f,
          property: propertyPopulated,
        });
      }
      return populated;
    }
    const db = await dbManager.init();
    let results = [...db.favorites];

    if (query && typeof query === "object") {
      const keys = Object.keys(query);
      results = results.filter((f) => keys.every((k) => f[k] === query[k]));
    }

    // Populate property and property.owner
    return results.map((f) => {
      const property = db.properties.find((p) => p.id === f.propertyId);
      let propertyPopulated = null;
      if (property) {
        const owner = db.users.find((u) => u.id === property.ownerId);
        const ownerSafe = owner
          ? {
              id: owner.id,
              name: owner.name,
              email: owner.email,
              phone: owner.phone,
            }
          : null;
        propertyPopulated = {
          ...property,
          owner: ownerSafe,
        };
      }
      return {
        ...f,
        property: propertyPopulated,
      };
    });
  }

  static async create(favData) {
    if (useMongo) {
      const existing = await MongoFavorite.findOne(favData).exec();
      if (existing) return mapDoc(existing);
      const f = new MongoFavorite(favData);
      await f.save();
      return mapDoc(f);
    }
    const db = await dbManager.init();
    // Check if duplicate
    const existing = db.favorites.find(
      (f) => f.userId === favData.userId && f.propertyId === favData.propertyId,
    );
    if (existing) return existing;

    const newFav = {
      ...favData,
      id: "fav-" + Date.now() + Math.random().toString(36).substring(2, 6),
    };
    db.favorites.push(newFav);
    await dbManager.save(db);
    return newFav;
  }

  static async findOneAndDelete(query) {
    if (useMongo) {
      try {
        const res = await MongoFavorite.findOneAndDelete(query).exec();
        return !!res;
      } catch {
        return false;
      }
    }
    const db = await dbManager.init();
    const originalLength = db.favorites.length;
    db.favorites = db.favorites.filter(
      (f) => !(f.userId === query.userId && f.propertyId === query.propertyId),
    );
    if (db.favorites.length !== originalLength) {
      await dbManager.save(db);
      return true;
    }
    return false;
  }
}

export class Review {
  static async find(query = {}) {
    if (useMongo) {
      const reviews = await MongoReview.find(query).exec();
      const mapped = reviews.map((r) => mapDoc(r));
      const populated = [];
      for (const r of mapped) {
        const userDoc = await MongoUser.findById(r.userId).exec();
        const user = mapDoc(userDoc);
        const userSafe = user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              profileImage: user.profileImage,
            }
          : null;
        populated.push({
          ...r,
          user: userSafe,
        });
      }
      return populated;
    }
    const db = await dbManager.init();
    let results = [...db.reviews];

    if (query && typeof query === "object") {
      const keys = Object.keys(query);
      results = results.filter((r) => keys.every((k) => r[k] === query[k]));
    }

    // Populate user
    return results.map((r) => {
      const user = db.users.find((u) => u.id === r.userId);
      const userSafe = user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
          }
        : null;
      return {
        ...r,
        user: userSafe,
      };
    });
  }

  static async create(reviewData) {
    if (useMongo) {
      const r = new MongoReview({
        ...reviewData,
        date: new Date().toISOString(),
      });
      await r.save();
      const mapped = mapDoc(r);
      const userDoc = await MongoUser.findById(mapped.userId).exec();
      const user = mapDoc(userDoc);
      const userSafe = user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
          }
        : null;
      return {
        ...mapped,
        user: userSafe,
      };
    }
    const db = await dbManager.init();
    const newReview = {
      ...reviewData,
      id: "rev-" + Date.now() + Math.random().toString(36).substring(2, 6),
      date: new Date().toISOString(),
    };
    db.reviews.push(newReview);
    await dbManager.save(db);

    // Return review with user populated
    const user = db.users.find((u) => u.id === newReview.userId);
    const userSafe = user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
        }
      : null;
    return {
      ...newReview,
      user: userSafe,
    };
  }

  static async findByIdAndDelete(id) {
    if (useMongo) {
      try {
        const res = await MongoReview.findByIdAndDelete(id).exec();
        return !!res;
      } catch {
        return false;
      }
    }
    const db = await dbManager.init();
    const originalLength = db.reviews.length;
    db.reviews = db.reviews.filter((r) => r.id !== id);
    if (db.reviews.length !== originalLength) {
      await dbManager.save(db);
      return true;
    }
    return false;
  }
}

// Platform Statistics Utility for Admin Dashboard
export class PlatformStatistics {
  static async getStats() {
    if (useMongo) {
      const totalUsers = await MongoUser.countDocuments().exec();
      const totalProperties = await MongoProperty.countDocuments().exec();
      const totalBookings = await MongoBooking.countDocuments().exec();

      const pendingListings = await MongoProperty.countDocuments({
        status: "pending",
      }).exec();
      const approvedListings = await MongoProperty.countDocuments({
        status: "approved",
      }).exec();
      const rejectedListings = await MongoProperty.countDocuments({
        status: "rejected",
      }).exec();

      // Calculate city distribution
      const properties = await MongoProperty.find().exec();
      const citiesDistribution = {};
      properties.forEach((p) => {
        citiesDistribution[p.city] = (citiesDistribution[p.city] || 0) + 1;
      });

      // Calculate rating averages per property
      const reviews = await MongoReview.find().exec();
      const reviewsRatingMap = {};
      reviews.forEach((r) => {
        if (!reviewsRatingMap[r.propertyId]) {
          reviewsRatingMap[r.propertyId] = { sum: 0, count: 0 };
        }
        reviewsRatingMap[r.propertyId].sum += r.rating;
        reviewsRatingMap[r.propertyId].count += 1;
      });

      return {
        totalUsers,
        totalProperties,
        totalBookings,
        pendingListings,
        approvedListings,
        rejectedListings,
        citiesDistribution,
        reviewsRatingMap,
      };
    }
    const db = await dbManager.init();
    const totalUsers = db.users.length;
    const totalProperties = db.properties.length;
    const totalBookings = db.bookings.length;

    const pendingListings = db.properties.filter(
      (p) => p.status === "pending",
    ).length;
    const approvedListings = db.properties.filter(
      (p) => p.status === "approved",
    ).length;
    const rejectedListings = db.properties.filter(
      (p) => p.status === "rejected",
    ).length;

    // Calculate city distribution
    const citiesDistribution = {};
    db.properties.forEach((p) => {
      citiesDistribution[p.city] = (citiesDistribution[p.city] || 0) + 1;
    });

    // Calculate rating averages per property
    const reviewsRatingMap = {};
    db.reviews.forEach((r) => {
      if (!reviewsRatingMap[r.propertyId]) {
        reviewsRatingMap[r.propertyId] = { sum: 0, count: 0 };
      }
      reviewsRatingMap[r.propertyId].sum += r.rating;
      reviewsRatingMap[r.propertyId].count += 1;
    });

    return {
      totalUsers,
      totalProperties,
      totalBookings,
      pendingListings,
      approvedListings,
      rejectedListings,
      citiesDistribution,
      reviewsRatingMap,
    };
  }
}
