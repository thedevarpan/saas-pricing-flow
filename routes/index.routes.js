const express = require("express");
const router = express.Router();
const { TOKEN_PLANS } = require("../config/tokenPlans");

/* GET / page */
router.get("/", (req, res) => {
    res.render("index");
});

/* Render pricing page */
router.get("/pricing", (req, res) => {
    res.render("pricing", {
        tokenPlans: TOKEN_PLANS,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
    });
});

module.exports = router;
