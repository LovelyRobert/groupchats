const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
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

const History = mongoose.model("History", historySchema);

module.exports = History;
