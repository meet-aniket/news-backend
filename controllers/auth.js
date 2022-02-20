const User = require("../models/user");
const formidable = require("formidable");
const _ = require("lodash")
const fs = require("fs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signUp = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if(err) {
      return res.status(400).json({
        error: "problem with the image!"
      })
    }

    const {username, email, phoneNumber, dateOfBirth, gender, language, relationshipStatus, password } = fields;
    console.log(fields);
    if ( !username || !email || !phoneNumber || !dateOfBirth || !gender || !language || !relationshipStatus || !password) {
      return res.status(400).json({
        error: "all fields are necessary!"
      })
    }

    let user = new User(fields);

    if(file.profileImage) {
      if(file.profileImage.size > 3000000) {
        return res.status(400).json({
          error: "file size is too big!"
        })
      }
      user.profileImage.data = fs.readFileSync(file.profileImage.filepath);
      user.profileImage.contentType = file.profileImage.mimetype;
    }

    user.save((err, user) => {
      if(err) {
        return res.status(400).json({
          error: "can not register user !"
        })
      }
      user.salt = undefined;
      user.encry_password = undefined;
      return res.status(200).json(user);
    })
  })
}

exports.signIn = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if(!errors.isEmpty) {
    return res.status(404).json({
      error: errors.array()[0].msg
    })
  }

  User.findOne({ email }, (err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: "User's email does not exist!"
      })
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "email or password do not match!"
      })
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });
    
    user.salt = undefined;
    user.encry_password = undefined;
    return res.json({ 
      token, 
      user 
    });
  })
}

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user signed out successfully"
  })
}

// Middlewares and route protectors

exports.isSignedIn = expressJwt({
  algorithms: ['HS256'],
  secret: process.env.SECRET,
  userProperty: "auth"
})

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!checker) {
    return res.status(403).json({
      error: "access_denied!"
    })
  }
  next();
}