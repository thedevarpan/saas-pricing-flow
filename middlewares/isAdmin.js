const isAdmin = (req, res, next) => {
    /* Check user is logged in or not  */
    if (!req.session.user) {
        req.session.errorMessage = "Please login first.";
        return req.session.save(() => {
            res.redirect("/user/login");
        });
    }

    /* Check the role */
    if (req.session.user.role !== "admin") {
        return res.status(403).render("403", {
            message: "Access denied. Admin only."
        });
    }

    next();
}


module.exports = { isAdmin };