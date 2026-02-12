const express = require("express");
const router = express.Router();
const { handleSignup, handleLogin } = require("../controllers/auth.controller");
const { loginValidation, signupValidation } = require("../validators/authValidator");

/* Signup page */
router.get("/signup", (req, res) => {
    res.render("signup", {
        errorMessage: null,
        successMessage: null,
        oldInput: null
    });
});

router.post("/signup", signupValidation, handleSignup);


/* Login page */
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", loginValidation, handleLogin);


/* Handle logout  */


module.exports = router;