const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Twit = require("twit-promise");

const UserSchema = mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },
    facebookObj: {},
    twitterObj: {},
    googleObj: {},
    githubObj: {},
    email: {
        type: String,
        unique: true
    }
});

UserSchema.plugin(uniqueValidator);

UserSchema.statics.findOrCreateFacebook = function(profile, user, token, tokenSecret) {
    return User.findOne({
        "facebookObj.facebookId": profile.id
    }).then(user => {
        if (user) {
            return user;
        }
        else {
            return new User({
                displayName: profile.displayName,
                facebookObj: {
                    facebookId: profile.id,
                    facebookToken: token,
                    facebookTokenSecret: tokenSecret
                },
                email: profile.emails[0].value
            }).save();
        }
    });
};

UserSchema.statics.findOrCreateTwitter = function(
    profile,
    user,
    token,
    tokenSecret
) {
    return User.findOneAndUpdate({
        _id: user._id
    }, {
        twitterObj: {
            twitterId: profile.id,
            twitterToken: token,
            twitterTokenSecret: tokenSecret
        }
    }, {
        returnNewDocument: true
    }).then(user => {
        if (user) {
            return user;
        }
        else {
            return new User({
                displayName: profile.displayName,
                twitterObj: {
                    twitterId: profile.id,
                    twitterToken: token,
                    twitterTokenSecret: tokenSecret
                }
            }).save();
        }
    });
};


UserSchema.statics.findOrCreateGoogle = function(
    profile,
    user,
    token,
    refreshToken
) {
    return User.findOneAndUpdate({
        email: profile.emails[0].value
    }, {
        googleObj: {
            googleId: profile.id,
            googleToken: token,
            googleTokenSecret: refreshToken
        }
    }, {
        returnNewDocument: true
    }).then(user => {
        if (user) {
            return user;
        }
        else {
            return new User({
                displayName: profile.displayName,
                googleObj: {
                    googleId: profile.id,
                    googleToken: token,
                    googleRefreshToken: refreshToken
                },
                email: profile.emails[0].value
            }).save();
        }
    });
};

UserSchema.statics.findOrCreateGithub = function(
    profile,
    user,
    token,
    refreshToken
) {
    return User.findOneAndUpdate({
        email: profile.emails[0].value
    }, {
        githubObj: {
            githubId: profile.id,
            githubToken: token,
            githubRefreshToken: refreshToken
        }
    }, {
        returnNewDocument: true
    }).then(user => {
        if (user) {
            return user;
        }
        else {
            return new User({
                displayName: profile.displayName,
                githubObj: {
                    githubId: profile.id,
                    githubToken: token,
                    githubTokenSecret: tokenSecret
                },
                email: profile.emails[0].value
            }).save();
        }
    });
};


UserSchema.methods.getAccounts = async function() {
    let accounts = [];
    accounts.push({
        name: "Twitter",
        authorized: this.twitterObj
    });
    accounts.push({
        name: "Facebook",
        authorized: this.facebookObj
    });
    accounts.push({
        name: "Google",
        authorized: this.googleObj
    });
    accounts.push({
        name: "Github",
        authorized: this.githubObj
    });
    return accounts;
};

UserSchema.methods.getTweets = async function() {
    let twitterObj = this.twitterObj;
    if (twitterObj) {

        // fetch('https://api.twitter.com/1.1/search/tweets')
        //     .then(data => data.json())
        //     .then(data => res.render('logged', {
        //         joke: data.value
        //     }));
        let T = new Twit({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: twitterObj.twitterToken,
            access_token_secret: twitterObj.twitterTokenSecret
        });
        return T.get("search/tweets", {
            q: "this",
            count: 5
        }).then(tweets => {
            //scrub the tweets
            tweets = tweets.data.statuses.map((tweet) => {
                let tweetInfo = {};
                tweetInfo.text = tweet.text;
                tweetInfo.name = tweet.user.name;
                return tweetInfo;
            });
            return tweets;
        });
    }
    return null;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
