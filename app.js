const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");

const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");

const passportSetup = require("./config/passport-setup");

const uri = process.env.mongo;

const app = express();

// express needs a location for static asset / styles

app.use("/public", express.static("public"));

// set up wiev engine

app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.cookieKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000,
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    secret: process.env.cookieKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 60 * 60 * 24 * 1000,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// connect to mongodb
mongoose.connect(uri).then((res) => {
  console.log("logged to mongoDB");
});

// set up routes

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

//create home route

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.listen(3000, () => {
  console.log("app now listening at port 3000");
});
