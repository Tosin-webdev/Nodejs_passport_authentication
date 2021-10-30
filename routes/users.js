const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/User");

// Login Page
router.get("/", (req, res) => {
  console.log(req.url);
  console.log("aaa");
  res.render("register");
});

// sending post request
router.post("/", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check requires fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Missing credentials" });
  }

  // Check passwords match
  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Chech password length
  if (password.length <= 5) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // User exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        // res.send("oooop");
        console.log(newUser);
        // Hash password

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // Save user
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "You are now registered");
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }

  console.log(req.body);
});

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

module.exports = router;
