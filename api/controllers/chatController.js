const History = require("../models/history");
const mongoose = require("mongoose");
const User = require("../models/users");

module.exports.uploadVoice_post = (req, res) => {
  res.status(204).json();
};

module.exports.sendPicture_post = (req, res) => {
  res.status(204).json();
};

module.exports.history_get = async (req, res) => {
  skipLimit = -10 * req.query.skip;
  const { roomId } = req.params;
  let ObjectId = mongoose.Types.ObjectId;
  if (ObjectId.isValid(roomId)) {
    try {
      const historyLength = await History.findOne(
        { room_id: req.params.roomId },
        "length -_id"
      );
      if (historyLength) {
        if (Math.abs(skipLimit) > historyLength.length) {
          const roomHistory = await History.findOne(
            { room_id: req.params.roomId },
            { messages: { $slice: historyLength.length % 10 } }
          );
          res.status(200).json(roomHistory);
        } else {
          const roomHistory = await History.findOne(
            { room_id: req.params.roomId },
            { messages: { $slice: [skipLimit, 10] } }
          );
          res.status(200).json(roomHistory);
        }
      } else {
        res.status(404).json();
      }
    } catch (err) {
      res.status(500).json("Something went wrong...");
    }
  } else {
    res.status(400).json("Bad request.");
  }
};

module.exports.notifications_seen = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.decodedToken.id,
      { "notifications.$[elem].seen": true },
      { arrayFilters: [{ "elem.seen": false }] }
    );
    res.status(204).json();
  } catch (err) {
    res.status(500).json("Something went wrong...");
  }
};
