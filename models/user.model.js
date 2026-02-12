const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    password: {
        type: String,
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    tokenBalance: {
        type: Number,
        default: 0,
        min: 0,
    },

    hasUnlimitedTokens: {
        type: Boolean,
        default: false,
    },

    unlimitedTokensActivatedAt: {
        type: Date,
    },

    purchases: [
        {
            provider: {
                type: String,
                enum: ["stripe"],
                default: "stripe",
            },

            planId: {
                type: String,
                required: true,
            },

            stripeSessionId: {
                type: String,
            },

            stripePaymentIntentId: {
                type: String,
            },

            amount: {
                type: Number,
                required: true,
            },

            currency: {
                type: String,
                default: "USD",
            },

            tokensAdded: {
                type: Number,
                default: 0,
            },

            unlimited: {
                type: Boolean,
                default: false,
            },

            status: {
                type: String,
                enum: ["created", "paid", "failed"],
                default: "created",
            },

            paidAt: {
                type: Date,
            },
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);