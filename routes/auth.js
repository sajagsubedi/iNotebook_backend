const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { signup, login } = require("../controllers/auth");

// ------VALIDATION OPTIONS-------

//common emailOption
const emailOption = [body("email", "Please Enter a valid email").isEmail()];
//for signup
const signupOption = [
  ...emailOption,
  body("name", "Name must be at least 3 characters long").isLength({
    min: 3,
  }),
  body("password", "Password must be at least 5 characters long").isLength({
    min: 5,
  }),
];
//for login
const loginOption = [
  ...emailOption,
  body("password", "Please Enter a valid password").exists(),
];

//-------ROUTES FOR SIGNUP and SIGNIN OF USER--------

//Route : 1
router.route("/signup").post(signupOption, signup);
//Route: 2
router.route("/login").post(loginOption, login);

//export of router
module.exports = router;
