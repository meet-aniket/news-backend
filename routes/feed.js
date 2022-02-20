const express = require("express");
const router = express.Router();

const {
  createFeed,
  getAllFeeds,
  getFeedById,
  getThumbnail,
  getUniqueCategories
} = require("../controllers/feed");

router.param("feedId", getFeedById);

router.post("/create-feed", createFeed);
router.get("/feed/thumbnail/:feedId", getThumbnail);

router.get("/feeds", getAllFeeds);
router.get("/feeds/categories", getUniqueCategories)

module.exports = router;