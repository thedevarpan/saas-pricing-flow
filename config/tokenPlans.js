const TOKEN_PLANS = [
    {
        id: "starter_200",
        name: "Starter",
        amountRupees: 100,
        amountPaise: 100 * 100,
        tokens: 200,
        unlimited: false,
    },
    {
        id: "value_100",
        name: "Value",
        amountRupees: 400,
        amountPaise: 400 * 100,
        tokens: 100,
        unlimited: false,
    },
    {
        id: "pro_unlimited",
        name: "Pro",
        amountRupees: 1000,
        amountPaise: 1000 * 100,
        tokens: 0,
        unlimited: true,
    },
];

const getPlanById = (planId) => TOKEN_PLANS.find((p) => p.id === planId);

module.exports = {
    TOKEN_PLANS,
    getPlanById,
};
