
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { tokenGenerator } = require("../utils/tokenGenerator");
const mongoose = require('mongoose')
const { renameSync, unlinkSync } = require('fs');



module.exports.registerUser = async (req, res) => {
  try {

    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email })
    if (user) {

      console.log('"error", "You already have an account, please login');
      return res.redirect("/");
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            email,
            password: hash,
          });

          let token = tokenGenerator(user);
          res.cookie("token", token);
          //console.log('Redirecting to chat page');

          return res.status(201).json({
            user: {
              id: user.id,
              email: user.email,
              profilesetup: user.profilesetup
            }
          })
        }
      });
    });
  } catch (err) {
    res.send(err.message);
  }
}

module.exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email })
    if (!user) {
      // req.flash("error", "Email or Password incorrect");
      console.log('error", "Email or Password incorrect');

      return res.send("Incorrect email or password");
    }
    console.log("userpassword", user.password);
    bcrypt.compare(password, user.password, function (err, result) {
      console.log("result", result)
      if (result) {
        let token = tokenGenerator(user);
        res.cookie("token", token);
        console.log('Redirecting to login');
        return res.status(201).json({
          user: {
            id: user.id,
            email: user.email,
            profilesetup: user.profilesetup,
            token: token
          }
        })
        //res.send("logged in");
      }
      else {
        //req.flash("error", "Email or Password incorrect");
        return res.send("error", "Email or Password incorrect");
      }
    })
  }
  catch (err) {
    res.send(err.message);
  }
}

module.exports.userInfo = async (req, res) => {
  try {
    const user = req.user;
    console.log(user, "user")

    return res.status(200).json({

      id: user._id,
      email: user.email,
      profilesetup: user.profilesetup,
      firstname: user.firstname,
      lastname: user.lastname,
      image: user.image,
      color: user.color,

    });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};

module.exports.profileUpdate = async (req, res) => {
  try {
    const user = req.user;
    console.log(user, "user");

    const { firstname, lastname, color } = req.body;

    if (!firstname || !lastname) {
      return res.status(400).send("First, last name, and color are required");
    }

    const userdata = await userModel.findByIdAndUpdate(
      user._id,
      { firstname, lastname, color, profilesetup: true },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ data: userdata });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};


module.exports.profilePicture = async (req, res) => {
  try {
    const user = req.user;
    if (!req.file) {
      return res.status(400).send("File is required")
    }
    const date = Date.now()
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);



    const userdata = await userModel.findByIdAndUpdate(
      user._id,
      { image: fileName },
      { new: true, runValidators: true }
    );

    console.log(userdata, "userdata")

    return res.status(200).json({

      image: userdata.image,

    });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};

module.exports.deleteProfile = async (req, res) => {
  try {
    const userid = req.user;
    console.log(userid, "user");

    const user = await userModel.findById(userid._id,)

    if (!user) {
      return res.status(400).send("there is no user")
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return res.status(200).send("profile removed");
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};








module.exports.logout = function (req, res) {
  res.cookie("token", "");
  console.log('Redirecting to logout');
  res.redirect("/");
};