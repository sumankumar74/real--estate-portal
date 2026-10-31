
const mongoose = require("mongoose");
const Enquiry = require("../models/Enquiry");
const Property = require("../models/Property");
const User = require("../models/Users");

const createEnquiry = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    // Validate property ID
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID.",
      });
    }

    // Validate required fields
    if (![name, email, phone, message].every(
      (value) => typeof value === "string" && value.trim()
    )) {
      return res.status(400).json({
        success: false,
        message: "Please complete all enquiry fields.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();

    // Field length validation
    if (
      cleanName.length > 100 ||
      cleanEmail.length > 254 ||
      cleanPhone.length > 15 ||
      cleanMessage.length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length.",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Phone validation
    if (!/^\+?[0-9\s()-]{7,15}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    // Find property
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    // Check availability
    if (property.status && property.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This property is no longer available.",
      });
    }

    // Check owner ID
    if (!property.owner) {
      return res.status(400).json({
        success: false,
        message: "This property has no assigned owner. Please contact the administrator.",
      });
    }

    // Verify owner exists
    const ownerId = property.owner._id || property.owner;

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property owner information.",
      });
    }

    const owner = await User.findById(ownerId);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "The assigned property owner does not exist.",
      });
    }

    // Create enquiry
    const enquiry = await Enquiry.create({
      property: property._id,
      owner: owner._id,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
    });

    return res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted successfully.",
      enquiry,
    });
  } catch (error) {
    console.error("Create enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your enquiry. Please try again.",
    });
  }
};

// Get all enquiries for admin
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("property", "title location price status")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    console.error("Get enquiries error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch enquiries.",
    });
  }
};

const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID.",
      });
    }

    const allowedStatuses = ["New", "Contacted", "Closed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry status.",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("property", "title location price")
      .populate("owner", "name email");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully.",
      enquiry,
    });
  } catch (error) {
    console.error("Update enquiry status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update enquiry status.",
    });
  }
};



module.exports = {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
};
