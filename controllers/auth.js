const { validationResult } = require("express-validator");
const User = require("../models/User");
const JWT = require("jsonwebtoken");
const JWT_Secret = process.env.JWT_SECRET;
const bcrypt = require("bcryptjs");

//------------CONTROLLERS--------------

//------------ FOR SIGNUP--------------
//CONTROLLER 1: To create a user using POST="/api/auth/signup"
const signup = async (req, res) => {
  //checking validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  //finding the user with given email to check wheteher it exists already or not
  let user = await User.findOne({
    email: req.body.email,
  });

  //checking user with the given email already exists or not
  if (user) {
    //avoiding the signup if user already exists
    return res.status(403).json({
      message: "Sorry the user already exists with given email",
    });
  }
  //generating salt and creatig hast of password and salt using bcrypt
  let salt = await bcrypt.genSalt(10);
  let securePassword = await bcrypt.hash(req.body.password, salt);

  //saving user to the database
  user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: securePassword,
  });

  //adding user id to data variable
  let data = {
    user: {
      id: user._id,
    },
  };
  //creating json web token and signing it using secret
  let authToken = JWT.sign(data, JWT_Secret);

  //sending json web token as response from server
  res.json({
    authToken,
  });
};

//--------------FOR LOGIN----------
//CONTROLLER 2: To login using POST="/api/auth/login"
const login = async (req, res) => {
  //checking validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  //getting required credentials
  const { email, password } = req.body;

  //finding user by email
  let user = await User.findOne({
    email: email,
  });

  //checking whether the user exists or not
  if (!user) {
    success = false;
    return res.status(400).json({
      error: "Please enter correct credentials",
    });
  }

  //comparing passwords of the user in request body and database
  let passwordCompare = await bcrypt.compare(password, user.password);

  //checking the result of comparison
  if (!passwordCompare) {
    success = false;
    return res.status(400).json({
      error: "Please enter correct credentials",
    });
  }

  // setting user id in data variable
  let data = {
    user: {
      id: user._id,
    },
  };

  //creating json web token and signing it using secret
  let authToken = JWT.sign(data, JWT_Secret);
  success = true;

  //sending json web token as response
  res.json({
    success,
    authToken,
  });
};

//export of controllers
module.exports = {
  signup,
  login,
};
