const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  room_id: {
    type: String,
    unique: true,
  },
  messages: [
    {
      id: Number,
      userId: String,
      nickname: String,
      value: String,
      dataType: String,
      profileImg: String,
      date: Date,
    },
  ],
  length: {
    type: Number,
    default: 0,
  },
});

const History = mongoose.model("history", historySchema);

module.exports = History;
