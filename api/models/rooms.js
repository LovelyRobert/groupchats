const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a  room title"],
    unique: true,
    minlength: [3, "Title must be at least 3 characters"],
    maxlength: [20, "Title must be at most 20 characters"],
    match: [/^[A-Za-z0-9\s,.'-]+$/, "Description is invalid"],
  },
  description: {
    type: String,
    required: [true, "Please enter a room description"],
    minlength: [25, "Description must be at least 25 characters"],
    maxlength: [250, "Description must be at most 250 characters"],
  },
  category: {
    type: String,
    required: [true, "Please choose a room category"],
  },
  language: {
    type: String,
    required: [true, "Please choose a room language"],
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  img: {
    type: String,
    default: `${process.env.CLIENT_URL}/default-banner.jpg`,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  banned_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: String,
    default: "pending",
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
