const Room = require("../../models/rooms");
const User = require("../../models/users");

module.exports = (io, socket) => {
  const handleBan = async ({ roomId, roomName, bannedUser }) => {
    let roomPromise = Room.findByIdAndUpdate(roomId, {
      $addToSet: { banned_users: bannedUser._id },
    });
    let userPromise = User.findByIdAndUpdate(bannedUser._id, {
      $addToSet: { banned_from: roomId },
    });
    await Promise.all([roomPromise, userPromise]);
    //1-disconnet banned user from room
    io.to(bannedUser._id).emit("room:ban:disconnect", { roomId });
    //2-Send realtime notification
    io.to(bannedUser._id).emit("notification", {
      notification_type: "ban",
      room_id: roomId,
      room_name: roomName,
      date: new Date(),
      seen: false,
    });
    //3-Add notification to the database
    await User.findByIdAndUpdate(
      bannedUser._id,
      {
        $push: {
          notifications: {
            $each: [
              {
                notification_type: "ban",
                room_id: roomId,
                room_name: roomName,
                date: new Date(),
                seen: false,
              },
            ],
            $position: 0,
          },
        },
      },
      { new: false }
    );
    //4-Update UI Room
    io.to(roomId).emit("room:ban:update:ui", bannedUser);
  };

  const handleAllow = async ({ roomId, roomName, allowedUser }) => {
    let roomPromise = Room.findByIdAndUpdate(roomId, {
      $pull: { banned_users: allowedUser._id },
    });
    let userPromise = User.findByIdAndUpdate(allowedUser._id, {
      $pull: { banned_from: roomId },
    });
    await Promise.all([roomPromise, userPromise]);
    //1-Update UI for allowe user
    io.to(allowedUser._id).emit("room:allow:update:user", { roomId });
    //2-Send realtime notification
    io.to(allowedUser._id).emit("notification", {
      notification_type: "allow",
      room_id: roomId,
      room_name: roomName,
      date: new Date(),
      seen: false,
    });
    //3-Add notification to the database
    await User.findByIdAndUpdate(
      allowedUser._id,
      {
        $push: {
          notifications: {
            $each: [
              {
                notification_type: "allow",
                room_id: roomId,
                room_name: roomName,
                date: new Date(),
                seen: false,
              },
            ],
            $position: 0,
          },
        },
      },
      { new: false }
    );
    //4-Update UI Room
    io.to(roomId).emit("room:allow:update:ui", allowedUser);
  };

  const roomFavouriteAdd = async (roomId) => {
    try {
      // verify jwt token and get user data
      await User.findByIdAndUpdate(socket.user._id, {
        $push: { favourites: roomId },
      });
    } catch (error) {
      //close connection
      return next(new Error(error.message));
    }
  };

  const roomFavouriteRemove = async (roomId) => {
    try {
      // verify jwt token and get user data
      await User.findByIdAndUpdate(socket.user._id, {
        $pull: { favourites: roomId },
      });
    } catch (error) {
      // close connection
      return next(new Error(error.message));
    }
  };

  //When a user is banned in room
  socket.on("room:ban", handleBan);
  //When a user is allowed in room
  socket.on("room:allow", handleAllow);
  //Add to favourites
  socket.on("room:favourite:add", roomFavouriteAdd);
  socket.on("room:favourite:remove", roomFavouriteRemove);
};
