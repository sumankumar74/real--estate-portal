const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    listingType: {
      type: String,
      enum: ["For Sale", "For Rent"],
      required: true,
    },
    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Villa", "Plot", "Commercial"],
      required: true,
    },
    bedrooms: {
      type: Number,
      default: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
    },
    area: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["Available", "Sold", "Rented"],
      default: "Available",
    },
  },
  { timestamps: true, strict: true },
);

module.exports = mongoose.model("Property", propertySchema);
