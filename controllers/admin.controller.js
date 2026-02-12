const userModel = require("../models/user.model");

const handleDashboard = async (req, res) => {
    try {
        /* Fetch all users with their purchase history */
        const users = await userModel.find({}).sort({ createdAt: -1 });

        /* Prepare payments array with user details */
        let payments = [];
        let totalPayments = 0;
        let totalRevenue = 0;

        users.forEach(user => {
            if (user.purchases && user.purchases.length > 0) {
                user.purchases.forEach(purchase => {
                    const amountPaise = Number(purchase.amountPaise) || 0;
                    
                    payments.push({
                        user: {
                            fullname: user.fullname,
                            email: user.email,
                            username: user.username
                        },
                        planId: purchase.planId,
                        amountPaise: amountPaise,
                        currency: purchase.currency,
                        tokensAdded: purchase.tokensAdded,
                        status: purchase.status,
                        provider: purchase.provider,
                        paidAt: purchase.paidAt,
                        createdAt: purchase.createdAt
                    });

                    if (purchase.status === 'paid') {
                        totalPayments++;
                        totalRevenue += amountPaise;
                    }
                });
            }
        });

        /* Sort payments by date (newest first) */
        payments.sort((a, b) => {
            const dateA = a.paidAt || a.createdAt;
            const dateB = b.paidAt || b.createdAt;
            return new Date(dateB) - new Date(dateA);
        });

        res.render("dashboard/index", {
            users,
            payments,
            totalPayments,
            totalRevenue
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).send("Error loading dashboard");
    }
};

module.exports = { handleDashboard };
