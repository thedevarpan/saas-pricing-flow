const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { createPayment, successPayment } = require("../controllers/payment.controller");

router.post("/create-checkout-session", isAuthenticated, createPayment);
router.get("/success", successPayment);
   
router.post("/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log("Webhook signature verification failed.");
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        await handleSuccessfulPayment(session);
    }

    res.json({ received: true });
});


module.exports = router;