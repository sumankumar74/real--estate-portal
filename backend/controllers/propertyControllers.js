
const mongoose = require("mongoose");
const Property = require("../models/Property");

const ALLOWED_LISTING_TYPES = ["For Sale", "For Rent"];
const ALLOWED_PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Plot",
  "Commercial",
];
const ALLOWED_STATUSES = ["Available", "Sold", "Rented"];

// Get public properties

const getProperties = async (req, res) => {
  try {
    const {
      search,
      listingType,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
    } = req.query;

    const filter = {
      $and: [
        {
          $or: [
            { status: "Available" },
            { status: { $exists: false } },
            { status: null },
          ],
        },
      ],
    };

    if (search?.trim()) {
      filter.$and.push({
        $or: [
          { title: { $regex: search.trim(), $options: "i" } },
          { location: { $regex: search.trim(), $options: "i" } },
          { propertyType: { $regex: search.trim(), $options: "i" } },
        ],
      });
    }

    if (listingType) {
      filter.listingType = listingType;
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (bedrooms) {
      filter.bedrooms = Number(bedrooms);
    }

    const properties = await Property.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Get properties error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch properties.",
    });
  }
};


// Get single property
const getPropertyById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID.",
      });
    }

    const property = await Property.findById(req.params.id)
      .populate("owner", "name email");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Get property error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch property.",
    });
  }
};

// Create property
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      price,
      listingType,
      propertyType,
      bedrooms,
      bathrooms,
      area,
      images,
      featured,
    } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !location?.trim() ||
      price === undefined ||
      price === "" ||
      !listingType ||
      !propertyType ||
      area === undefined ||
      area === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required property fields.",
      });
    }

    const numericPrice = Number(price);
    const numericArea = Number(area);
    const numericBedrooms = Number(bedrooms ?? 0);
    const numericBathrooms = Number(bathrooms ?? 0);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0 ||
      !Number.isFinite(numericArea) ||
      numericArea <= 0 ||
      !Number.isInteger(numericBedrooms) ||
      numericBedrooms < 0 ||
      !Number.isInteger(numericBathrooms) ||
      numericBathrooms < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid property measurements and price.",
      });
    }

    if (!ALLOWED_LISTING_TYPES.includes(listingType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing type.",
      });
    }

    if (!ALLOWED_PROPERTY_TYPES.includes(propertyType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property type.",
      });
    }

    if (
      images !== undefined &&
      (!Array.isArray(images) ||
        images.length > 10 ||
        images.some(
          (url) =>
            typeof url !== "string" ||
            !/^https?:\/\/\S+$/i.test(url.trim())
        ))
    ) {
      return res.status(400).json({
        success: false,
        message: "Images must be valid HTTP or HTTPS URLs.",
      });
    }

    const property = await Property.create({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      price: numericPrice,
      listingType,
      propertyType,
      bedrooms: numericBedrooms,
      bathrooms: numericBathrooms,
      area: numericArea,
      images: (images || []).map((url) => url.trim()),
      featured: featured === true || featured === "true",
      status: "Available",
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully.",
      property,
    });
  } catch (error) {
    console.error("Create property error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create property.",
    });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID.",
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    await property.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully.",
    });
  } catch (error) {
    console.error("Delete property error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete property.",
    });
  }
};

// Get all properties for admin
const getAllAdminProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Admin properties error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin properties.",
    });
  }
};

// Update property status
const updatePropertyStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID.",
      });
    }

    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property status.",
      });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Property marked as ${status}.`,
      property,
    });
  } catch (error) {
    console.error("Update property status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update property status.",
    });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  deleteProperty,
  getAllAdminProperties,
  updatePropertyStatus,
};
