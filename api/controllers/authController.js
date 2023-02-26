const User = require("../models/users");
const Room = require("../models/rooms");
const History = require("../models/history");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const fsPromises = require("fs").promises;

//Handle errors
const handleErrors = (err) => {
  let errors = {
    nickname: "",
    email: "",
    password: "",
  };

  //Registration Errors
  if (err.code === 11000) {
    errors.email = "That email is already registred";
  }

  if (
    err.message.includes(
      "E11000 duplicate key error collection: test.users index: nickname_1 dup key:"
    )
  ) {
    errors.nickname = "This nickname is already used";
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    }); //to get an array of the values of the err.errors object and extract each one with destructuring to get only properties and place each one of them in an array
  }

  //login errors
  if (err.message === "Incorrect email") {
    errors.email = "Incorrect email";
  }

  if (err.message === "Incorrect provider") {
    errors.email =
      "You have previously signed up with a different signin method";
  }

  if (err.message === "Incorrect password") {
    errors.password = "Incorrect password";
  }

  return errors;
};

//Controllers

module.exports.logout_get = (req, res) => {
  try {
    res.cookie("jwt", "");
    res.status(200).json();
  } catch (err) {
    res.status(401).json("Something went wrong...");
  }
};

module.exports.signup_post = async (req, res) => {
  const { nickname, email, password } = req.body;
  try {
    const user = await User.create({
      nickname,
      email,
      password,
      provider: "self",
      profile_img: `${process.env.CLIENT_URL}/profiledefault.jpg`,
    });
    const maxAge = 3 * 24 * 60 * 60;
    const token = jwt.sign(
      { id: user._id, provider: user.provider },
      process.env.JWT_SECRET,
      { expiresIn: maxAge }
    );
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); //maxAge in milliseconds
    res.status(201).json(user._id);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(401).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    let maxAge = 3 * 24 * 60 * 60;
    if (req.body.rememberMe) {
      maxAge = 12 * 30 * 24 * 60 * 60;
    }
    const token = jwt.sign(
      { id: user._id, provider: user.provider },
      process.env.JWT_SECRET,
      { expiresIn: maxAge }
    );
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json(user._id);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(401).json({ errors });
  }
};

module.exports.user_get = async (req, res) => {
  try {
    let user = await User.findById(req.decodedToken.id);
    let {
      _id,
      nickname,
      email,
      provider,
      profile_img,
      description,
      first_name,
      last_name,
      country,
      address,
      city,
      state,
      rooms,
      favourites,
      banned_from,
      notifications,
    } = user;
    res.status(200).json({
      _id,
      nickname,
      email,
      provider,
      profile_img,
      description,
      first_name,
      last_name,
      country,
      address,
      city,
      state,
      rooms,
      favourites,
      banned_from,
      notifications,
    });
  } catch (err) {
    res.status(401).json("Something went wrong...");
  }
};

module.exports.authenticated = async (req, res) => {
  res.status(200).json(true);
};

module.exports.user_delete = async (req, res) => {
  try {
    const user = await User.findById(req.decodedToken.id);
    //Delete all user rooms
    user.rooms.forEach(async (el) => {
      let roomPromise = Room.findByIdAndDelete(el);
      let historyPromise = History.deleteOne({
        room_id: el,
      });
      await Promise.all([roomPromise, historyPromise]);
    });
    //Delete user data from rooms
    user.banned_from.forEach(async (el) => {
      await Room.findByIdAndUpdate(el, {
        $pull: { banned_users: req.decodedToken.id },
      });
    });
    //Remove all user files
    const path = `./public/users/${req.decodedToken.id}`;
    if (fs.existsSync(path)) {
      await fsPromises.rm(path, { recursive: true });
    }
    //Delete user and cookie
    let deletePromise = user.deleteOne();
    let cookiePromise = res.cookie("jwt", "");
    await Promise.all([deletePromise, cookiePromise]);
    res.status(200).json();
  } catch (err) {
    res.status(401).json("Something went wrong...");
  }
};
