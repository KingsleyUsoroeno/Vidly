require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Joi = require("joi");
const lodash = require("lodash");
const brcypt = require("bcrypt");
const Jwt = require('jsonwebtoken');
const authMiddleWare = require('../middleware/auth');

// Our Joi Validator function
function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

function validateAuthUser(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

router.post("/register", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      // user does not , go ahead and register his ass up
      const { name, password, email } = req.body;
      // Hash the users password
      const salt = await brcypt.genSalt(10);
      const hashedPassword = await brcypt.hash(password, salt);
      user = new User({
        name: name,
        password: hashedPassword,
        email: email
      });

      await user.save();
      // generate a user token
      const token = Jwt.sign({_id: user._id, name: user.name},process.env.JWT_SECRET_KEY);
      
      let response = {
        message: "User Registered Successfully",
        status: "success",
        user: lodash.pick(user, ["_id", "name", "email"])
      };

      res.header('x-auth-token', token).status(200).json(response);
    } else {
      // vise versa
      res.status(400).json({ message: "User Already Registered" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/me", authMiddleWare, async (req, res) => {
  console.log("user id is " + req.user._id);
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json(user);
});

router.post("/login", async (req, res) => {
  const { error } = validateAuthUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;
  let user = await User.findOne({ email: email });

  if (user) {
    // compare the password given to that in which is stored in our DB
    const validPassword = await brcypt.compare(password, user.password);
    // if its a valid password, send a 200 response to the client with the user property
    const token = Jwt.sign({_id: user._id, name: user.name},process.env.JWT_SECRET_KEY);
    if (validPassword) {
      let response = {
        message: "login successfull",
        status: "success",
        user: lodash.pick(user, ["_id", "name", "email"]),
        token:user.generateToken()
      };
      res.status(200).json(response);
    } else {
      // not a valid password
      res.status(400).json({ message: "Invalid email and password" });
    }
  } else {
    // user does not exist
    res.status(400).json({ message: "Invalid email or password" });
  }
});

module.exports = router;
