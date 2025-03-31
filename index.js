require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { log } = require("console");
const session = require("express-session");
const passport = require("passport");
const MongoDBStore = require("connect-mongodb-session")(session);
const { Project, User } = require("./models");
const projectsRouter = require("./routes/projectRoutes");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Initialize MongoDB Session Store
const sessionStore = new MongoDBStore({
    uri: process.env.MongoDBString,
    collection: "mySessions",
});

sessionStore.on("error", (error) => {
    console.error("Session store error:", error);
});

// Configure Session Middleware
app.use(
    session({
        secret: process.env.AuthenticateString,
        resave: false,
        saveUninitialized: true,
        store: sessionStore, // Use MongoDB session store
    })
);

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
// mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0');
mongoose
    .connect(process.env.MongoDBString)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/projects", projectsRouter);

app.get("/", function (req, res) {
    res.render("login");
});

app.get("/login", function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/projects/tables", { user: req.user });
    }
    res.render("login");
});

app.get("/register", function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/projects/tables", { user: req.user });
    }
    res.render("register");
});

app.get("/logout", function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.clearCookie("connect.sid"); // This clears the session cookie
            res.status(500).send("Failed to log out");
        } else {
            console.log("you have logged off");
            res.render("login");
        }
    });
});

app.post("/register", function (req, res) {
    User.register(
        { username: req.body.username, email: req.body.email },
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/projects/cards");
                });
            }
        }
    );
});

app.post("/login", function (req, res) {
    // TODO Users can send a capitalized username if they target this route directly
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            console.log(err);
            return res.redirect("/login"); // Redirect back to login if there's an error
        }
        if (!user) {
            return res.redirect("/login"); // Redirect if no user is found
        }
        req.login(user, function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/login"); // Redirect if login fails
            }
            return res.redirect("/projects/tables"); // Successful login
        });
    })(req, res);
});

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.render("login");
});

// Code needed for Railway deploy
// const port = process.env.PORT || 3000;
// // Listen on `port` and 0.0.0.0
// app.listen(port, "0.0.0.0", function () {
//   // ...
// });

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Server on ${port}...`);
});
