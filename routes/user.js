const express = require("express");
const router = express.Router();

const { getUser, getUserById, updateUser, getPhoto } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.get("/user/photo/:userId", isSignedIn, isAuthenticated, getPhoto);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

module.exports = router;