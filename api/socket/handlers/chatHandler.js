const History = require("../../models/history");
const User = require("../../models/users");

module.exports = (io, socket) => {
  const handleMessage = async ({
    messageObject,
    roomId,
    roomName,
    mentionedIds,
  }) => {
    messageObject.date = new Date();
    await History.findOneAndUpdate(
      { room_id: roomId },
      {
        $push: { messages: messageObject },
        $inc: { length: 1 },
      }
    );
    io.to(roomId).emit("message:from:user", messageObject);

    //Send notification to mentionned users
    mentionedIds.forEach(async (el) => {
      //1-Send realtime notification
      io.to(el).emit("notification", {
        notification_type: "mention",
        room_id: roomId,
        room_name: roomName,
        date: new Date(),
        seen: false,
      });

      //2-Add notification to the database
      await User.findByIdAndUpdate(
        el,
        {
          $push: {
            notifications: {
              $each: [
                {
                  notification_type: "mention",
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
    });
  };

  const handleVoice = async ({
    messageObject,
    roomId,
    roomOwner,
    filename,
  }) => {
    let recordLink = `${messageObject.userId}${filename.split("-")[0]}${
      filename.split("-")[1]
    }${filename.split("-")[2].split(":")[0]}${
      filename.split("-")[2].split(":")[1]
    }${filename.split("-")[2].split(":")[2]}.wav`;
    messageObject.value = `${process.env.CLIENT_URL}/users/${roomOwner}/rooms/${roomId}/uploads/${recordLink}`;
    messageObject.date = new Date();
    await History.findOneAndUpdate(
      { room_id: roomId },
      {
        $push: { messages: messageObject },
        $inc: { length: 1 },
      }
    );
    io.to(roomId).emit("voice:from:user", messageObject);
  };

  const handleImage = async ({
    messageObject,
    roomId,
    roomOwner,
    filename,
    type,
  }) => {
    let imageLink = `${messageObject.userId}${filename.split("-")[0]}${
      filename.split("-")[1]
    }${filename.split("-")[2].split(":")[0]}${
      filename.split("-")[2].split(":")[1]
    }${filename.split("-")[2].split(":")[2]}.${type}`;
    messageObject.value = `${process.env.CLIENT_URL}/users/${roomOwner}/rooms/${roomId}/uploads/${imageLink}`;
    messageObject.date = new Date();
    await History.findOneAndUpdate(
      { room_id: roomId },
      {
        $push: { messages: messageObject },
        $inc: { length: 1 },
      }
    );
    io.to(roomId).emit("image:from:user", messageObject);
  };

  const handleTyping = (roomId) => {
    socket.to(roomId).emit("typing:from:user", socket.user);
  };

  const clearTypingInterval = (roomId) => {
    socket.to(roomId).emit("chat:typing:clear:timeout");
  };

  //When a message is sent
  socket.on("chat:message", handleMessage);
  //when a voice recording is sent
  socket.on("chat:voice", handleVoice);
  //Chat Image upload
  socket.on("chat:image", handleImage);
  //User typing
  socket.on("chat:typing", handleTyping);
  socket.on("chat:typing:clear:interval", clearTypingInterval);
};
