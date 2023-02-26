const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

//User Schema

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, "Please enter a nickname"],
    unique: true,
    lowercase: true, // turn it to lowercase before saving it to database
    minlength: [6, "Nickname must be at least 6 characters"],
    maxlength: [10, "Nickname must be at most 10 characters"],
    match: [/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, "This username is invalid"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true, // turn it to lowercase before saving it to database
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    //required: [true, 'Please enter a password'],
    minlength: [6, "Password must be at least 6 characters"],
  },
  provider: {
    type: String,
  },
  profile_img: {
    type: String,
  },
  description: {
    type: String,
    maxlength: [140, "Description must be at most 140 characters"],
    default: "",
  },
  first_name: {
    type: String,
    maxlength: [20, "First Name must be at most 20 characters"],
    default: "",
    match: [
      /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/,
      "First name is invalid",
    ],
  },
  last_name: {
    type: String,
    maxlength: [20, "Last Name must be at most 20 characters"],
    default: "",
    match: [
      /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/,
      "Last name is invalid",
    ],
  },
  country: {
    type: String,
    default: "United States",
  },
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
    match: [/^([a-zA-Z]+|[a-zA-Z]+\s[a-zA-Z]+)$/, "City name is invalid"],
  },
  state: {
    type: String,
    default: "",
    match: [/^([a-zA-Z]+|[a-zA-Z]+\s[a-zA-Z]+)$/, "State name is invalid"],
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  banned_from: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  notifications: [
    {
      notification_type: String,
      room_id: String,
      room_name: String,
      date: Date,
      seen: Boolean,
    },
  ],
});

//Fire a function after documents are saved to database, we use mongoose hooks for that schema.post(event, callback)
userSchema.post("save", (doc, next) => {
  console.log(doc);
  next();
});

//Fire a function before...
userSchema.pre("save", async function (next) {
  if (this.provider == "self") {
    //Check if it is not google auth
    const salt = await bcrypt.genSalt(); //to generate first a salt in our password
    this.password = await bcrypt.hash(this.password, salt); //this refers to the new model instance user
  }
  next();
});

//Static function to login users
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    if (user.provider == "self") {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error("Incorrect password");
    }
    throw Error("Incorrect provider");
  }
  throw Error("Incorrect email");
};

//Here we create the model based on the schema
const User = mongoose.model("User", userSchema);

//Export the model
module.exports = User;
