
const Property = require("../models/Property");

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

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { propertyType: { $regex: search, $options: "i" } },
      ];
    }

    if (listingType) filter.listingType = listingType;
    if (propertyType) filter.propertyType = propertyType;

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (bedrooms !== undefined) {
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "name email");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid property ID",
    });
  }
};

module.exports = { getProperties, getPropertyById };
