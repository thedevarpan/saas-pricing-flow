require("dotenv").config();
const mongoose = require("mongoose");
const Plan = require("./models/plan.model");

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Database connected");

        await Plan.deleteMany(); // optional (clears old plans)

        await Plan.insertMany([
            {
                name: "Basic",
                slug: "basic",
                price: 0,
                features: [
                    "Api Access",
                    "User Analytics",
                    "100 Captured Contacts",
                    "2 Languages Support",
                    "Multi-Currency Support"
                ]
            },
            {
                name: "NextAi Pro",
                slug: "pro",
                price: 4900,
                badge: "Popular",
                features: [
                    "Api Access",
                    "User Analytics",
                    "100 Captured Contacts",
                    "2 Languages Support",
                    "Multi-Currency Support",
                    "1 CMS Collection"
                ]
            },
            {
                name: "Enterprise",
                slug: "enterprise",
                price: 9900,
                features: [
                    "Api Access",
                    "User Analytics",
                    "100 Captured Contacts",
                    "2 Languages Support",
                    "Multi-Currency Support"
                ]
            }
        ]);

        console.log("Plans seeded successfully");
        process.exit();

    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
