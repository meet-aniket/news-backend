const express = require("express");
const router = express.Router();

const {
  createFeed,
  getAllFeeds,
} = require("../controllers/feed");

router.post("/create-feed", createFeed);

router.get("/feeds", getAllFeeds);

module.exports = router;