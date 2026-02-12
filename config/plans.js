module.exports = {
    FREE: {
        id: "free",
        price: 0,
        tokens: 0,
        unlimited: false
    },
    STANDARD: {
        id: "standard",
        price: 1000, // ₹10 (in paise if INR)
        tokens: 500,
        unlimited: false
    },
    POPULAR: {
        id: "popular",
        price: 2500,
        tokens: 2000,
        unlimited: false
    },
    ENTERPRISE: {
        id: "enterprise",
        price: 5000,
        tokens: 0,
        unlimited: true
    }
};
