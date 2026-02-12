const Stripe = require("stripe");
const plans = require("../config/plans");
const userModel = require("../models/user.model");



const createPayment = async (req, res) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Popular Plan"
                    },
                    unit_amount: 2500,
                },
                quantity: 1,
            },
        ],
        success_url: `${process.env.BASE_URL}/payment/popular-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/pricing`,
        metadata: {
            userId: req.session.user.id
        }
    });

    res.json({ url: session.url });
}



const successPayment = async (req, res) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    if (session.payment_status !== "paid") {
        return res.redirect("/pricing");
    }

    const user = await userModel.findById(session.metadata.userId);
    if (!user) return res.redirect("/pricing");

    const TOKENS_FOR_POPULAR = 2000;

    user.tokenBalance += TOKENS_FOR_POPULAR;

    user.purchases.push({
        provider: "stripe",
        planId: "popular",
        amountPaise: 2500,
        currency: "USD",
        tokensAdded: TOKENS_FOR_POPULAR,
        unlimited: false,
        status: "paid",
        paidAt: new Date()
    });

    await user.save();

    req.session.user.tokens = user.tokenBalance;

    res.redirect("/");
}

module.exports = { createPayment, successPayment }