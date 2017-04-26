const express = require("express");
const router = express.Router();
const {
    loggedInOnly,
    loggedOutOnly
} = require("../services/session");

router.get("/", loggedInOnly, function(req, res, next) {
    let allAccounts = req.user.getAccounts();
    let allTweets = req.user.getTweets();
    Promise.all([allAccounts, allTweets])
        .then(([accounts, tweets]) => {
            res.render("home", {
                accounts,
                tweets
            });
        })
        .catch(next);
});

router.get("/login", loggedOutOnly, function(req, res) {
    res.render("login");
});

router.delete("/logout", loggedInOnly, function(req, res) {
    req.session.destroy();
    req.method = 'GET';
    res.redirect("/login");
});

module.exports = router;
