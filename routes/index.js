const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const router = express.Router();

// Welcome Page
router.get("/login", (req, res) => {
  console.log("yeah");
  res.render("login", { title: "Login" });
});
// Dashboard

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    name: req.user.name,
  });
});

module.exports = router;
