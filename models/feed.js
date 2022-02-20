let mongoose = require('mongoose');

let feedSchema = mongoose.Schema(
  {
    headline: {
      type: String,
      minlength: 5,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      minlength: 3,
      required: true,
      trim: true
    },
    published_date: {
      type: String,
      required: true
    },
    thumbnail: {
      data: Buffer,
      contentType: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feed", feedSchema);
