const express = require("express");
const router = express.Router();
const { handleSignup, handleLogin, logout } = require("../controllers/auth.controller");
const { loginValidation, signupValidation } = require("../validators/authValidator");
const { redirectIfAuthenticated } = require("../middlewares/redirectIfAuthenticated");


/* Signup page */
router.get("/signup", redirectIfAuthenticated,  (req, res) => {
    res.render("signup", {
        errorMessage: null,
        successMessage: null,
        oldInput: null
    });
});

router.post("/signup", signupValidation, handleSignup);


/* Login page */
router.get("/login", redirectIfAuthenticated, (req, res) => {
    res.render("login");
});

router.post("/login", loginValidation, handleLogin);


/* Handle logout  */
router.get("/logout", logout);

module.exports = router;