const passport = require("passport");
const User = require("../../models").User;

module.exports = function(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(require("./Facebook"));
    passport.use(require("./Twitter"));
    passport.use(require("./Google"));
    passport.use(require("./Github"));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err);
            });
    });
    return passport;
};
