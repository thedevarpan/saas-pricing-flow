const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { handleDashboard } = require("../controllers/admin.controller");
const { isAdmin } = require("../middlewares/isAdmin");


/* Dashboard route */
router.get("/dashboard", isAuthenticated, handleDashboard);

module.exports = router;


