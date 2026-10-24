
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/database");
const Property = require("./models/Property");

const properties = [
  {
    title: "Luxury Modern Villa",
    description: "A spacious modern villa with elegant interiors, a private garden, and premium amenities.",
    location: "Dehradun, Uttarakhand",
    price: 12500000,
    listingType: "For Sale",
    propertyType: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811"],
    featured: true,
  },
  {
    title: "Premium City Apartment",
    description: "A comfortable apartment close to shopping, schools, and public transport.",
    location: "Dehradun, Uttarakhand",
    price: 6500000,
    listingType: "For Sale",
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"],
    featured: true,
  },
  {
    title: "Family Home with Garden",
    description: "A welcoming family home with generous living space and an outdoor garden.",
    location: "Delhi, India",
    price: 9500000,
    listingType: "For Sale",
    propertyType: "House",
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
    featured: true,
  },
  {
    title: "Contemporary Rental Villa",
    description: "A furnished villa suitable for families seeking comfortable long-term accommodation.",
    location: "Mussoorie, Uttarakhand",
    price: 45000,
    listingType: "For Rent",
    propertyType: "Villa",
    bedrooms: 3,
    bathrooms: 3,
    area: 2400,
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"],
    featured: false,
  },
  {
    title: "Affordable Urban Apartment",
    description: "A practical apartment in a well-connected residential neighbourhood.",
    location: "Noida, Uttar Pradesh",
    price: 3800000,
    listingType: "For Sale",
    propertyType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    images: ["https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea"],
    featured: false,
  },
  {
    title: "Commercial Office Space",
    description: "A versatile commercial property suitable for a small business or professional office.",
    location: "Gurugram, Haryana",
    price: 75000,
    listingType: "For Rent",
    propertyType: "Commercial",
    bedrooms: 0,
    bathrooms: 1,
    area: 1200,
    images: ["https://images.unsplash.com/photo-1497366754035-f200968a6e72"],
    featured: false,
  },
];

async function seedDatabase() {
  try {
    await connectDB();
    await Property.insertMany(properties);
    console.log("Sample properties added successfully");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
