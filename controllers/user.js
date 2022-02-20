const User = require("../models/user");

exports.getUserById = (req, res, next, id) =>{
  try{
    User.findById(id).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "user not found in database"
        })
      }
      req.profile = user;
      next();
    })
  }
  catch(error) {
    return res.status(400).json({
      "error": error
    })
  }
}

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.profileImage = undefined;
  return res.json(req.profile);
}

exports.getPhoto = (req, res, next) => {
  if (req.profile.profileImage.data) {
    res.set("Content-Type", req.profile.profileImage.contentType);
    return res.send(req.profile.profileImage.data);
  }
  next();
}

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if(err) {
        return res.status(400).json({
          error: "you are not authorized to update user information!"
        })
      }
      user.salt = undefined;
      user.encry_password = undefined;
      user.profileImage = undefined;
      return res.json(user);
    }
  )
}