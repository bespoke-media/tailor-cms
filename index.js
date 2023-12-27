const express = require("express");
const path = require("path");

const expressSession = require("express-session");
const passport = require("passport");

require("dotenv").config();
const port = process.env.PORT || "9001";

const authRouter = require("./auth");

const app = express();

app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: app.get("env") === "production",
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth', authRouter);

app.get('/', function (req, res) {
  if (req.user) {
    res.render('home', { user: req.user });
  } else {
    res.render('login', { title: 'Login', loginHref: '/auth/google/login' });
  }
});

app.listen(port, () => console.log(`Listening to requests on http://localhost:${port}`));

