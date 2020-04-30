module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect("/account/login");
    } else {
        next();
    }
}