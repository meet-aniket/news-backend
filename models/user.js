var mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 3,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true
    },
    phoneNumber: {
      type: Number,
      minlength: 10,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      trim: true
    },
    gender: {
      type: String,
      trim: true
    },
    language: {
      type: String,
      trim: true
    },
    relationshipStatus: {
      type: String,
      trim: true
    },
    profileImage: {
      data: Buffer,
      contentType: String
    },
    encry_password: {
      type: String,
      required: true
    },
    salt: String
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  autheticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function(plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
}

module.exports = mongoose.model("User", userSchema);