const Feed = require("../models/feed");
const formidable = require("formidable");
const _ = require("lodash")
const fs = require("fs");

exports.createFeed = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if(err) {
      return res.status(400).json({
        error: "problem with the image!"
      })
    }

    const { headline, category, author, published_date } = fields;

    if(!headline || !category || !author || !published_date) {
      return res.status(400).json({
        error: "all fields are necessary!"
      })
    }

    let feed = new Feed(fields);

    if(file.thumbnail) {
      if(file.thumbnail.size > 3000000) {
        return res.status(400).json({
          error: "file size is too big!"
        })
      }

      feed.thumbnail.data = fs.readFileSync(file.thumbnail.filepath);
      feed.thumbnail.contentType = file.thumbnail.mimetype;
    }

    feed.save((err, feed) => {
      if(err) {
        return res.status(400).json({
          error: "can not create feed!"
        })
      }
      feed.thumbnail.data = undefined;
      feed.thumbnail.contentType = undefined;
      return res.status(200).json(feed);
    })
  })
}

exports.getFeedById = (req, res, next, id) => {
  Feed.findById(id).populate("category").exec((err, feed) => {
    if (err || !feed) {
      return res.status(400).json({
        error: "Feed not found in database."
      })
    }
    req.feed = feed;
    next();
  })
}

// This will give us feeds as per user's querry or by default 10 and will sort as well  
exports.getAllFeeds = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Feed.find()
    .select("-thumbnail")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, feeds) => {
      if(err) {
        return res.status(400).json({
          error: "no feed found in database!"
        })
      }
      return res.json(feeds);
    })
}

// We will take Thumbnail of each feed one by one
exports.getThumbnail = (req, res, next) => {
  if(req.feed.thumbnail.data) {
    res.set("Content-Type", req.feed.thumbnail.contentType);
    return res.send(req.feed.thumbnail.data);
  }
  next();
}

// This controller is to check how many different categories of product do we have
exports.getUniqueCategories = (req, res) => {
  Feed.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "no category found!"
      })
    }
    res.json(categories);
  })
}