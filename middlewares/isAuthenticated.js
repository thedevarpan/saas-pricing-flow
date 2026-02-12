

exports.isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        req.session.errorMessage = "Please login first";
        return res.redirect("/login");
    }
    next();
};
