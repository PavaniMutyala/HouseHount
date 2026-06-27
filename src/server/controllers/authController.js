import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../db/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "househunt_super_secret_key_13579";

// Register User
export async function register(req, res) {
  try {
    const { name, email, phone, password, role, address, profileImage } =
      req.body;

    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address format." });
    }

    // Phone validation (simple check)
    if (phone.length < 8) {
      return res.status(400).json({ message: "Invalid phone number." });
    }

    // Password strength check
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already registered. Please log in." });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: role === "admin" ? "admin" : "user", // Defaults to user, restrict admin creation in prod if needed
      profileImage:
        profileImage ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      address: address || "",
    });

    const { passwordHash: _, ...userSafe } = newUser;

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "Registration successful!",
      user: userSafe,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error during registration." });
  }
}

// Login User
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password." });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const { passwordHash: _, ...userSafe } = user;

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful!",
      user: userSafe,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error during login." });
  }
}

// Get Profile Details
export async function getProfile(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    return res.json({ user: req.user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error fetching profile." });
  }
}

// Update Profile details
export async function updateProfile(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { name, phone, address, profileImage } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({ message: "Name and phone fields cannot be empty." });
    }

    const updated = await User.findByIdAndUpdate(req.user.id, {
      name,
      phone,
      address: address || "",
      profileImage: profileImage || req.user.profileImage,
    });

    if (!updated) {
      return res.status(404).json({ message: "User not found." });
    }

    const { passwordHash: _, ...userSafe } = updated;

    return res.json({
      message: "Profile updated successfully!",
      user: userSafe,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error updating profile." });
  }
}

// Change Password
export async function changePassword(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide both current and new passwords." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long." });
    }

    // Fetch user with password hash
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(req.user.id, { passwordHash });

    return res.json({ message: "Password changed successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Server error changing password." });
  }
}
