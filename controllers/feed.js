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
      return res.status(200).json(feed);
    })
  })
}

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