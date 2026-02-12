const express = require("express");
const router = express.Router();
const { TOKEN_PLANS } = require("../config/tokenPlans");

/* GET / page */
router.get("/", (req, res) => {
    res.render("index");
});

/* Render pricing page */
router.get("/pricing", (req, res) => {
    res.render("pricing");
});

module.exports = router;
