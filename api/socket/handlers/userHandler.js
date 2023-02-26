const Room = require("../../models/rooms");
const mongoose = require("mongoose");

module.exports = (io, socket) => {
  let ObjectId = mongoose.Types.ObjectId;

  const disconnected = () => {
    console.log(socket.user.nickname, "is disconnected");
  };

  const leaveAllRooms = () => {
    let roomsFiltred = [...socket.rooms];
    roomsFiltred.splice(0, 1);
    roomsFiltred.forEach(async (roomId) => {
      socket.to(roomId).emit("user:left", socket.user);
      socket.to(socket.user._id).emit("left:somewhere", { roomId });
      await Room.findByIdAndUpdate(roomId, {
        $pull: { users: socket.user._id },
      });
    });
  };

  const joinRoom = async (roomId) => {
    if (ObjectId.isValid(roomId)) {
      console.log(socket.user.nickname + " joined: " + roomId);
      socket.join(roomId);
      await Room.findByIdAndUpdate(roomId, {
        $addToSet: { users: socket.user._id },
      });
      socket.to(roomId).emit("user:joined", socket.user);
    }
  };

  const leaveRoom = async (roomId) => {
    if (ObjectId.isValid(roomId)) {
      socket.leave(roomId);
      socket.to(socket.user._id).emit("user:left:somewhere", { roomId });
      console.log(socket.user.nickname + " left: " + roomId);
      await Room.findByIdAndUpdate(roomId, {
        $pull: { users: socket.user._id },
      });
      socket.to(roomId).emit("user:left", socket.user);
    }
  };

  const updateSocketInfo = ({ _id, nickname, profile_img, description }) => {
    socket.user = {
      _id,
      nickname,
      profile_img,
      description,
    };
  };

  //When a user disconnect
  socket.on("disconnect", disconnected);
  socket.on("disconnecting", leaveAllRooms);
  //When user joined a room
  socket.on("user:join", joinRoom);
  //When user leave the room
  socket.on("user:leave", leaveRoom);
  //When user updates profile
  socket.on("user:update:profile", updateSocketInfo);
};
