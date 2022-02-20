const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signUp, signIn, signOut } = require("../controllers/auth")

router.post(
  "/signup",
  [
    check("username", "username should be at least 3 char long").isLength({ min: 3 }),
    check("email", "email is required!").isEmail(),
    check("password", "password should be at least 3 char long").isLength({ min:3 }),
    check("phoneNumber", "phone number should be at least length of 10 numbers").isLength({ min: 10 })
  ],
  signUp
);

router.post(
  "/signin",
  [
    check("email", "email is required!").isEmail(),
    check("password", "password should be at least 3 char long").isLength({ min:3 })
  ],
  signIn
);

router.get("/signout", signOut);

module.exports = router;