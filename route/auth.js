const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../model/user");

const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

const JWT_TOKEN = "sayanisagoodboy";

//**************************create a user using POST "/api/auth"*************************

//ROUTE 1
router.post(
  "/createuser",
  [
    body("name", "Enter A valid Name").isLength({ min: 3 }),
    body("password", "Enter A valid password").isLength({ min: 5 }),
    body("email", "enter a valid email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //check whether user exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry this email is alreday exists", success:false });
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_TOKEN);
      res.json({ authToken: authToken, success:true });
    } catch (error) {
      console.log(error);
      res.status(500).json("Some internal server error occurred!");
    }
  }
);

//***************************************Login A user using his/her email********************************

//ROUTER 2
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    // body("passsword", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return res
          .status(400)
          .send({ error: "Please try to login with correct credentials1 !!" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      console.log(passwordCompare);
      if (!passwordCompare) {
        return res
          .status(400)
          .send({ error: "Please try to login with correct credentials2 !!" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_TOKEN);
      res.json({ authToken: authToken, success:'Success' });
    } catch (error) {
      console.log(error);
      res.status(500).json("Some internal server error occurred!");
    }
  }
);

//*******************************ROUTE 3 : Get User Details Using POST request*****************************
router.post("/getuser", fetchUser, async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
