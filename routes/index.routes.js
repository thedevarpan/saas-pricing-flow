const express = require("express");
const router = express.Router();
const { TOKEN_PLANS } = require("../config/plans");
const { renderDashboard } = require("../controllers/admin.controller");
const planModel = require("../models/plan.model");

/* GET / page */
router.get("/", async (req, res) => {
    const plans = await planModel.find({ active: true });
    res.render("index", { plans });
});

/* Render pricing page */
// router.get("/pricing", (req, res) => {
//     res.render("pricing");
// });


module.exports = router;
