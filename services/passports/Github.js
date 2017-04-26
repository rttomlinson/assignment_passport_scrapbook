const User = require("../../models").User;

const GithubStrategy = require('passport-github2').Strategy;

module.exports = new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("data from github", profile);
        User.findOrCreateGithub(profile, null, accessToken, refreshToken)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err);
            });
    }
);
