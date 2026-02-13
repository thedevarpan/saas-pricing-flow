const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const planModel = require("../models/plan.model");
const userModel = require("../models/user.model");



const createPayment = async (req, res) => {
    try {

        const { slug } = req.body;
        console.log(slug)

        // Check if user already has unlimited plan
        const user = await userModel.findById(req.session.user.id);
        
        if (user.hasUnlimitedTokens) {
            return res.status(400).json({ 
                error: "You already have an Unlimited Plan. No need to purchase more." 
            });
        }

        const plan = await planModel.findOne({ slug });

        if (!plan) {
            return res.status(400).json({ error: "Invalid plan" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: plan.currency,
                    product_data: { name: plan.name },
                    unit_amount: plan.price,
                },
                quantity: 1,
            }],
            success_url: `${process.env.BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/`,
            metadata: {
                userId: req.session.user.id,
                planSlug: plan.slug
            }
        });

        return res.json({ url: session.url });

    } catch (error) {
        console.error("Stripe error:", error);
        return res.status(500).json({ error: error.message });
    }
};



const successPayment = async (req, res) => {
    try {

        const { session_id } = req.query;
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== "paid") {
            return res.redirect("/");
        }

        const userId = session.metadata.userId;
        const planSlug = session.metadata.planSlug;

        const user = await userModel.findById(userId);
        const plan = await planModel.findOne({ slug: planSlug });

        if (!user || !plan) {
            return res.redirect("/");
        }

        // Check if user already has unlimited tokens
        if (user.hasUnlimitedTokens) {
            req.session.errorMessage = "You already have an Unlimited Plan!";
            return req.session.save(() => {
                res.redirect("/");
            });
        }

        // 🔐 Prevent double credit
        const alreadyExists = user.purchases.find(p => p.stripeSessionId === session_id);
        if (alreadyExists) {
            return res.redirect("/");
        }

        // 🎯 Credit logic
        if (plan.unlimited === true) {
            user.hasUnlimitedTokens = true;
            user.unlimitedTokensActivatedAt = new Date();
        } else {
            user.tokenBalance = Number(user.tokenBalance || 0) + Number(plan.tokens || 0);
        }

        user.purchases.push({
            provider: "stripe",
            planId: plan.slug,
            stripeSessionId: session_id,
            stripePaymentIntentId: session.payment_intent,
            amount: Number(plan.price),
            currency: plan.currency || "USD",
            tokensAdded: Number(plan.tokens || 0),
            unlimited: Boolean(plan.unlimited),
            status: "paid",
            paidAt: new Date()
        });
        console.log("Plan object:", plan);

        await user.save();

        // Set payment success data for congratulations popup
        req.session.paymentSuccess = {
            planName: plan.name,
            unlimited: plan.unlimited,
            tokens: plan.tokens,
            amount: (plan.price / 100).toFixed(2)
        };

        req.session.save(() => {
            res.redirect("/");
        });

    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
};


module.exports = { createPayment, successPayment }