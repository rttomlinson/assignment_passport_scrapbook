const User = require("../../models").User;

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreateGoogle(profile, null, accessToken, refreshToken)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err);
            });
    }
);
