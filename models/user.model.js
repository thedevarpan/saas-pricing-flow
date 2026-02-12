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
                required: true,
                default: "stripe",
            },
            planId: {
                type: String,
                required: true,
            },
            amountPaise: {
                type: Number,
                required: true,
                min: 0,
            },
            currency: {
                type: String,
                default: "INR",
            },
            tokensAdded: {
                type: Number,
                default: 0,
                min: 0,
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
            razorpayOrderId: {
                type: String,
            },
            razorpayPaymentId: {
                type: String,
            },
            razorpaySignature: {
                type: String,
            },
            paidAt: {
                type: Date,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);