const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    price:{
        type: Number,
        required: true,
        min :0,
    },
    listingType: {
        type: String,
        enum: ['sale', 'rent'],
        required: true,
    },
    propertyType: {
        type: String,
        enum: ['Apartment', 'House','Villa', 'Plot', 'Commercial'],
        required: true,
    },
    bedrooms: {
        type: Number,
        default: 0, 
    },
    areas: {
        type: Number,
        required: true,
    },
    images:{
        type: [String],
        default: [],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true }

);

module.exports = mongoose.model("Property", propertySchema);