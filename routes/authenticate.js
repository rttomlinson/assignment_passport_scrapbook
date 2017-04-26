const express = require("express");
const router = express.Router();

module.exports = passport => {
    router.get(
        "/facebook",
        passport.authenticate("facebook", {
            scope: "email"
        })
    );

    router.get(
        "/facebook/callback",
        passport.authenticate("facebook", {
            successRedirect: "/",
            failureRedirect: "/login"
        })
    );

    router.get(
        "/twitter",
        passport.authenticate("twitter", {
            scope: "email"
        })
    );

    router.get(
        "/twitter/callback",
        passport.authenticate("twitter", {
            successRedirect: "/",
            failureRedirect: "/login"
        })
    );

    router.get(
        "/google",
        passport.authenticate('google', {
            scope: ["openid", "email"]
        })
    );

    router.get(
        "/google/callback",
        passport.authenticate("google", {
            successRedirect: "/",
            failureRedirect: "/login"
        })
    );

    router.get(
        "/github",
        passport.authenticate('github', {
            scope: ["user:email"]
        })
    );

    router.get(
        "/github/callback",
        passport.authenticate("github", {
            successRedirect: "/",
            failureRedirect: "/login"
        })
    );
    return router;
};
