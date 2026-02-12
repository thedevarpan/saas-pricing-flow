const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const handleSignup = async (req, res) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("signup", {
                errorMessage: errors.array()[0].msg,
                successMessage: null,
                oldInput: req.body,
            });
        }

        const { fullname, username, email, password } = req.body;

        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).render("signup", {
                errorMessage: "Email or Username already exists",
                successMessage: null,
                oldInput: req.body,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new userModel({
            fullname,
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        req.session.successMessage = "Signup successful! You can login now.";
        return res.status(201).redirect("/user/login");

    } catch (error) {
        console.error(error);

        return res.status(500).render("signup", {
            errorMessage: "Something went wrong!",
            successMessage: null,
            oldInput: req.body,
        });
    }
};


const handleLogin = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.session.errorMessage = errors.array()[0].msg;
            return req.session.save(() => {
                res.redirect("/user/login");
            });
        }

        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            req.session.errorMessage = "Invalid email or password"
            return req.session.save(() => {
                res.redirect("/user/login");
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.session.errorMessage = "Invalid email or password"
            return req.session.save(() => {
                res.redirect("/user/login");
            });
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        req.session.successMessage = "Login successful!";

        return req.session.save(() => {
            res.redirect("/")
        });

    } catch (error) {
        console.error(error);
        req.session.errorMessage = "Something went wrong!";
        return req.session.save(() => {
            res.redirect("/user/login");
        });
    }
}

const logout = async (req, res) => {
    req.session.successMessage = "Logged out successfully.";

    req.session.save(() => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.redirect("/dashboard");
            }

            res.clearCookie("user_session");
            res.redirect("/user/login");
        });
    });
}


module.exports = { handleSignup, handleLogin, logout };