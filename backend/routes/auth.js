const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Test
router.get("/test", async (req, res) => {
  try {
    res.status(200).json("test!!!");
  } catch (error) {
    console.log(error);
  }
});

// Register User
router.post("/register", async (req, res) => {
  try {
    // encrypt password with "bcrypt"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("User not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
