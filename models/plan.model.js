const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
    },

    price: {
        type: Number, // in cents
        required: true,
    },

    currency: {
        type: String,
        default: "usd",
    },

    tokens: {
        type: Number,
        default: 0,
    },

    unlimited: {
        type: Boolean,
        default: false,
    },

    features: [String],

    active: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

module.exports = mongoose.model("Plan", planSchema);
