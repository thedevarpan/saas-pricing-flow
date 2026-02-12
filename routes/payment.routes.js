const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { createPayment, successPayment } = require("../controllers/payment.controller");

router.post("/create-popular-checkout", isAuthenticated, createPayment);

router.get("/popular-success", successPayment);


module.exports = router;