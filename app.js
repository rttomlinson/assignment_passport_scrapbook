const express = require('express');
const app = express();
const bodyParser = require("body-parser");

//Set env variables
require('dotenv').config();





//////////////////////////
//Serve static files
//////////////////////////
app.use(express.static(__dirname + "/public"));

////////////////////////////////////
// Connect to mongo database
//////////////////////////////////
const cleanDb = require("./seeds/clean");

const mongoose = require("mongoose");
app.use((req, res, next) => {
    if (mongoose.connection.readyState) {
        next();
    }
    else {
        mongoose.connect("mongodb://localhost/test").then(() => {
            //cleanDb().then(() => {
            next();
            //})
        });
    }
});

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
////////////////////////////////
//Expres session
///////////////////////////////
const expressSession = require("express-session");

app.use(
    expressSession({
        secret: process.env.secret || "puppies",
        saveUninitialized: false,
        resave: false
    })
);

//////////////////////////////
//Handlebars template engine
//////////////////////////////
const expressHandlebars = require("express-handlebars");
const helpers = require("./helpers");
var hbs = expressHandlebars.create({
    partialsDir: "views/",
    defaultLayout: "main",
    helpers: helpers.registered
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");



/////////////////////////////
//Set up app passport
/////////////////////////////
let passport = require("./services/passports")(app);


/////////////////////
//If user already logged in populate res.locals
/////////////////////
app.use((req, res, next) => {
    console.log("req.user is now", req.user);
    if (req.user) {
        res.locals.currentUser = req.user;
    }
    next();
});


////////////////////////
//Method overriding
//////////////////////
app.use((req, res, next) => {
    var method;
    if (req.query._method) {
        method = req.query._method;
        delete req.query._method;
    }
    else if (typeof req.body === "object" && req.body._method) {
        method = req.body._method;
        delete req.body._method;
    }

    if (method) {
        method = method.toUpperCase();
        req.method = method;
    }

    next();
});



const authenticateRouter = require("./routes/authenticate")(passport);
const indexRouter = require("./routes/index");
app.use("/auth/", authenticateRouter);
app.use("/", indexRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log("taking calls");
});
